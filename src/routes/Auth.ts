import { Router } from "express";
import { login, register, profile } from "$controllers/rest/UserController"
import multer from 'multer'
import { adminMiddleware, authMiddleware } from "$middlewares/auth";



const AuthRoutes = Router({mergeParams:true}) // mergeParams = true -> to enable parsing query params

AuthRoutes.post("/login", login)

AuthRoutes.post("/register", register)

AuthRoutes.get("/profile", authMiddleware, profile)

export default AuthRoutes