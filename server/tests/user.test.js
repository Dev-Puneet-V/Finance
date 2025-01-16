import * as chai from "chai";
import sinon from "sinon";
import sinonMongoose from "sinon-mongoose";
import User from "../models/user.js";
import {
  createUser,
  getUserDetails,
  loginUser,
  refreshAccessToken,
} from "../services/user.js";

const { expect } = chai;

describe("user Service", () => {
  afterEach(() => {
    // Restore original behavior after each test
    sinon.restore();
  });

  it("should create a new user and return user details", async () => {
    // Mock User.create to return a simulated user
    const mockUser = {
      _id: "64b1f0ec7cbe1a345f44e7d3",
      name: "John Doe",
      email: "john.doe@example.com",
      password: "hashedPassword123",
    };

    const createStub = sinon.stub(User, "create").resolves(mockUser);

    // Call the createUser service
    const result = await createUser(
      "John Doe",
      "john.doe@example.com",
      "password123"
    );

    // Check the result
    expect(createStub.calledOnce).to.be.true;
    expect(result).to.deep.equal({
      id: "64b1f0ec7cbe1a345f44e7d3",
      name: "John Doe",
      email: "john.doe@example.com",
    });
  });

  it("should throw an error when User.create fails", async () => {
    // Arrange: Mock User.create to throw an error
    const mockError = new Error("Database error");
    sinon.stub(User, "create").rejects(mockError);

    // Act and Assert: Call createUser and expect it to throw
    try {
      await createUser("John Doe", "john.doe@example.com", "password123");
    } catch (error) {
      expect(error).to.equal(mockError);
    }
  });

  it("should give user details with correct user id", async () => {
    const mockUserData = {
      _id: "64b1f0ec7cbe1a345f44e7d3",
      email: "john.doe@example.com",
      name: "John Doe",
      isVerified: false,
    };

    //we need to import sinonmongoose to use chain here
    const userMock = sinon.mock(User);
    userMock
      .expects("findById")
      .withArgs("64b1f0ec7cbe1a345f44e7d3")
      .chain("select")
      .withArgs("-password -refreshToken -token") // Assuming you're excluding password, adjust as needed
      .resolves(mockUserData);
    const result = await getUserDetails("64b1f0ec7cbe1a345f44e7d3");
    console.log(result);
    expect(result).to.be.an("object");
    expect(result).to.have.property("_id", "64b1f0ec7cbe1a345f44e7d3");
    expect(result).to.have.property("email", "john.doe@example.com");
    expect(result).to.have.property("name", "John Doe");
    expect(result).to.have.property("isVerified", false);
    userMock.verify();
  });

  it("should give error with wrong user id", async () => {
    const mockError = new Error("User not found");
    mockError.status = 404;
    sinon
      .mock(User)
      .expects("findById")
      .withArgs("64b1f0ec7cbe1a345f44e7d")
      .chain("select")
      .withArgs("-password -refreshToken -token")
      .rejects(mockError);

    try {
      await getUserDetails("64b1f0ec7cbe1a345f44e7d");
    } catch (error) {
      expect(error.message).to.equal("User not found");
      expect(error.status).to.equal(404);
    }
  });

  it("should login user and return user details with correct email and password", async () => {
    const mockUserData = {
      _id: "64b1f0ec7cbe1a345f44e7d3",
      email: "john.doe@example.com",
      password: "hashedPassword123",
      name: "John Doe",
      isVerified: false,
      validatePassword: sinon.stub().resolves(true),
      save: sinon.stub().resolves(true),
    };

    sinon.stub(User, "findOne").resolves(mockUserData);

    const result = await loginUser("john.doe@example.com", "password13");

    expect(result).to.have.property("id");
  });

  it("should throw error with wrong creds", async () => {
    const mockError = new Error("Database error");
    sinon.stub(User, "findOne").rejects(mockError);
    try {
      await loginUser("John Doe", "john.doe@example.com", "password13");
    } catch (error) {
      expect(error).to.equal(mockError);
    }
  });

  it("should refresh token", async () => {
    const mockUserData = {
      _id: "64b1f0ec7cbe1a345f44e7d3",
      email: "john.doe@example.com",
      password: "hashedPassword123",
      name: "John Doe",
      isVerified: false,
      validatePassword: sinon.stub().resolves(true),
      save: sinon.stub().resolves(true),
    };
    sinon.stub(User, "findOne").resolves(mockUserData);

    const result = await loginUser("john.doe@example.com", "hashedPassword123");
    const refreshToken = result?.refreshToken;
    const refreshTokenResult = await refreshAccessToken(refreshToken);
    expect(refreshTokenResult).to.have.property("refreshToken");
  });
  it("should refresh token", async () => {
    const mockError = new Error("Database error");
    sinon.stub(User, "findOne").rejects(mockError);
    try {
      await refreshAccessToken("wrongrefreshToken");
    } catch (error) {
      expect(error?.message).to.equal("jwt malformed");
    }
  });
});
