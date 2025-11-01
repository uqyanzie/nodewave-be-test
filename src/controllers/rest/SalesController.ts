import { Request, Response } from 'express';
import * as SalesService from "$services/SalesService"
import { handleServiceErrorWithResponse, response_success } from '$utils/response.utils';

import { checkFilteringQueryV2 } from '$controllers/helpers/CheckFilteringQuery';

export async function uploadSales(req:Request, res:Response):Promise<Response>{
    const serviceResponse = await SalesService.uploadSales({ file: req.file, fileUrl: req.body?.fileUrl as string, fileName: req.body?.fileName })

    // Error handling if service response having an error : 
    
    if(!serviceResponse.status) {
        return handleServiceErrorWithResponse(res, serviceResponse)
    }

    //Return success otherwise
    return response_success(res, serviceResponse.data, "Success!")
}

export async function getSales(req:Request, res:Response):Promise<Response>{
    const filter = checkFilteringQueryV2(req)
    
    const serviceResponse = await SalesService.getSales(filter)

    // Error handling if service response having an error : 
    if(!serviceResponse.status) {
        return handleServiceErrorWithResponse(res, serviceResponse)
    }

    //Return success otherwise
    return response_success(res, serviceResponse.data, "Success!")
}

export async function getSalesFiles(req:Request, res:Response):Promise<Response>{
    const filter = checkFilteringQueryV2(req)
    
    const serviceResponse = await SalesService.getSalesFiles(filter)

    // Error handling if service response having an error : 
    if(!serviceResponse.status) {
        return handleServiceErrorWithResponse(res, serviceResponse)
    }

    //Return success otherwise
    return response_success(res, serviceResponse.data, "Success!")
}