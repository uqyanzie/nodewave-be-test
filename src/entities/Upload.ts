
import { ExcelColMapping, HeaderMap } from "$utils/commons"
import { JsonValue } from "@prisma/client/runtime/library";

export type Cell =
    // check https://docs.sheetjs.com/docs/csf/cell#cell-types
    | { t: 's'; v: string }
    | { t: 'd'; v: Date }
    | { t: 'n'; v: number }
    | { t: 'z' } // blank data
    | { t: 'e'; w: unknown } // unknown

export type ExcelUploadMappingType<T> = {
    colMapping: ExcelColMapping
    headerMap: HeaderMap
    excelRowType: ExcelRowType
}

export type ExcelErrorItem = {
    rowNumber: number
    message: string
    col?: string
    expected?:string
    found?: Cell | string | number
}

export type ExcelRowType = Record<string, 'string' | 'number'>

export type ExcelRowItem<T> = {  rowNumber : number } & T

export interface FileUploadDAO  {
    id: number;
    jobId?: number | null;
    taskIdentifier: string;
    status: string;
    fileUrl: string;
    errors: JsonValue;
    createdAt: Date;
}