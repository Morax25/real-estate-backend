import asyncHandler from "../utils/asyncHandler.ts";

export const addProperty = asyncHandler(async(req, res)=>{
    res.status(200).json({message:"Error found", success:false})
})