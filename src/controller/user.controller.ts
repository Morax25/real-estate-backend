import type { Response, Request } from "express"
import ApiResponse from "../utils/ApiResponse.ts"
export const login = (req:Request, res:Response) => {
   const {name} = req.body
   res.status(201).json(new ApiResponse({statusCode:201, message:`User name is ${name}`, data:{data:null}}))
}