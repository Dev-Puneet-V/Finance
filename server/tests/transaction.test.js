import mongoose from "mongoose";
import Transaction from "../models/transaction.js";
import { it, jest } from "@jest/globals";
import { createNewTransation } from "../services/transaction.js";
import { getUserDetails } from "../services/user.js";

jest.mock("../models/transaction.js");
jest.mock("../services/user.js", () => ({
  getUserDetails: jest.fn(),
}));
describe("Transaction Service", () => {
  let sessionMock;
  beforeEach(() => {
    sessionMock = {
      startTransaction: jest.fn().mockResolvedValue(),
      commitTransaction: jest.fn().mockResolvedValue(),
      abortTransaction: jest.fn().mockResolvedValue(),
      endSession: jest.fn().mockResolvedValue(),
    };
    mongoose.startSession = jest.fn().mockResolvedValue(sessionMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  it("should create a new transaction and commit it", async () => {
    const userId = "64b1f0ec7cbe1a345f44e7d3";
    const amount = 100;
    const category = "Food";
    const description = "Groceries";

    // Mock user and transaction behavior
    getUserDetails.mockResolvedValue({
      addTransactions: jest.fn().mockResolvedValue(true),
    });

    const mockTransaction = [
      {
        _id: "64b1f0ec7cbe1a345f44e7e8",
        amount,
        category,
        description,
        createdAt: new Date(),
      },
    ];
      Transaction.create.mockResolvedValue(mockTransaction);
      
    const result = await createNewTransation(
      userId,
      amount,
      category,
      description
      );
      
    expect(mongoose.startSession).toHaveBeenCalled();
    expect(sessionMock.startTransaction).toHaveBeenCalled();
    expect(sessionMock.commitTransaction).toHaveBeenCalled();
    expect(sessionMock.endSession).toHaveBeenCalled();

    expect(getUserDetails).toHaveBeenCalledWith(userId);
    expect(Transaction.create).toHaveBeenCalledWith(
      [
        {
          user: userId,
          amount,
          category,
          description,
        },
      ],
      { session: sessionMock }
    );

    expect(result).toEqual({
      id: mockTransaction[0]._id,
      amount: mockTransaction[0].amount,
      category: mockTransaction[0].category,
      description: mockTransaction[0].amount,
      createdAt: mockTransaction[0].createdAt,
    });
  });
});
