export type TaskIdentifier = keyof TaskPayloadMap;

export interface TaskPayloadMap {
    uploadProduct: { uploadId: number };
    uploadSales: { uploadId: number };
    uploadUsers: { uploadId: number };
}

export interface TaskLogData {
    taskIdentifier: TaskIdentifier;
    payload: any;
    status?: "queued" | "in progress" | "success" | "failed";
    errorMessage?: string | null;
    ts: Date;
}