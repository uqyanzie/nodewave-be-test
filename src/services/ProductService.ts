import { PaginationResponse } from "$entities/Pagination";
import { ProductDTO } from "$entities/Product";
import { FilteringQueryV2 } from "$entities/Query";
import { BadRequestWithMessage, ServiceResponse } from "$entities/Service";
import { uploadFileHandler } from "$pkg/minio/minioClient";
import taskQueue from "$taskRunner/taskQueue";
import { prisma } from "$utils/prisma.utils";
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

export async function uploadProducts(body: { file?: Express.Multer.File, fileUrl?: string}) : Promise<ServiceResponse<string>>{
    const {file, fileUrl} = body
    
    const taskIdentifier = 'uploadProducts'

    if (!file && !fileUrl) return BadRequestWithMessage('Invalid Request, please send a file or a url')

    let url = fileUrl

    if (file) {
        if (file.mimetype.split('/')[1] !== 'vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            return BadRequestWithMessage('Invalid file extension, please insert a file with xlsx extension')
        }
        url = await uploadFileHandler(file)
    }

    if (!url) {
        return BadRequestWithMessage('invalid url')
    }

    const upload = await prisma.fileUpload.create({
        data: {
            fileUrl: url,
            taskIdentifier,
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