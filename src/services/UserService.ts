import { BadRequestWithMessage, INTERNAL_SERVER_ERROR_SERVICE_RESPONSE, INVALID_ID_SERVICE_RESPONSE, ServiceResponse } from "$entities/Service";
import { exclude, UserJWTDAO, UserLoginDTO, UserRegisterDTO, UserRegisterValidator } from "$entities/User";
import Logger from '$pkg/logger';
import { comparePassword, hashPassword } from "$utils/hash";
import { genAuthToken } from "$utils/jwt";
import { prisma } from "$utils/prisma.utils";

export async function register(body : UserRegisterDTO):Promise<ServiceResponse<{token: string}>>{
    const { data, error } = UserRegisterValidator.safeParse(body)

    if (error) {
        return BadRequestWithMessage(error.message)
    }

    const checkExistingEmail = await prisma.user.findFirst({
        where: {
            email: data.email
        }
    })

    if (checkExistingEmail) {
        return BadRequestWithMessage('Email Already Registered, please use another email')
    }

    try{
        const user = await prisma.user.create({ data: {
            ...data,
            password: hashPassword(data.password)
        } })

        const token = genAuthToken(exclude(user, 'password'))

        return {
            status: true,
            data: {
                token: token
            }
        }

    }catch(err){
        Logger.error(`ExampleService.get : ${err}`)
        return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE
    }
}

export async function login(body : UserLoginDTO):Promise<ServiceResponse<{token : string}>>{
    if (!body.email || !body.password) {
        return BadRequestWithMessage('Please fill all the required fields')
    }

    
    const user = await prisma.user.findFirst({
        where: {
            email: body.email
        }
    })

    if (!user || !comparePassword(body.password, user?.password)) {
        return INVALID_ID_SERVICE_RESPONSE
    }

    const token = genAuthToken(exclude(user, 'password'))

    return {
        status: true,
        data: {
            token: token
        }
    }
}

export async function profile(body: UserJWTDAO): Promise<ServiceResponse<UserJWTDAO>> {
    return {
        status: true,
        data: body 
    }
}