import User from "../models/user.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const getUserDetails = async (userId) => {
  try {
    const userDetails = await User.findById(userId).select(
      "-password -refreshToken -token"
    );
    if (!userDetails) {
      const error = new Error("User not found");
      error.status = 404;
      throw error;
    }
    return userDetails;
  } catch (error) {
    throw error;
  }
};

const createUser = async (name, email, password) => {
  try {
    const newUser = await User.create({
      name,
      email,
      password,
    });
    return {
      id: newUser?._id,
      name,
      email,
    };
  } catch (error) {
    throw error;
  }
};

const loginUser = async (email, inputPassword) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error("Invalid email or password");
      error.status = 401;
      throw error;
    }

    const isValidPassword = await user.validatePassword(inputPassword);
    if (!isValidPassword) {
      const error = new Error("Invalid email or password");
      error.status = 401;
      throw error;
    }

    const payload = {
      _id: user._id,
      email: user.email,
      current: Date.now(),
    };
    user.token = jwt.sign(payload, process.env.TOKEN_SECRET, {
      expiresIn: "1d",
    });
    user.refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "7d",
    });

    await user.save();

    return {
      id: user._id,
      name: user.name,
      email: user.email,
      isVerified: user.isVerified,
      token: user.token,
      refreshToken: user.refreshToken,
    };
  } catch (error) {
    throw error;
  }
};

const refreshAccessToken = async (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    if (!decoded) {
      const error = new Error("Unauthorized");
      error.status = 401;
      throw error;
    }
    const user = User.findOne({
      email: decoded?.email,
    });
    const payload = {
      _id: user._id,
      email: user.email,
      current: Date.now(),
    };
    user.token = jwt.sign(payload, process.env.TOKEN_SECRET, {
      expiresIn: "1d",
    });
    user.refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "7d",
    });
    return {
      id: user._id,
      name: user.name,
      email: user.email,
      isVerified: user.isVerified,
      token: user.token,
      refreshToken: user.refreshToken,
    };
  } catch (error) {
    throw error;
  }
};

const logoutUser = async (email) => {
  try {
    await User.updateOne({ email }, { $unset: { token: 1, refreshToken: 1 } });
  } catch (error) {
    throw error;
  }
};

export {
  getUserDetails,
  createUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
};
