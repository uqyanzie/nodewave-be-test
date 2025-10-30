import { Request, Response } from 'express';
import * as FileService from "$services/FileService"
import { handleServiceErrorWithResponse, response_success } from '$utils/response.utils';
import Logger from '$pkg/logger';
import { checkFilteringQueryV2 } from '$controllers/helpers/CheckFilteringQuery';
import { BadRequestWithMessage } from '$entities/Service';


export async function getFiles(req:Request, res:Response):Promise<Response>{
    const filter = checkFilteringQueryV2(req)
    
    const serviceResponse = await FileService.getFiles(filter)

    // Error handling if service response having an error : 
    if(!serviceResponse.status) {
        return handleServiceErrorWithResponse(res, serviceResponse)
    }

    //Return success otherwise
    return response_success(res, serviceResponse.data, "Success!")
}

export async function getFileDetail(req:Request, res:Response):Promise<Response>{
    const id = req.params.id
    
    if (!id) return handleServiceErrorWithResponse(res, BadRequestWithMessage('Invalid ID!'))
    
    if (isNaN(parseInt(id as string))) return handleServiceErrorWithResponse(res, BadRequestWithMessage('Invalid ID!'))

    const serviceResponse = await FileService.getFileDetail(parseInt(id))

    // Error handling if service response having an error : 
    if(!serviceResponse.status) {
        return handleServiceErrorWithResponse(res, serviceResponse)
    }

    //Return success otherwise
    return response_success(res, serviceResponse.data, "Success!")
}

export async function retryFileProcess(req:Request, res:Response):Promise<Response>{
    const jobId = req.params.jobId
    
    if (!jobId) return handleServiceErrorWithResponse(res, BadRequestWithMessage('Invalid ID!'))
    
    if (isNaN(parseInt(jobId as string))) return handleServiceErrorWithResponse(res, BadRequestWithMessage('Invalid ID!'))

    const serviceResponse = await FileService.retryFileProcess(parseInt(jobId))

    // Error handling if service response having an error : 
    if(!serviceResponse.status) {
        return handleServiceErrorWithResponse(res, serviceResponse)
    }

    //Return success otherwise
    return response_success(res, serviceResponse.data, "Success!")
}