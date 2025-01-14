import express from "express";
import { validationResult } from "express-validator";
import { validateSignup } from "../utils/validation.js";
import { errorMessages } from "../utils/constants.js";
import { createUser, loginUser } from "../services/user.js";
const router = express.Router();

router.post("/signup", validateSignup, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    const { name, email, password } = req.body;
    await createUser(name, email, password);
    return res.status(201).json({
      message: "User registered successfully",
    });
  } catch (error) {
    res.status(error.status || 500).json({
      message:
        errorMessages[error.code] || error.message || "Unable to sign up",
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const userDetails = await loginUser(email, password);
    res.cookie("token", userDetails.token, {
      httpOnly: true, // Prevent client-side JavaScript access
      secure: process.env.NODE_ENV === "production", // Ensure HTTPS in production
      sameSite: "strict", // Protect against CSRF
      maxAge: 10 * 1000,
    });

    res.cookie("refreshToken", userDetails.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 1000,
    });
    res.status(200).json({
      email: userDetails.email,
      name: userDetails.name,
      id: userDetails._id,
      isVerified: userDetails.isVerified,
    });
  } catch (error) {
    res.status(error.status || 500).json({
      message: errorMessages[error.code] || error.message || "Unable to login",
    });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.clearCookie("refreshToken");
  res.status(200).json({ message: "Logged out successfully" });
});


export default router;
