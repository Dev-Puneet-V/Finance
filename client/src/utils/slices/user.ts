import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { NewUser, User, UserState } from "../types";

const initialState: UserState = {
  name: "",
  email: "",
  isVerified: false,
  loading: false,
  error: null,
};

export const signUpUser = createAsyncThunk(
  "user/signUp",
  async (userData: NewUser, thunkAPI) => {
    try {
      const response = await axios.post("/api/user/signup", userData);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const loginUser = createAsyncThunk(
  "user/login",
  async (userData: User, thunkAPI) => {
    try {
      const response = await axios.post("/api/user/login", userData);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(signUpUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUpUser.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(signUpUser.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        loginUser.fulfilled,
        (state, action: PayloadAction<{ name: string; email: string }>) => {
          state.loading = false;
          state.name = action.payload.name;
          state.email = action.payload.email;
          state.isVerified = true;
          state.error = null;
        }
      )
      .addCase(loginUser.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {} = userSlice.actions;

export default userSlice.reducer;
