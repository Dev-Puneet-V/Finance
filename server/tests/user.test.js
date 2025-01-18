import User from "../models/user.js";
import {
  createUser,
  getUserDetails,
  loginUser,
  refreshAccessToken,
} from "../services/user.js";
import { jest } from "@jest/globals";
describe("user Service", () => {
  afterEach(() => {
    // Reset all mocks after each test
    jest.clearAllMocks();
  });

  it("should create a new user and return user details", async () => {
    const mockUser = {
      _id: "64b1f0ec7cbe1a345f44e7d3",
      name: "John Doe",
      email: "john.doe@example.com",
      password: "hashedPassword123",
    };

    User.create = jest.fn().mockResolvedValue(mockUser);

    const result = await createUser(
      "John Doe",
      "john.doe@example.com",
      "hashedPassword123"
    );

    // Check the result
    expect(User.create).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      id: "64b1f0ec7cbe1a345f44e7d3",
      name: "John Doe",
      email: "john.doe@example.com",
    });
  });

  it("should throw an error when User.create fails", async () => {
    const mockError = new Error("Database error");
    User.create = jest.fn().mockRejectedValue(mockError);

    try {
      await createUser("John Doe", "john.doe@example.com", "password123");
    } catch (error) {
      expect(error).toBe(mockError);
    }
  });

  it("should give user details with correct user id", async () => {
    const mockUserData = {
      _id: "64b1f0ec7cbe1a345f44e7d3",
      email: "john.doe@example.com",
      name: "John Doe",
      isVerified: false,
    };

    // Mock the findById and select methods
    User.findById = jest.fn().mockImplementation(() => {
      return {
        select: jest.fn().mockResolvedValue(mockUserData), // Mock the select method to return mockUserData
      };
    });

    const result = await getUserDetails("64b1f0ec7cbe1a345f44e7d3");

    expect(result).toHaveProperty("_id", "64b1f0ec7cbe1a345f44e7d3");
    expect(result).toHaveProperty("email", "john.doe@example.com");
    expect(result).toHaveProperty("name", "John Doe");
    expect(result).toHaveProperty("isVerified", false);
  });

  it("should login user and return user details with correct email and password", async () => {
    const mockUserData = {
      _id: "64b1f0ec7cbe1a345f44e7d3",
      email: "john.doe@example.com",
      password: "hashedPassword123",
      name: "John Doe",
      isVerified: false,
      validatePassword: jest.fn().mockResolvedValue(true),
      save: jest.fn().mockResolvedValue(true),
    };

    User.findOne = jest.fn().mockResolvedValue(mockUserData);

    const result = await loginUser("john.doe@example.com", "password13");

    expect(result).toHaveProperty("id");
  });

  it("should throw error with wrong creds", async () => {
    const mockError = new Error("Database error");
    User.findOne = jest.fn().mockRejectedValue(mockError);

    try {
      await loginUser("John Doe", "john.doe@example.com", "password13");
    } catch (error) {
      expect(error).toBe(mockError);
    }
  });

  it("should refresh token", async () => {
    const mockUserData = {
      _id: "64b1f0ec7cbe1a345f44e7d3",
      email: "john.doe@example.com",
      password: "hashedPassword123",
      name: "John Doe",
      isVerified: false,
      validatePassword: jest.fn().mockResolvedValue(true),
      save: jest.fn().mockResolvedValue(true),
    };

    User.findOne = jest.fn().mockResolvedValue(mockUserData);

    const result = await loginUser("john.doe@example.com", "hashedPassword123");
    const refreshToken = result?.refreshToken;
    const refreshTokenResult = await refreshAccessToken(refreshToken);

    expect(refreshTokenResult).toHaveProperty("refreshToken");
  });

  it("should throw error with malformed refresh token", async () => {
    const mockError = new Error("jwt malformed");
    User.findOne = jest.fn().mockRejectedValue(mockError);

    try {
      await refreshAccessToken("wrongrefreshToken");
    } catch (error) {
      expect(error.message).toBe("jwt malformed");
    }
  });
});
