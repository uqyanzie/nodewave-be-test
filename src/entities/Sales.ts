import { ExcelColMapping, HeaderMap } from "$utils/commons";
import { ExcelRowTypeMap, ExcelUploadMappingType } from "./Upload";

export interface SalesDTO {
    id: number;
    sellerId: number;
    receiptNumber: string;
    transactionTime: Date;
    transactionDate: string | Date;
    discount?: number | null; // should be 0 > discount < 1
    totalPrice: number;
    totalPriceDiscount: number;
    salesItems : SalesItemDTO[]
}

export interface SalesItemDTO {
    id: number;
    salesId: number;
    productId: number;
    quantity: number;
    sellPrice: number;
};

export interface SalesItemInputDTO {
    productId: number;
    quantity: number;
    sellPrice: number;
};

export type SalesExcelRowDTO = {
    sellerEmail: string
    receiptNumber: string
    transactionDate: Date
    transactionTime: string
    discount: number
    productSku: string
    quantity: number
    sellPrice: number 
}

const SalesExcelRowTypeMap : ExcelRowTypeMap = {
    sellerEmail: 'string',
    sellerName: 'string',
    receiptNumber: 'string',
    transactionDate: 'date',
    transactionTime: 'time',
    discount: 'number',
    productSku: 'string',
    productName: 'string',
    quantity: 'number',
    sellPrice: 'number' 
}

export const SalesExcelColMapping: ExcelColMapping = {
    B: 'sellerEmail',
    C: 'sellerName',
    D: 'receiptNumber',
    E: 'transactionDate',
    F: 'transactionTime',
    G: 'discount',
    H: 'productSku',
    I: 'productName',
    J: 'quantity',
    K: 'sellPrice'
}

const SalesHeaderMap: HeaderMap = {
    A1: 'NO',
    B1: 'SELLER EMAIL',
    C1: 'SELLER NAME',
    D1: 'RECEIPT NUMBER', 
    E1: 'TRANSACTION DATE (YYYY-MM-DD)',
    F1: 'TRANSACTION TIME (HH:mm:ss)',
    G1: 'DISCOUNT (IN DECIMAL e.g. 0.01 - 0.99)',
    H1: 'PRODUCT SKU CODE',
    I1: 'PRODUCT SKU NAME',
    J1: 'QUANTITY',
    K1: 'SALE PRICE'
}

export const SalesExcelMapping : ExcelUploadMappingType<SalesExcelRowDTO> = {
    colMapping: SalesExcelColMapping,
    headerMap: SalesHeaderMap,
    excelRowTypeMap: SalesExcelRowTypeMap,
} 