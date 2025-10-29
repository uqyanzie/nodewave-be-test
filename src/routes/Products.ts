import { Router } from "express";
import * as ProductController from "$controllers/rest/ProductController"
import multer from 'multer'
import { adminMiddleware, authMiddleware } from "$middlewares/auth";

const upload = multer({dest: "uploads/"})

const ProductRoutes = Router({mergeParams:true}) // mergeParams = true -> to enable parsing query params

ProductRoutes.get("/", 
    authMiddleware,
    ProductController.getProducts
)

ProductRoutes.post("/upload", 
    adminMiddleware,
    upload.single("file"),
    ProductController.uploadProduct
)

ProductRoutes.get("/upload", 
    adminMiddleware,
    ProductController.getProductFiles
)

export default ProductRoutes