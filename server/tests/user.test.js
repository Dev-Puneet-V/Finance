import * as chai from "chai";
import sinon from "sinon";
import User from "../models/user.js";
import { createUser, loginUser } from "../services/user.js";

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
    const findOneStub = sinon.stub(User, "findOne").resolves(mockUserData);

    const result = await loginUser("john.doe@example.com", "password13");

    expect(result).to.have.property("id");
  });

  it("should throw error with wrong creds", async () => {
    const mockUserData = {
      _id: "64b1f0ec7cbe1a345f44e7d3",
      email: "john.doe@example.com",
      password: "hashedPassword123",
      name: "John Doe",
      isVerified: false,
      validatePassword: sinon.stub().resolves(true),
      save: sinon.stub().resolves(true),
    };

    const mockError = new Error("Database error");
    sinon.stub(User, "findOne").rejects(mockError);
    try {
      await loginUser("John Doe", "john.doe@example.com", "password13");
    } catch (error) {
      expect(error).to.equal(mockError);
    }
  });
});
