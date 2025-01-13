import * as chai from "chai";
import sinon from "sinon";
import User from "../models/user.js";
import { createUser } from "../services/user.js";

const { expect } = chai;

describe("createUser Service", () => {
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
});
