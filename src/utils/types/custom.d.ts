import { UserJWTDAO } from "$entities/User";

declare global {
    namespace Express {
        interface Request {
            user?: UserJWTDAO
        }
    }
}