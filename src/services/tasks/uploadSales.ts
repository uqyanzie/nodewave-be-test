import { ProductExcelColMapping } from "$entities/Product";
import { onAfterExecution } from "../../taskRunner/taskRegistry";
import { ExcelFileRead } from "$services/helpers/ExcelFileRead";
import { prisma } from "$utils/prisma.utils";
import * as excel from 'xlsx'
import { SalesExcelColMapping, SalesExcelMapping, SalesItemDTO, SalesItemInputDTO } from "$entities/Sales";
import { DateTime } from "luxon";
import { Roles } from "@prisma/client";
import Logger from "$pkg/logger";

export default async function uploadSales(payload: { uploadId: number }) {
    const upload = await prisma.fileUpload.findFirst({ where: { id: payload.uploadId }})

    if (!upload) return onAfterExecution(payload.uploadId, 'failed')

    const file = await (await fetch(upload.fileUrl)).arrayBuffer()

    const workbook = excel.read(file)

    const excelUploadHandler = new ExcelFileRead(workbook, SalesExcelMapping)

    const res = excelUploadHandler.extractWorkbookData()

    if (!res.status) {
        return onAfterExecution(payload.uploadId, 'failed', res.errorItems)
    }

    const {items, errorItems} = res

    if (!items || items.length < 2) return onAfterExecution(payload.uploadId, 'failed', res.errorItems)

    const uniqueReceiptNumbers = [...new Set(items.map(item => item.receiptNumber))]

    for (const receiptNumber of uniqueReceiptNumbers) {
        const existingSales = await prisma.sales.findFirst({ where: { receiptNumber }})

        if (existingSales) {
            // push errItems existing rceiptNumber
            // log existing receiptNumber conflict
            errorItems.push({
                rowNumber: items.map(i => i.receiptNumber).indexOf(receiptNumber),
                message: 'duplicate sku code',
                col: Object.keys(SalesExcelColMapping).find(k => SalesExcelColMapping[k] === 'receiptNumber'),
                found: receiptNumber
            })
            Logger.error(`conflicting receiptNumber ${existingSales.receiptNumber}`)
            continue 
        }

        const salesItemsPerReceipt = items.filter(item => item.receiptNumber === receiptNumber)

        let totalPrice = 0
        const firstItem =  salesItemsPerReceipt[0]
        const seller = await prisma.user.findFirst({ where: { role: Roles.USER, email: firstItem.sellerEmail }})
        
        if  (!seller) {
            errorItems.push({
                rowNumber: items.map(i => i.sellerEmail).indexOf(firstItem.sellerEmail),
                message: 'email not registered',
                col: Object.keys(SalesExcelColMapping).find(k => SalesExcelColMapping[k] === 'sellerEmail'),
                found: receiptNumber
            })
            Logger.error(`Seller email not registered ${firstItem.sellerEmail}`)
            continue
        } 
        
        const discount = firstItem.discount

        if (discount < 0 || discount > 1) {
            errorItems.push({
                rowNumber: items.map(i => i.receiptNumber).indexOf(firstItem.receiptNumber),
                message: 'wrong discount value',
                col: Object.keys(SalesExcelColMapping).find(k => SalesExcelColMapping[k] === 'discount'),
                found: receiptNumber
            })
            Logger.error(`Seller email not registered ${firstItem.sellerEmail}`)
            continue
        }
        
        const saleItems : SalesItemInputDTO[] = []
        for (const item of salesItemsPerReceipt) {
            totalPrice += item.sellPrice * item.quantity
            const product = await prisma.product.findFirst({ where: { skuCode : item.productSku }})
            if (!product) continue
            saleItems.push({ productId: product.id, quantity: item.quantity, sellPrice: item.sellPrice  })
        }

        const totalPriceDiscount = discount ? totalPrice - (totalPrice * discount) : null

        const sales = await prisma.sales.create({
            data: {
                receiptNumber,
                totalPrice,
                totalPriceDiscount: totalPriceDiscount ?? totalPrice,
                transactionDate: DateTime.fromJSDate(new Date(firstItem.transactionDate)).toFormat('YYYY-MM-DD'),
                transactionTime: firstItem.transactionTime,
                discount: firstItem.discount, 
                sellerId: seller.id
            }
        })

        await prisma.salesItem.createMany({
            data: saleItems.map(item => ({
                ...item,
                salesId: sales.id
            }))
        })
    }

    return onAfterExecution(payload.uploadId, 'success', res.errorItems)
}