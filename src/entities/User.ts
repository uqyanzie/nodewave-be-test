import z from "zod"

export interface UserJWTDAO {
    id:number 
    email:string
    fullName:string 
    role:string
}

export interface UserLoginDTO {
    email:string 
    password:string
}

export interface UserRegisterDTO {
    fullName:string 
    email:string 
    password:string
}

export const UserRegisterValidator = z.object({
    fullName: z.string().nonempty().regex(/^[^0-9]+$/, "name do not contain any number"),
    email: z.email(),
    password: z.string()
        .min(8, "Password must be at least 8 characters long")
        .max(32, "Password must not exceed 32 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/\d/, "Password must contain at least one number")
        .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/, "Password must contain at least one special character")
})

// Exclude keys from user
export function exclude<User, Key extends keyof User>(
  user: User,
  ...keys: Key[]
): Omit<User, Key> {
  for (let key of keys) {
    delete user[key];
  }
  return user;
}

