import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

import { Book, BookDTO } from "../../type";

export interface BookState {
  items: Book[];
  isLoading: boolean;
  error: string | null;
  status: string | null;
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

//add new book thunk
export const addNewBookThunk = createAsyncThunk(
  "books/add",
  async (book: BookDTO) => {
    //console.log(author)
    const token = localStorage.getItem("token");
    console.log("token inside addBook thunk > ", token);
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    };

    // Make the Axios request
    const response = await axios
      .post(`${API_PLACEHOLDER}/api/v1/books/`, book, {
        headers,
      })
      .catch(function (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log("error.response > ", error.response);
          console.log("error.response.data > ", error.response.data);
          console.log("error.response.status > ", error.response.status);
          console.log("error.response.headers > ", error.response.headers);

          return {
            status: error.response.status,
            data: error.response.data,
          };
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log("error.request > ", error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log("Error", error.message);
        }
        console.log("error.config", error.config);
      });
    //console.log('response', response)
    return {
      status: response?.status,
      data: response?.data,
    };
  }
);

//edit book thunk
export const editBookThunk = createAsyncThunk(
  "books/edit",
  async (book: BookDTO) => {
    const token = localStorage.getItem("token");

    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    };

    // Make the Axios request
    const response = await axios
      .put(`${API_PLACEHOLDER}/api/v1/books/${book.isbn}`, book, {
        headers,
      })
      .catch(function (error) {
        if (error.response) {
          return {
            status: error.response.status,
            data: error.response.data,
          };
        } else if (error.request) {
          console.log("error.request > ", error.request);
        } else {
          console.log("Error", error.message);
        }
        console.log("error.config", error.config);
      });
    //console.log('response', response)
    return {
      status: response?.status,
      data: response?.data,
    };
  }
);

//delete book thunk
export const deleteBookThunk = createAsyncThunk(
  "books/delete",
  async (isbn: string) => {
    const token = localStorage.getItem("token");

    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    };

    // Make the Axios request
    const response = await axios
      .delete(`${API_PLACEHOLDER}/api/v1/books/${isbn}`, {
        headers,
      })
      .catch(function (error) {
        if (error.response) {
          return {
            status: error.response.status,
            data: error.response.data,
          };
        } else if (error.request) {
          console.log("error.request > ", error.request);
        } else {
          console.log("Error", error.message);
        }
        console.log("error.config", error.config);
      });
    //console.log('response', response)
    return {
      status: response?.status,
      data: response?.data,
    };
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
  },
  extraReducers: (builder) => {
    builder.addCase(fetchBooksThunk.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(
      fetchBooksThunk.rejected,
      (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        //state.error = action.payload
        state.error = "Something went wrong ...";
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
    builder.addCase(addNewBookThunk.pending, (state, action) => {
      state.isLoading = true;
    });

    builder.addCase(
      addNewBookThunk.rejected,
      (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload;
        //state.error = 'Something went wrong ...'
      }
    );
    builder.addCase(
      addNewBookThunk.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        if (action.payload?.status == 200) {
          state.items = [action.payload.data, ...state.items];
          state.error = null;
        } else {
          state.error = action.payload?.data;
        }
        state.status = action.payload?.status;

        //console.log('inside addnewauthorThunk reducer>payload: ', action.payload)
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
      }
    );
    builder.addCase(
      editBookThunk.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        if (action.payload?.status == 200) {
          state.error = null;
          state.items = state.items.map((item) => {
            if (item.isbn === action.payload.data.isbn) {
              return action.payload.data;
            }

            return item;
          });
        } else {
          state.error = action.payload?.data;
        }
        state.status = action.payload?.status;
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
