import { ProductExcelColMapping, ProductExcelMapping } from "$entities/Product";
import { onAfterExecution } from "../../taskRunner/taskRegistry";
import { ExcelFileRead } from "$services/helpers/ExcelFileRead";
import { prisma } from "$utils/prisma.utils";
import * as excel from 'xlsx'

export default async function uploadProducts(payload: { uploadId: number }) {
    const upload = await prisma.fileUpload.findFirst({ where: { id: payload.uploadId }})

    if (!upload) return onAfterExecution(payload.uploadId, 'failed')

    const file = await (await fetch(upload.fileUrl)).arrayBuffer()

    const workbook = excel.read(file)

    const excelUploadHandler = new ExcelFileRead(workbook, ProductExcelMapping)

    const res = excelUploadHandler.extractWorkbookData()

    if (!res.status) {
        return onAfterExecution(payload.uploadId, 'failed', res.errorItems)
    }

    const {items, errorItems} = res

    if (!items || items.length < 2) return onAfterExecution(payload.uploadId, 'failed', res.errorItems)

    for (const item of items) {
        const checkProduct = await prisma.product.findFirst({where: {skuCode : item.skuCode}})
        if (checkProduct) {
            errorItems.push({
                rowNumber: item.rowNumber,
                message: 'duplicate sku code',
                col: Object.keys(ProductExcelColMapping).find(k => ProductExcelColMapping[k] === 'skuCode'),
                found: item.skuCode
            })
            continue
        }

        const {rowNumber, ...data} = item

        await prisma.product.create({data})
    }

    return onAfterExecution(payload.uploadId, 'success', res.errorItems)
}