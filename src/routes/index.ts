import { response_not_found, response_success } from "$utils/response.utils";
import { Request, Response, Router } from "express";
// import * as AuthController from "$controllers/AuthController"
// import * as AuthValidation from "$validations/AuthValidations"
// import RoutesRegistry from './registry';
// import * as AuthMiddleware from '$middlewares/authMiddleware';


const router = Router();

// router.post("/login",AuthValidation.validateLoginPayload,AuthController.login);
// router.post("/register",AuthValidation.validateRegisterPayload,AuthController.register);
// router.post("/verify-token",AuthController.verifyToken);
// router.put("/update-password", AuthMiddleware.checkJwt, AuthController.changePassword);

router.get("/", (req: Request, res: Response) => {
  return response_success(res, "main routes!");
})

router.get('/robots.txt', function (req:Request, res:Response) {
  res.type('text/plain')
  res.send(
    `User-agent: *\nAllow: /`);
});

router.get("/ping", (req: Request, res: Response) => {
  return response_success(res, "pong!");
});

router.all("*", (req: Request, res: Response) => {
  return response_not_found(res);
});

export default router;
