import { Router } from "express";
import * as ProductController from "$controllers/rest/ProductController"
import multer from 'multer'
import { adminMiddleware, authMiddleware } from "$middlewares/auth";

const upload = multer({dest: "uploads/"})

const ProductRoutes = Router({mergeParams:true}) // mergeParams = true -> to enable parsing query params

ProductRoutes.post("/upload", 
    adminMiddleware,
    upload.single("file"),
    ProductController.uploadProduct
)

ProductRoutes.get("/", 
    authMiddleware,
    ProductController.getProducts
)

export default ProductRoutes