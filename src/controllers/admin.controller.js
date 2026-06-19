import jwt from 'jsonwebtoken';
import { Admin } from "../models/admin.model.js";
import { ApiError } from "../utils/apiErrorHandler.js";
import { ApiResponse } from "../utils/apiResponseHandler.js";
import { asyncHandler } from "../utils/asyncHandler.js";

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

const registerAdmin = asyncHandler(async (req, res) => {
    const { email, fullName, password } = req.body
    if ([email, fullName, password].some((field) => field.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }
    const existedUser = await Admin.findOne({
        $or: [{ email }
        ]
    })
    if (existedUser) {
        throw new ApiError(409, "User already Exist");
    }

    const admin = await Admin.create({
        fullName,
        email,
        password
    })

    const createdAdmin = await Admin.findById(admin._id).select("-password -refreshToken")
    if (!createdAdmin) {
        throw new ApiError(500, "Something went wrong while creating a user");

    }
    return res.status(201).json(
        new ApiResponse(
            200,
            createdAdmin,
            "Admin Register successfully "
        )
    )
})


const loginAdmin = asyncHandler(async (req, res) => {
    console.log("1 enter in Function")
    const { email, password } = req.body
    console.log("2 🚀 ~ req.body:", req.body)
    if (!email) {
        throw new ApiError(400, "email is required");
    }

    const admin = await Admin.findOne({
        $or: [{ email }]
    })
    console.log("3 🚀 ~ finding admin:", admin)

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
        secure: true,
        // sameSite: "lax" // Add this too
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

const logoutAdmin = asyncHandler(async (req, res) => {
    await Admin.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    )
    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(
                200,
                {},
                "User loggged out"
            )
        )
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    try {
        const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
        if (!incomingRefreshToken) {
            throw new ApiError(401, "Unautorised request");
        }
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
        const admin = await Admin.findById(decodedToken?._id)
        if (!user) {
            throw new ApiError(401, "Invalid refresh token");
        }
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Invalid refresh token");
        }

        const options = {
            httpOnly: true,
            secure: true,
            // sameSite: "lax" // Add this too
        }
        const { accessToken, refreshToken } = await generateAccessAndRefereshToken(admin._id)
        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    {
                        accessToken,
                        refreshToken
                    },
                    "Access token generated successfully ! "
                )
            )
    } catch (error) {
        throw new ApiError(401, error?.message || 'Invalid Refresh Token');
    }
})
const changeAdminPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body
    const admin = await Admin.findById(req?.admin?._id)
    const isPasswordCorrect = await admin.isPasswordCorrect(oldPassword)
    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old Password");

    }
    admin.password = newPassword
    await admin.save({ validateBeforeSave: false })
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "Password changed sucessfully"
            )
        )
})
const getCurrentAdmin = asyncHandler(async (req, res) => {
    return res
        .status(200)
    json(
        new ApiResponse(
            200,
            req.admin,
            "Current user fetchd successfully !"

        )
    )
})
export {
    registerAdmin,
    loginAdmin,
    logoutAdmin,
    refreshAccessToken,
    changeAdminPassword,
    getCurrentAdmin
}