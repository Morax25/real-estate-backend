import { Router } from "express";
import { login } from "../controller/user.controller.ts";
const router = Router()

//user register and login routes
router.post('/login', login)

export default router