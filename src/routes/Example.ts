import { Router } from "express";
import * as ExampleController from "$controllers/rest/ExampleController"

const ExampleRoutes = Router({mergeParams:true}) // mergeParams = true -> to enable parsing query params

ExampleRoutes.get("/",
    ExampleController.get
)

export default ExampleRoutes