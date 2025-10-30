// src/modules/taskRunner/taskQueue.ts
import { TaskHandler, taskRegistry } from "./taskRegistry";
import { createTaskLog, updateTaskLog } from "./taskLogger";
import { TaskIdentifier, TaskLogData, TaskPayloadMap } from "./types";
import { prisma } from "$utils/prisma.utils";

interface TaskItem<K extends TaskIdentifier> {
  logId: number;
  taskIdentifier: K;
  payload: TaskPayloadMap[K];
}

class TaskQueue {
  private queue: TaskItem<TaskIdentifier>[] = [];
  private isRunning = false;

  async enqueue<K extends TaskIdentifier>(taskLog: TaskLogData, retryLogId?: number) {
    // buat log entry baru jika bukan retry
    const logId = retryLogId ?? await createTaskLog(taskLog);
    this.queue.push({ taskIdentifier : taskLog.taskIdentifier, payload: taskLog.payload, logId });
    void this.processQueue();
    return logId;
  }

  private async processQueue(): Promise<void> {
    if (this.isRunning || this.queue.length === 0) return;

    this.isRunning = true;
    const { taskIdentifier, payload, logId } = this.queue.shift()!;
    const startedAt = new Date();

    await updateTaskLog(logId, { status: "in progress", ts: startedAt, payload, taskIdentifier });

    let status: "success" | "failed" = "success";
    let errorMessage: string | null = null;

    try {
      const fn = taskRegistry[taskIdentifier] as (p: any) => Promise<void>;
      await fn(payload);
    } catch (err: any) {
      status = "failed";
      errorMessage = err?.message ?? "Unknown error";
      console.error(`❌ Task ${taskIdentifier} failed:`, err);
    } finally {
      await updateTaskLog(logId, {
        status,
        errorMessage,
        ts: new Date(),
        payload,
        taskIdentifier
      });

      this.isRunning = false;
      if (this.queue.length > 0) void this.processQueue();
    }
  }

  async retry(jobId: number) {
    const taskLog = await prisma.taskJob.findFirst({where:{ id: jobId }});

    if (!taskLog) throw new Error(`Task with ID ${jobId} not found`);

    await prisma.taskJob.update({
      where:{ id: jobId },
      data: {
        status: 'queued'
      }
    });
    
    this.queue.push({
      logId: taskLog.id,
      taskIdentifier: taskLog.taskIdentifier as TaskIdentifier,
      payload: taskLog.payload as TaskPayloadMap[TaskIdentifier]
    });
    
    void this.processQueue();

    return {
      message: `Task ${jobId} enqueued for retry`,
      task: taskLog,
    };
  }
}

const taskQueue = new TaskQueue();

export default taskQueue