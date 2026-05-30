import jwt from "jsonwebtoken";
import { ApiError } from "../utils/apiErrorHandler";
import { asyncHandler } from "../utils/asyncHandler";
import { Admin } from "../models/admin.model";


export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token = req?.cookies?.accessToken || req.header('Authorization')?.replace("Bearer ", "")
        if (!token) {
            throw new ApiError(401, "Unautorized request");
        }
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const admin = await Admin.findById(decodedToken?._id).select("-password -refreshToken")
        if (!admin) {
            throw new ApiError(401, "Invalid Access token");

        }
        req.admin = admin
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Access Token");
    }
})