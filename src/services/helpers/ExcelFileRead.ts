import { Cell, ExcelErrorItem, ExcelRowItem, ExcelRowType, ExcelUploadMappingType } from '$entities/Upload';
import Logger from '$pkg/logger';
import { ExcelColMapping, HeaderMap } from '$utils/commons';
import * as excel from 'xlsx'

export class ExcelFileRead<T extends Record<string,any>> {
    private workbook: excel.WorkBook

    private headerMap : HeaderMap
    private colMap: ExcelColMapping
    private excelRowType: ExcelRowType

    constructor(workbook: excel.WorkBook, excelMapping: ExcelUploadMappingType<T>) {
        this.workbook = workbook
        this.headerMap = excelMapping.headerMap
        this.colMap = excelMapping.colMapping
        this.excelRowType = excelMapping.excelRowType
    }

    private extractItemsFromSheet(sheet: excel.WorkSheet, lastRowIdx: number) {
        const items: ExcelRowItem<T>[] = []
        const errorItems: ExcelErrorItem[] = []
    
        for(let i = 2; i <= lastRowIdx; i++) {
            let cell: Cell
            const item : ExcelRowItem<T> = { rowNumber: i } as ExcelRowItem<T>

            Object.assign(item, { rowNumber: i})
            
            for (const col of Object.keys(this.colMap)) {
                cell = sheet[`${col}${i}`]
                switch(this.excelRowType[this.colMap[col]]) {
                    case 'string' : {
                        if (cell?.t === 's' && typeof cell?.v === 'string') {
                            Object.assign(item, { [this.colMap[col]]: cell.v})
                        } else {
                            errorItems.push({
                                rowNumber: i,
                                message: `unable to extract ${this.colMap[col]} from cell`,
                                col: col,
                                expected: 'string',
                                found: cell ?? 'null',
                            })
                        }
                    }
                    break;
                    case 'number' : {
                        if (cell?.t === 'n' && typeof cell?.v === 'number') {
                            Object.assign(item, { [this.colMap[col]]: cell.v})
                        } else {
                            errorItems.push({
                                rowNumber: i,
                                message: `unable to extract ${this.colMap[col]} from cell`,
                                col: col,
                                expected: 'number',
                                found: cell ?? 'null',
                            })
                        }
                    }
                }
            }
            items.push(item)
        }

        return {items, errorItems}
    }

    public extractWorkbookData() : {status: boolean, message?: string, items: ExcelRowItem<T>[], errorItems: ExcelErrorItem[]} {
        const sheet = this.workbook.Sheets[this.workbook.SheetNames[0]]
    
        const activeRange = sheet['!ref']
    
        const activeRangeSplit = activeRange?.split(':') ?? []
    
        if (activeRangeSplit?.length < 2) {
            const message = 'sheet range to small'
            Logger.warn(message)
            return {
                status: false,
                message,
                errorItems: [],
                items: []
            }
        }
    
        const lastRowIdxStr = activeRangeSplit[1].match(/\d+$/)
        const lastRowIdx = Number(lastRowIdxStr?.[0])
        if (!Number.isInteger(lastRowIdx)) {
            const message = 'sheet range to small'
            Logger.warn(message)
            return {
                status: false,
                message,
                errorItems: [],
                items: []
            }
        }

        if (lastRowIdx < 1) {
            const message = 'sheet row to small'
            Logger.warn(message)
            return {
                status: false,
                message,
                errorItems: [],
                items: []
            }
        }
        
        for (const chk of Object.entries(this.headerMap)) {
            const [ref, expected] = chk
            const cellContent = sheet[ref] as Cell
            if (
                !(
                    typeof cellContent?.t === 'string' &&
                    cellContent.t === 's' &&
                    (cellContent.v as string)?.trim().toLowerCase() === expected.toLowerCase()
                )
            ) {
                const message = 'headers not match'
                Logger.warn(message)
                return {
                    status: false,
                    message,
                    errorItems: [],
                    items: []
                }
            }
        }

        return {
            status: true,
            message: 'Success!',
            ...this.extractItemsFromSheet(sheet, lastRowIdx)
        }
    }
}