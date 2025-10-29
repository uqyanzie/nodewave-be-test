import { PaginationResponse } from "$entities/Pagination";
import { ProductDTO } from "$entities/Product";
import { FilteringQueryV2 } from "$entities/Query";
import { BadRequestWithMessage, ServiceResponse } from "$entities/Service";
import { FileUploadDAO } from "$entities/Upload";
import Logger from "$pkg/logger";
import { uploadFileHandler } from "$pkg/minio/minioClient";
import taskQueue from "$taskRunner/taskQueue";
import { prisma } from "$utils/prisma.utils";
import { UploadFileType } from "@prisma/client";
import { buildFilterQueryLimitOffsetV2 } from "./helpers/FilterQueryV2";

export async function getProducts(filter: FilteringQueryV2) : Promise<ServiceResponse<PaginationResponse<ProductDTO>>> {
    const filterQuery = buildFilterQueryLimitOffsetV2(filter)
    const data = await prisma.product.findMany(filterQuery)

    return {
        status: true,
        data: {
            items: data,
            page: filter?.page ?? 1,
            take: filterQuery?.take
        }
    }
}

export async function uploadProducts(body: { file?: Express.Multer.File, fileUrl?: string, fileName?: string}) : Promise<ServiceResponse<string>>{
    const {file, fileUrl, fileName} = body
    
    const taskIdentifier = 'uploadProducts'

    if (!file && !fileUrl) return BadRequestWithMessage('Invalid Request, please send a file or a url')

    let saveFileName: string = ''
    
    let url = fileUrl
    if (fileUrl) {
        const res = await fetch(fileUrl)
        const contentDisposition = res.headers.get('Content-Disposition') 
        if (contentDisposition) {
            const filenameMatch = contentDisposition.match(/filename\*?=(?:[^;]*'')?([^;]+)/);
            if (filenameMatch && filenameMatch[1]) {
                // Decode the filename, handling potential UTF-8 encoding
                saveFileName = decodeURIComponent(filenameMatch[1].replace(/^utf-8''/, ''));
            }
        } else {
            const urlParts = fileUrl.split('/');
            saveFileName = decodeURIComponent(urlParts[urlParts.length - 1].replace(/^utf-8''/, ''));;
        }
    }

    if (file) {
        const [_originalFileName, extension] = file.originalname.split('.')

        if (file.mimetype.split('/')[1] !== 'vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            return BadRequestWithMessage('Invalid file extension, please insert a file with xlsx extension')
        }

        saveFileName = fileName ? `${fileName}.${extension}` :  `${_originalFileName}_${new Date().getTime()}.${extension}`
        url = await uploadFileHandler(file, saveFileName)   
    }

    if (!url) {
        return BadRequestWithMessage('invalid url')
    }

    const upload = await prisma.fileUpload.create({
        data: {
            fileUrl: url,
            fileName: saveFileName,
            taskIdentifier,
            uploadType: file ? UploadFileType.FILE : UploadFileType.URL,
            status: 'pending',
        }
    })

    const job = await taskQueue.enqueue({
        taskIdentifier,
        payload: {
            uploadId: upload.id
        },
        ts: new Date(),
        status: 'queued'
    })

    await prisma.fileUpload.update({
        data: {
            status: 'queued',
            jobId: job
        },
        where: {
            id: upload.id
        }
    })
    return {
        status: true,
        data: 'queued'
    }
}

export async function getProductFiles (filter: FilteringQueryV2) : Promise<ServiceResponse<PaginationResponse<FileUploadDAO>>> {
    const filterQuery = buildFilterQueryLimitOffsetV2(filter)
    
    const data = await prisma.fileUpload.findMany({
        select: {
            id: true,
            jobId: true,
            fileUrl: true,
            fileName: true,
            taskIdentifier: true,
            status: true,
            errRows: true,
            uploadType: true,
            createdAt: true,
            errors: false
        },
        where: {
            taskIdentifier: 'uploadProducts',
            ...filterQuery.where
        },
        ...filterQuery
    })

    return {
        status: true,
        data: {
            items: data,
            page: filter?.page ?? 1,
            take: filterQuery?.take
        }
    }
}