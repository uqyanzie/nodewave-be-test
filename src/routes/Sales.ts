import { Router } from "express";
import * as SalesController from "$controllers/rest/SalesController"
import multer from 'multer'
import { adminMiddleware, authMiddleware } from "$middlewares/auth";

const upload = multer({dest: "uploads/"})

const SalesRoutes = Router({mergeParams:true}) // mergeParams = true -> to enable parsing query params

SalesRoutes.get("/", 
    authMiddleware,
    SalesController.getSales
)

SalesRoutes.post("/upload", 
    adminMiddleware,
    upload.single("file"),
    SalesController.uploadSales
)

SalesRoutes.get("/upload", 
    adminMiddleware,
    SalesController.getSalesFiles
)

export default SalesRoutes