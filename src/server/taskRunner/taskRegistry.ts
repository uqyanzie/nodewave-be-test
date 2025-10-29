import uploadProducts from "./tasks/uploadProducts";
import uploadSales from "./tasks/uploadSales";
import uploadUsers from "./tasks/uploadUsers";
import { TaskPayloadMap } from "./types";

export type TaskHandler<K extends keyof TaskPayloadMap> = (
    payload: TaskPayloadMap[K] 
) => Promise<void>;

export const taskRegistry : {
    [K in keyof TaskPayloadMap] : TaskHandler<K> 
} = {
    uploadProduct: uploadProducts,
    uploadSales: uploadSales,
    uploadUsers: uploadUsers
}