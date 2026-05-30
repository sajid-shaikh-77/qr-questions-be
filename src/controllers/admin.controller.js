import { Admin } from "../models/admin.model.js";
import { ApiError } from "../utils/apiErrorHandler";
import { ApiResponse } from "../utils/apiResponseHandler.js";
import { asyncHandler } from "../utils/asyncHandler";

const generateAccessAndRefereshToken = async (adminId) => {
    try {
        const admin = await Admin.findById(adminId)
        const accessToken = await admin.generateAccessToken()
        const refreshToken = await admin.generateRefreshToken()
        admin.refreshToken = refreshToken
        await admin.save({ validateBeforeSave: false })
        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(
            500,
            "Something went wrong While generating refresh access token");
    }
}

const loginAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    if (!email) {
        throw new ApiError(400, "email is required");
    }

    const admin = await Admin.findOne({
        $or: [{ email }]
    })

    if (!admin) {
        throw new ApiError(404, "User not found");
    }

    const isPasswordValid = await admin.isPasswordCorrect(password)
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid credentials");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefereshToken(admin._id)

    const loggedInAdmin = await Admin.findById(admin._id).select("-password -refreshToken")
    const options = {
        httpOnly: true,
        // secure: true,
        sameSite: "lax" // Add this too
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    admin: loggedInAdmin,
                    accessToken,
                    refreshToken
                },
                "Admin logged in successfully!"
            )
        )
})

export {
    loginAdmin
}