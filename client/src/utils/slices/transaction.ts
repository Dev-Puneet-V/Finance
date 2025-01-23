import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export const getTransactionHistory = createAsyncThunk(
  "transaction/getHistory",
  async (data: any, thunkAPI) => {
    try {
      const { page, limit } = data;
      const response = await axios.get(
        `http://localhost:3000/api/transaction/history?pageNumber=${page}&dataPerPage=${limit}`,
        {
          withCredentials: true,
        }
      );
      return response.data?.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const createTransaction = createAsyncThunk(
  "tranaction/getHistory",
  async (data, thunkAPI) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/transaction",
        data,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

const initialState: any = {
  currentPageNumber: 1,
  transactionCountPerPage: 10,
  totalPages: -1,
  transactions: [],
  loading: false,
  error: null,
};

const transactionSlice = createSlice({
  name: "transaction",
  initialState,
  reducers: {
    setPageNumber: (state, action: PayloadAction<number>) => {
      state.currentPageNumber = action.payload;
    },
    setTransactionCountPerPage: (state, action: PayloadAction<number>) => {
      state.transactionCountPerPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTransactionHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getTransactionHistory.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = null;
          state.transactions = [...state.transactions, ...action.payload];
        }
      )
      .addCase(
        getTransactionHistory.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload;
        }
      )
      .addCase(createTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTransaction.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(
        createTransaction.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export const { setPageNumber, setTransactionCountPerPage } =
  transactionSlice.actions;

export default transactionSlice.reducer;
