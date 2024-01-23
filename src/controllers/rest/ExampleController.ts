import { Request, Response } from 'express';
import * as ExampleService from "$services/ExampleService"
import { handleServiceErrorWithResponse, response_success } from '$utils/response.utils';

export async function get(req:Request, res:Response):Promise<Response>{
    const serviceResponse = await ExampleService.get()

    // Error handling if service response having an error : 
    if(!serviceResponse.status) return handleServiceErrorWithResponse(res, serviceResponse)

    //Return success otherwise
    return response_success(res, serviceResponse.data, "Success!")
}