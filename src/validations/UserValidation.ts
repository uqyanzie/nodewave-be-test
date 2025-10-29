
import z from "zod"

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