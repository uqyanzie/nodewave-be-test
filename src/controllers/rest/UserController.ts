import { Request, Response } from 'express';
import * as UserService from "$services/UserService"
import { handleServiceErrorWithResponse, response_success } from '$utils/response.utils';
import { UNAUTHORIZED_RESPONSE } from '$entities/Service';

export async function register(req:Request, res:Response):Promise<Response>{
    const serviceResponse = await UserService.register(req.body)

    // Error handling if service response having an error : 
    if(!serviceResponse.status) return handleServiceErrorWithResponse(res, serviceResponse)

    //Return success otherwise
    return response_success(res, serviceResponse.data, "Success!")
}

export async function login(req:Request, res:Response):Promise<Response>{
    const serviceResponse = await UserService.login(req.body)

    // Error handling if service response having an error : 
    if(!serviceResponse.status) return handleServiceErrorWithResponse(res, serviceResponse)

    //Return success otherwise
    return response_success(res, serviceResponse.data, "Success!")
}

export async function profile(req:Request, res:Response) {
    
    if (!req.user) return handleServiceErrorWithResponse(res, UNAUTHORIZED_RESPONSE)

    const serviceResponse = await UserService.profile(req.user)

    if (!serviceResponse.status) return handleServiceErrorWithResponse(res, serviceResponse)
    
    return response_success(res, serviceResponse.data, "Success!")
}