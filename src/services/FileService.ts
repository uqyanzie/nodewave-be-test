import { PaginationResponse } from "$entities/Pagination";
import { ProductDTO } from "$entities/Product";
import { FilteringQueryV2 } from "$entities/Query";
import { BadRequestWithMessage, INVALID_ID_SERVICE_RESPONSE, ServiceResponse } from "$entities/Service";
import { FileUploadDAO } from "$entities/Upload";
import Logger from "$pkg/logger";
import { uploadFileHandler } from "$pkg/minio/minioClient";
import taskQueue from "$taskRunner/taskQueue";
import { prisma } from "$utils/prisma.utils";
import { UploadFileType } from "@prisma/client";
import { buildFilterQueryLimitOffsetV2 } from "./helpers/FilterQueryV2";

export async function getFiles (filter: FilteringQueryV2) : Promise<ServiceResponse<PaginationResponse<FileUploadDAO>>> {
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

export async function getFileDetail(id: number) : Promise<ServiceResponse<FileUploadDAO>> {
    const data = await prisma.fileUpload.findFirst({where: { id }})

    if (!data) return INVALID_ID_SERVICE_RESPONSE

    return {
        status: true,
        data
    }
}

export async function retryFileProcess(jobId: number) : Promise<ServiceResponse<{}>> {
    const data = await prisma.fileUpload.findFirst({where: { jobId }})

    if (!data) return INVALID_ID_SERVICE_RESPONSE

    if (data.status === 'success') {
        return { 
            status: true,
            data: 'File already successfully processed'
        }
    }

    await taskQueue.retry(data.jobId!)

    return { 
        status: true,
        data: 'queued'
    }
}