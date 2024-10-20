import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

import { Book, BookDTO } from "../../type";

interface ErrorType {
  message: string;
  status: number;
}

export interface BookState {
  items: Book[];
  isLoading: boolean;
  error: ErrorType | null;
  status: number | null;
  searchQuery: string;
  filterCriteria: string;
}

const initialState: BookState = {
  items: [],
  isLoading: false,
  error: null,
  status: null,
  searchQuery: "",
  filterCriteria: "",
};

const API_PLACEHOLDER = import.meta.env.VITE_API_ORIGIN;
//console.log('api placeholder', API_PLACEHOLDER)

//ACTION

export const fetchBooksThunk = createAsyncThunk(
  "books/fetch",
  async (data, thunkApi) => {
    try {
      const response = await axios.get(`${API_PLACEHOLDER}/api/v1/books/`);
      const data: Book[] = await response.data;
      //console.log('Found books', data)
      return data;
    } catch (error: any) {
      console.log("error.response.data > ", error.response.data);
      return thunkApi.rejectWithValue(error.message);
    }
  }
);

export const addNewBookThunk = createAsyncThunk(
  "books/add",
  async (book: BookDTO, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    };

    try {
      const response = await axios.post(
        `${API_PLACEHOLDER}/api/v1/books/`,
        book,
        {
          headers,
        }
      );
      return {
        status: response.status,
        data: response.data,
      };
    } catch (error: any) {
      if (error.response) {
        // Handle 409 Conflict or other errors here
        console.log("book add rejection payload > ", error.response);
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

//edit book thunk
export const editBookThunk = createAsyncThunk(
  "books/edit",
  async (book: BookDTO, { rejectWithValue }) => {
    const token = localStorage.getItem("token");

    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    };
    try {
      const response = await axios.put(
        `${API_PLACEHOLDER}/api/v1/books/${book.isbn}`,
        book,
        {
          headers,
        }
      );
      return {
        status: response.status,
        data: response.data,
      };
    } catch (error: any) {
      if (error.response) {
        // Handle 409 Conflict or other errors here
        console.log("book edit rejection payload > ", error.response);
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

//delete book thunk
export const deleteBookThunk = createAsyncThunk(
  "books/delete",
  async (isbn: string, { rejectWithValue }) => {
    const token = localStorage.getItem("token");

    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    };

    // Make the Axios request
    try {
      const response = await axios.delete(
        `${API_PLACEHOLDER}/api/v1/books/${isbn}`,
        {
          headers,
        }
      );
      //console.log('response', response)
      return {
        status: response?.status,
        data: response?.data,
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

//SLICE
export const booksSlice = createSlice({
  name: "books",
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setFilterCriteria: (state, action: PayloadAction<string>) => {
      state.filterCriteria = action.payload;
    },
    resetStatus: (state) => {
      state.status = null; // Reset status to null
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchBooksThunk.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(
      fetchBooksThunk.rejected,
      (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload;
      }
    );
    builder.addCase(
      fetchBooksThunk.fulfilled,
      (state, action: PayloadAction<Book[]>) => {
        state.isLoading = false;
        state.items = action.payload;
      }
    );
    //addBook
    //adding book reducers
    builder.addCase(addNewBookThunk.pending, (state) => {
      state.isLoading = true;
      state.status = null;
    });

    builder.addCase(
      addNewBookThunk.rejected,
      (state, action: PayloadAction<any>) => {
        console.log(
          "inside addNewBookThunk.rejected > action paylod: ",
          action.payload
        );
        state.isLoading = false;
        state.error = action.payload;
        state.status = action.payload.status;
        //state.error = 'Something went wrong ...'
      }
    );
    builder.addCase(
      addNewBookThunk.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = null;
        state.items = [action.payload.data, ...state.items];
        state.status = action.payload.status;

        //console.log("inside addnewauthorThunk fulfilled>payload: ",action.payload);
      }
    );

    //edit book thunk reducers
    builder.addCase(editBookThunk.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(
      editBookThunk.rejected,
      (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload.data;
        state.status = action.payload.status;
      }
    );
    builder.addCase(
      editBookThunk.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.isLoading = false;

        state.error = null;
        state.items = state.items.map((item) => {
          if (item.isbn === action.payload.data.isbn) {
            return action.payload.data;
          }

          return item;
        });
        state.status = action.payload.status;
      }
    );

    //delete book thunk reducers
    builder.addCase(deleteBookThunk.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(
      deleteBookThunk.rejected,
      (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload.data;
      }
    );
    builder.addCase(
      deleteBookThunk.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        if (action.payload?.status == 200) {
          state.error = null;
          state.items = state.items.filter(
            (prev) => prev.isbn !== action.payload.data
          );
        } else {
          state.error = action.payload?.data;
        }
      }
    );
  },
});

export const { setSearchQuery, setFilterCriteria } = booksSlice.actions;
export default booksSlice.reducer;
