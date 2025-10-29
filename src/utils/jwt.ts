import { UserJWTDAO } from '$entities/User'
import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET as string
const TokenExpiry = 60000 * 24

export const genAuthToken = (user : UserJWTDAO) : string => {
    return jwt.sign(user, SECRET, {
        expiresIn: TokenExpiry
    })
}

export const verifyAuthToken = (token: string) => {
    return jwt.verify(token, SECRET) as UserJWTDAO
}