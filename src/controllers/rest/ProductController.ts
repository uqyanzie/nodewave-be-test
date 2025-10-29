import { Request, Response } from 'express';
import * as ProductService from "$services/ProductService"
import { handleServiceErrorWithResponse, response_success } from '$utils/response.utils';
import Logger from '$pkg/logger';


export async function uploadProduct(req:Request, res:Response):Promise<Response>{
    const serviceResponse = await ProductService.uploadProducts({ file: req.file, fileUrl: req.body?.fileUrl as string})

    // Error handling if service response having an error : 
    
    if(!serviceResponse.status) {
        return handleServiceErrorWithResponse(res, serviceResponse)
    }

    //Return success otherwise
    return response_success(res, serviceResponse.data, "Success!")
}

export async function getProducts(req:Request, res:Response):Promise<Response>{
    const serviceResponse = await ProductService.getProducts((req.query))

    // Error handling if service response having an error : 
    
    if(!serviceResponse.status) {
        return handleServiceErrorWithResponse(res, serviceResponse)
    }

    //Return success otherwise
    return response_success(res, serviceResponse.data, "Success!")
}