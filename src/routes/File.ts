import { Router } from "express";
import * as FileController from "$controllers/rest/FileController"
import multer from 'multer'
import { adminMiddleware, authMiddleware } from "$middlewares/auth";

const upload = multer({dest: "uploads/"})

const FileRoutes = Router({mergeParams:true}) // mergeParams = true -> to enable parsing query params

FileRoutes.get("/", 
    adminMiddleware,
    FileController.getFiles
)

FileRoutes.get("/:id", 
    adminMiddleware,
    FileController.getFileDetail
)

FileRoutes.post("/retry/:jobId", 
    adminMiddleware,
    FileController.retryFileProcess
)

export default FileRoutes