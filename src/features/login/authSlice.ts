import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import axios from "axios";
import jwt_decode from "jwt-decode";
import { getDecodedTokenFromStorage } from "../../utils/token";

enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
}
interface ErrorType {
  message: string;
  status: number;
}
export interface UserState {
  user: User;
  isLoading: boolean;
  error: ErrorType | null;
  status: number | null;
}
export type DecodedUser = {
  user_id: string;
  username: string;
  role: Role;
};

export type User = {
  id: string | null;
  username: string | null;
  role: Role | null;
};

const initialState: UserState = {
  user: { id: null, username: null, role: null },
  isLoading: false,
  error: null,
  status: null,
};

const API_PLACEHOLDER = import.meta.env.VITE_API_ORIGIN;

export const signUpThunk = createAsyncThunk(
  "auth/signup",
  async (user: { username: string; password: string }, { rejectWithValue }) => {
    // console.log(user);
    try {
      const response = await axios.post(`${API_PLACEHOLDER}/signup`, user);
      // console.log("signup response : ", response);
      return {
        status: response.status,
        data: response.data,
      };
    } catch (error: any) {
      if (error.response) {
        // Handle 409 Conflict or other errors here
        return rejectWithValue({
          status: error.response.status,
          message: error.response.data || "Conflict occurred",
        });
      } else if (error.request) {
        return rejectWithValue({
          status: "No response",
          message: "No response from the server",
        });
      } else {
        return rejectWithValue({
          status: "Request error",
          message: error.message,
        });
      }
    }
  }
);
export const signInThunk = createAsyncThunk(
  "auth/signin",
  async (user: { username: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_PLACEHOLDER}/signin`, user);
      // console.log("token", res.data);
      return {
        status: response.status,
        token: response.data,
      };
    } catch (error: any) {
      if (error.response) {
        // Handle 409 Conflict or other errors here
        return rejectWithValue({
          status: error.response.status,
          message: error.response.data || "Conflict occurred",
        });
      } else if (error.request) {
        return rejectWithValue({
          status: "No response",
          message: "No response from the server",
        });
      } else {
        return rejectWithValue({
          status: "Request error",
          message: error.message,
        });
      }
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loadUserFromStorage: (state) => {
      const user = getDecodedTokenFromStorage();
      if (user) {
        state.user = user;
      }
    },
    logout: (state) => {
      localStorage.clear();
      const user: User = {
        username: null,
        id: null,
        role: null,
      };
      state.user = user;

      // console.log('inside logout reducer>state.loggedInUser: ', state.user.username)
    },
  },
  extraReducers: (builder) => {
    builder.addCase(signUpThunk.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });

    builder.addCase(
      signUpThunk.rejected,
      (state, action: PayloadAction<any>) => {
        console.log("signup rejected payload : ", action.payload);
        state.status = action.payload.status;
        state.isLoading = false;
        state.error = action.payload;
      }
    );
    builder.addCase(
      signUpThunk.fulfilled,
      (state, action: PayloadAction<any>) => {
        console.log(action.payload);
        //state.user = action.payload
        if (action.payload?.status === 200) {
          state.error = null;
          state.status = action.payload?.status;
        }
      }
    );
    builder.addCase(signInThunk.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(signInThunk.fulfilled, (state, action: PayloadAction<any>) => {
      state.isLoading = false;
      // console.log('signin payload : ', action.payload);
      const token = action.payload.token;
      if (action.payload?.status === 200) {
        state.error = null;
        const decodedUser = jwt_decode(token) as DecodedUser;
        //console.log('Decoded user : ', decodedUser)
        localStorage.setItem("token", token);

        const user: User = {
          username: decodedUser.username,
          id: decodedUser.user_id,
          role: decodedUser.role,
        };
        state.user = user;
      }
    });
    builder.addCase(
      signInThunk.rejected,
      (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.status = action.payload.status;
        state.error = action.payload;
      }
    );
  },
});
export const { loadUserFromStorage, logout } = authSlice.actions;

export default authSlice.reducer;
