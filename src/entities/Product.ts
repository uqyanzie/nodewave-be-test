import { ExcelColMapping, HeaderMap } from "$utils/commons";
import { ExcelRowType, ExcelUploadMappingType } from "./Upload";

export interface ProductDTO {
    skuCode: string;
    name: string;
    category: string;
    weight: number;
    unit: string;
    bottomPrice: number;
}

const ProductExcelRowType : ExcelRowType = {
    skuCode: 'string',
    name: 'string',
    category: 'string',
    weight: 'number',
    unit: 'string',
    bottomPrice: 'number',
}

export const ProductExcelColMapping: ExcelColMapping = {
    B: 'skuCode',
    C: 'name',
    D: 'category',
    E: 'weight',
    F: 'unit',
    G: 'bottomPrice'
}

const ProductHeaderMap: HeaderMap = {
    A1: 'NO',
    B1: 'SKU CODE',
    C1: 'NAME',
    D1: 'CATEGORY',
    E1: 'WEIGHT (GR)',
    F1: 'UNIT',
    G1: 'BOTTOM PRICE (IDR)'
}

export const ProductExcelMapping : ExcelUploadMappingType<ProductDTO> = {
    colMapping: ProductExcelColMapping,
    headerMap: ProductHeaderMap,
    excelRowType: ProductExcelRowType,
} 
