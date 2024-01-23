// import { UserRegisterPayload } from '$entities/User';
// import { NextFunction, Request, Response } from 'express';
// import { response_bad_request } from '../utils/response.utils';
// import { UserLoginPayload } from '../entities/User';
// import { prisma } from '../utils/prisma.utils';

// function validateEmailFormat (email:string):boolean{
//     const expression: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
//     return expression.test(email)
// }

// export async function validateRegisterPayload(req:Request, res:Response, next:NextFunction){

//     const data:UserRegisterPayload = req.body;

//     const invalidFields = [];
//     if(!data.email) invalidFields.push("email is required")
//     if(!data.fullName) invalidFields.push("fullname is required")
//     if(!validateEmailFormat(data.email)) invalidFields.push("email format is invalid")
//     if(!data.password) invalidFields.push("password is required")
        
//     const userExist = await prisma.user.findUnique({
//         where:{
//             email:data.email
//         }
//     })

//     if(userExist != null){
//         invalidFields.push("email already used")
//     }
//     if(invalidFields.length > 0){
//         return response_bad_request(res, "Bad Request", invalidFields);
//     }

//     next();
// }

// export async function validateLoginPayload(req:Request, res:Response, next:NextFunction){

//     const data:UserLoginPayload = req.body;

//     const invalidFields = [];
//     if(!data.email) invalidFields.push("email is required")
//     if(!validateEmailFormat(data.email)) invalidFields.push("email format is invalid")
//     if(!data.password) invalidFields.push("password is required")

//     if(invalidFields.length > 0){
//         return response_bad_request(res, "Bad Request", invalidFields);
//     }



//     next();
// }