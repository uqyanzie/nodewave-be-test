import { hashSync, compareSync } from "bcrypt";

export const hashPassword = (str:string)  => {
    return hashSync(str, 12)
}

export const comparePassword =  (str:string, hashStr: string) => {
    return compareSync(str, hashStr)
}