import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import axios from "axios";
import jwt_decode from "jwt-decode";
import { getDecodedTokenFromStorage } from "../../utils/token";

enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
}

export interface UserState {
  user: User;
  isLoading: boolean;
  error: string | null;
  registerStatus: string | null;
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
  registerStatus: null,
};

const API_PLACEHOLDER = import.meta.env.VITE_API_ORIGIN;

export const signUpThunk = createAsyncThunk(
  "auth/signup",
  async (user: { username: string; password: string }) => {
    console.log(user);
    const res = await axios.post(`${API_PLACEHOLDER}/signup`, user);

    console.log("res", res);
    return res.data;
  }
);
export const signInThunk = createAsyncThunk(
  "auth/signin",
  async (user: { username: string; password: string }) => {
    const res = await axios.post(`${API_PLACEHOLDER}/signin`, user);
    console.log("token", res.data);
    return {
      token: res.data,
    };
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
    builder.addCase(signUpThunk.fulfilled, (state, action) => {
      console.log(action);
      //state.user = action.payload
      const message = action.payload;
      if (message === "409 CONFLICT") {
        state.registerStatus =
          "Username Already Exist! Choose a different username.";
      }
      if (message === "201 CREATED") {
        state.registerStatus =
          "Registered succesfully! Please signin to continue.";
      }
    });

    builder.addCase(signInThunk.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });

    builder.addCase(signInThunk.fulfilled, (state, action) => {
      state.isLoading = false;

      const token = action.payload.token;
      if (token === "404 NOT_FOUND") {
        state.error = "Username not found! Please sign up!";
        state.user.username = null;
      } else if (token === "401 UNAUTHORIZED") {
        state.error = "Wrong Username or Password!";
        state.user.username = null;
      } else {
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
        localStorage.setItem("loggedInUserRole", user.role ?? "");
        localStorage.setItem("loggedInUserName", user.username ?? "");
      }
    });
    builder.addCase(
      signInThunk.rejected,
      (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload;
      }
    );
  },
});
export const { loadUserFromStorage, logout } = authSlice.actions;

export default authSlice.reducer;
