import express from "express";
import { validationResult } from "express-validator";
import { validateSignup } from "../utils/validation.js";
import User from "../models/user.js";
const router = express.Router();

router.post("/signup", validateSignup, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        errors: errors.array(),
      });
    }
    const { name, email, password } = req.body;
    await User.create({
      name,
      email,
      password,
    });
    res.status(201).json({
      message: "User registered successfully",
    });
  } catch (error) {
    res.status(error.status || 500).json({
      message: error.message || "Unable to sign up",
    });
  }
});

export default router;
