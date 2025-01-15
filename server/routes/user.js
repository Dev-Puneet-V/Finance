import express from "express";
import { validationResult } from "express-validator";
import { validateSignup } from "../utils/validation.js";
import { errorMessages } from "../utils/constants.js";
import {
  createUser,
  getUserDetails,
  loginUser,
  logoutUser,
  refreshAccessToken,
} from "../services/user.js";
import { isUserLoggedIn } from "../utils/middlewares.js";
const router = express.Router();

router.get("/", isUserLoggedIn, async (req, res) => {
  try {
    const user = req.user;
    const userDetails = await getUserDetails(user._id);
    res.status(200).json({
      message: "Data fetched successfully",
      data: userDetails,
    });
  } catch (error) {
    res.status(error.status || 500).json({
      message:
        errorMessages[error.code] || error.message || "Unable to sign up",
    });
  }
});
router.post("/signup", validateSignup, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error(errors.array().join(","));
      error.status = 400;
      throw error;
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
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", userDetails.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
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

router.post("/refresh-token", async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      const error = new Error("Unauthorized");
      error.status = 401;
      throw error;
    }
    const userDetails = await refreshAccessToken(refreshToken);
    res.cookie("token", userDetails.token, {
      httpOnly: true, // Prevent client-side JavaScript access
      secure: process.env.NODE_ENV === "production", // Ensure HTTPS in production
      sameSite: "strict", // Protect against CSRF
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", userDetails.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
      message: "OK",
    });
  } catch (error) {
    res.status(error.status || 500).json({
      message:
        errorMessages[error.code] || error.message || "Error refreshing token",
    });
  }
});

router.post("/logout", isUserLoggedIn, (req, res) => {
  try {
    logoutUser(req.user?.email);
    res.clearCookie("token");
    res.clearCookie("refreshToken");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(error.status || 500).json({
      message: errorMessages[error.code] || error.message || "Unable to logout",
    });
  }
});

export default router;
