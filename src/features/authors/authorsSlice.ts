import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'

import { Author } from '../../type'

export interface authorState {
  items: Author[]
  isLoading: boolean
  error: string | null
}

const initialState: authorState = {
  items: [],
  isLoading: false,
  error: null
}

const API_PLACEHOLDER = import.meta.env.VITE_API_ORIGIN

export const fetchAuthorsThunk = createAsyncThunk('authors/fetch', async () => {
  const response = await axios.get(`${API_PLACEHOLDER}/api/v1/authors/`)
  const data: Author[] = await response.data
  //console.log('Found authors', data)
  return data
})

export const addNewAuthorThunk = createAsyncThunk(
  'authors/add',
  async (author: { name: string }) => {
    //console.log(author)
    const token = localStorage.getItem('token')

    const headers = {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token
    }

    // Make the Axios request
    const response = await axios
      .post(`${API_PLACEHOLDER}/api/v1/authors/`, author, {
        headers
      })
      .catch(function (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          // console.log('error.response.data > ', error.response.data)
          // console.log('error.response.status > ', error.response.status)
          // console.log('error.response.headers > ', error.response.headers)

          return {
            status: error.response.status,
            data: error.response.data
          }
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log('error.request > ', error.request)
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message)
        }
        console.log('error.config', error.config)
      })
    //console.log('response', response)
    return {
      status: response?.status,
      data: response?.data
    }
  }
)

//edit author thunk
export const editAuthorThunk = createAsyncThunk(
  'authors/edit',
  async (author: { id: number; name: string }) => {
    const token = localStorage.getItem('token')

    const headers = {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token
    }

    // Make the Axios request
    const response = await axios
      .put(`${API_PLACEHOLDER}/api/v1/authors/${author.id}`, author, {
        headers
      })
      .catch(function (error) {
        if (error.response) {
          return {
            status: error.response.status,
            data: error.response.data
          }
        } else if (error.request) {
          console.log('error.request > ', error.request)
        } else {
          console.log('Error', error.message)
        }
        console.log('error.config', error.config)
      })
    //console.log('response', response)
    return {
      status: response?.status,
      data: response?.data
    }
  }
)

//delete author thunk
export const deleteAuthorThunk = createAsyncThunk('authors/delete', async (id: number) => {
  const token = localStorage.getItem('token')

  const headers = {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + token
  }

  // Make the Axios request
  const response = await axios
    .delete(`${API_PLACEHOLDER}/api/v1/authors/${id}`, {
      headers
    })
    .catch(function (error) {
      if (error.response) {
        return {
          status: error.response.status,
          data: error.response.data
        }
      } else if (error.request) {
        console.log('error.request > ', error.request)
      } else {
        console.log('Error', error.message)
      }
      console.log('error.config', error.config)
    })
  //console.log('response', response)
  return {
    status: response?.status,
    data: response?.data
  }
})

//SLICE
export const authorsSlice = createSlice({
  name: 'authors',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAuthorsThunk.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(fetchAuthorsThunk.rejected, (state, action: PayloadAction<any>) => {
      state.isLoading = false
      //state.error = action.payload
      state.error = 'Something went wrong ...'
    })
    builder.addCase(fetchAuthorsThunk.fulfilled, (state, action: PayloadAction<Author[]>) => {
      state.isLoading = false
      state.items = action.payload
    })

    //adding authors reducers
    builder.addCase(addNewAuthorThunk.pending, (state, action) => {
      state.isLoading = true
    })

    builder.addCase(addNewAuthorThunk.rejected, (state, action: PayloadAction<any>) => {
      state.isLoading = false
      state.error = action.payload
      //state.error = 'Something went wrong ...'
    })
    builder.addCase(addNewAuthorThunk.fulfilled, (state, action: PayloadAction<any>) => {
      if (action.payload?.status == 200) {
        state.items = [action.payload.data, ...state.items]
        state.error = null
      } else {
        state.error = action.payload?.data
      }

      //console.log('inside addnewauthorThunk reducer>payload: ', action.payload)
    })

    //edit author thunk reducers
    builder.addCase(editAuthorThunk.pending, (state) => {
      state.isLoading = true
    })

    builder.addCase(editAuthorThunk.rejected, (state, action: PayloadAction<any>) => {
      state.isLoading = false
      state.error = action.payload.data
    })
    builder.addCase(editAuthorThunk.fulfilled, (state, action: PayloadAction<any>) => {
      if (action.payload?.status == 200) {
        state.error = null
        state.items = state.items.map((item) => {
          if (item.id === action.payload.data.id) {
            return action.payload.data
          }

          return item
        })
      } else {
        state.error = action.payload?.data
      }
    })

    //delete author thunk reducers
    builder.addCase(deleteAuthorThunk.pending, (state) => {
      state.isLoading = true
    })

    builder.addCase(deleteAuthorThunk.rejected, (state, action: PayloadAction<any>) => {
      state.isLoading = false
      state.error = action.payload.data
    })
    builder.addCase(deleteAuthorThunk.fulfilled, (state, action: PayloadAction<any>) => {
      if (action.payload?.status == 200) {
        state.error = null
        state.items = state.items.filter((prev) => prev.id !== action.payload.data.id)
      } else {
        state.error = action.payload?.data
      }
    })
  }
})

export default authorsSlice.reducer
