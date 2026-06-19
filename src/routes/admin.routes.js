import { Router } from "express";
import { loginAdmin, registerAdmin } from "../controllers/admin.controller.js";

const router = Router();

router.route("/register").post(registerAdmin)
// router.route("/login").post(loginAdmin)

router.post("/login", (req, res) => {
    console.log("LOGIN HIT");
    res.status(200).json({
        success: true,
        message: "Route reached"
    });
});

export default router