import { Request, Response } from 'express';
import * as ProductService from "$services/ProductService"
import { handleServiceErrorWithResponse, response_success } from '$utils/response.utils';
import Logger from '$pkg/logger';
import { FilteringQueryV2 } from '$entities/Query';
import { checkFilteringQueryV2 } from '$controllers/helpers/CheckFilteringQuery';


export async function uploadProduct(req:Request, res:Response):Promise<Response>{
    const serviceResponse = await ProductService.uploadProducts({ file: req.file, fileUrl: req.body?.fileUrl as string, fileName: req.body?.fileName })

    // Error handling if service response having an error : 
    
    if(!serviceResponse.status) {
        return handleServiceErrorWithResponse(res, serviceResponse)
    }

    //Return success otherwise
    return response_success(res, serviceResponse.data, "Success!")
}

export async function getProducts(req:Request, res:Response):Promise<Response>{
    const filter = checkFilteringQueryV2(req)
    
    const serviceResponse = await ProductService.getProducts(filter)

    // Error handling if service response having an error : 
    if(!serviceResponse.status) {
        return handleServiceErrorWithResponse(res, serviceResponse)
    }

    //Return success otherwise
    return response_success(res, serviceResponse.data, "Success!")
}

export async function getProductFiles(req:Request, res:Response):Promise<Response>{
    const filter = checkFilteringQueryV2(req)
    
    const serviceResponse = await ProductService.getProductFiles(filter)

    // Error handling if service response having an error : 
    if(!serviceResponse.status) {
        return handleServiceErrorWithResponse(res, serviceResponse)
    }

    //Return success otherwise
    return response_success(res, serviceResponse.data, "Success!")
}