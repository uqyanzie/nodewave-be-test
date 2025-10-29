// src/modules/taskRunner/taskLogger.ts
import { prisma } from "$utils/prisma.utils";
import { TaskLogData } from "./types";

export async function createTaskLog(log: TaskLogData): Promise<number> {
    try {
        const taskJob = await prisma.taskJob.create({
            data: {
                taskIdentifier: log.taskIdentifier,
                payload: log.payload,
                status: log.status ?? 'queued',
                errorMessage: log.errorMessage,
                lastExecutionAt: log.ts,
                createdAt: log.ts
            }
        });

        return taskJob.id
    } catch (e) {
        throw new Error('Error Executing Task')
    }
}

export async function updateTaskLog(
    id: number,
    data: TaskLogData
  ): Promise<void> {
    const taskJob = await prisma.taskJob.findFirst({where: {id: id}})

    if (!taskJob) {
        //logging
        return
    }

    await prisma.taskJob.update({
        where: {
            id : taskJob.id,
        },
        data: {
            status : data.status,
            lastExecutionAt: data.ts,
            finishedAt: data.status === 'success' ? data.ts : null
        }
    })
}
