import uploadProducts from "$services/tasks/uploadProducts";
import uploadSales from "$services/tasks/uploadSales";
import uploadUsers from "$services/tasks/uploadUsers";
import { TaskPayloadMap } from "./types";
import {prisma} from "$utils/prisma.utils"
import { ExcelErrorItem } from "$entities/Upload";

export type TaskHandler<K extends keyof TaskPayloadMap> = (
    payload: TaskPayloadMap[K] 
) => Promise<void>;

export const taskRegistry : {
    [K in keyof TaskPayloadMap] : TaskHandler<K> 
} = {
    uploadProducts: uploadProducts,
    uploadSales: uploadSales,
    uploadUsers: uploadUsers
}

export async function onAfterExecution(uploadId: number, status: string, errors?: ExcelErrorItem[]) {
    await prisma.fileUpload.update({
        where: {id: uploadId},
        data: {
            status,
            errors: errors ? JSON.parse(JSON.stringify(errors)) : undefined
        }
    })
}