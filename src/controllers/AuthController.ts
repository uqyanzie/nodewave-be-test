import { Request, Response } from 'express';
import { UserLoginDTO, UserRegisterDTO, UserJWTDAO } from '$entities/User';
import * as AuthService from '$services/AuthService';
import { handleServiceErrorWithResponse } from '$utils/response.utils';
import { response_success, response_bad_request } from '../utils/response.utils';



export async function login(req:Request,res:Response):Promise<Response>{
    const data:UserLoginDTO = req.body;
    const serviceResponse = await AuthService.logIn(data);

    if(!serviceResponse.status){
        return handleServiceErrorWithResponse(res, serviceResponse)
    }

    return response_success(res, serviceResponse.data, "Successfully Logged In!");
}

export async function register(req:Request,res:Response):Promise<Response>{
    const data:UserRegisterDTO = req.body;
    const serviceResponse = await AuthService.register(data);

    if(!serviceResponse.status){
        return handleServiceErrorWithResponse(res, serviceResponse)
    }

    return response_success(res, serviceResponse.data, "Successfully Logged In!");
}

export function verifyToken(req:Request,res:Response):Response{
     const {token} = req.body;
    const serviceResponse = AuthService.verifyToken(token);

    if(!serviceResponse.status){
        return handleServiceErrorWithResponse(res, serviceResponse)
    }

    return response_success(res, serviceResponse.data, "Token Verified!");
}

export async function changePassword(req:Request, res:Response):Promise<Response>{
    const {newPassword, oldPassword} = req.body;
    const invalidFields:any = [];
    if(!newPassword) invalidFields.push("newPassword is required")
    if(!oldPassword) invalidFields.push("oldPassword is required")

    const user:UserJWTDAO = res.locals.jwtPayload
    if(invalidFields.length > 0) return response_bad_request(res, "Invalid Fields", invalidFields)

    const serviceResponse = await AuthService.changePassword(user.id, oldPassword, newPassword);

    if(!serviceResponse.status){
        return handleServiceErrorWithResponse(res, serviceResponse)
    }

    return response_success(res, serviceResponse.data, "Successfully changed password!");
}