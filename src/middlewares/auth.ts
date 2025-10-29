import { Request, Response, NextFunction } from 'express';
import { UNAUTHORIZED_RESPONSE } from '$entities/Service';
import { handleServiceErrorWithResponse } from '$utils/response.utils';
import { verifyAuthToken } from '$utils/jwt';
import Logger from '$pkg/logger';
import { Roles } from '@prisma/client';

export async function authMiddleware(req:Request, res:Response, next: NextFunction){
    const token = req.header('Authorization')?.split(' ')[1]

    if (!token) return handleServiceErrorWithResponse(res, UNAUTHORIZED_RESPONSE) 
    
    try {
        const decoded = verifyAuthToken(token)
        req.user = decoded 

        next()
    } catch (e) {
        Logger.error(e?.toString())
        return handleServiceErrorWithResponse(res, {
            status: false,
            err: {
                code: 500,
                message: 'Error verifying Token'
            }
        }) 
    }
}

async function isAdminMiddleware(req:Request, res:Response, next: NextFunction){
    if (req.user?.role === Roles.ADMIN) next() 
    else {
       return handleServiceErrorWithResponse(res, UNAUTHORIZED_RESPONSE) 
    }
}

export const adminMiddleware = [authMiddleware, isAdminMiddleware]

