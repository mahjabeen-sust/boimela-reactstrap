import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'

import { Category } from '../../type'

export interface categoryState {
  items: Category[]
  isLoading: boolean
  error: string | null
}

const initialState: categoryState = {
  items: [],
  isLoading: false,
  error: null
}

const API_PLACEHOLDER = import.meta.env.VITE_API_ORIGIN

export const fetchCategoryThunk = createAsyncThunk('categories/fetch', async () => {
  const response = await axios.get(`${API_PLACEHOLDER}/api/v1/categories/`)
  const data: Category[] = await response.data
  //console.log('Found categorys', data)
  return data
})

export const addNewCategoryThunk = createAsyncThunk(
  'categories/add',
  async (category: { name: string }) => {
    //console.log(category)
    const token = localStorage.getItem('token')

    const headers = {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token
    }

    // Make the Axios request
    const response = await axios
      .post(`${API_PLACEHOLDER}/api/v1/categories/`, category, {
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

//edit category thunk
export const editCategoryThunk = createAsyncThunk(
  'categories/edit',
  async (category: { id: number; name: string }) => {
    const token = localStorage.getItem('token')

    const headers = {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token
    }

    // Make the Axios request
    const response = await axios
      .put(`${API_PLACEHOLDER}/api/v1/categories/${category.id}`, category, {
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

//edit category thunk
export const deleteCategoryThunk = createAsyncThunk('categories/delete', async (id: number) => {
  const token = localStorage.getItem('token')

  const headers = {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + token
  }

  // Make the Axios request
  const response = await axios
    .delete(`${API_PLACEHOLDER}/api/v1/categories/${id}`, {
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
export const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCategoryThunk.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(fetchCategoryThunk.rejected, (state, action: PayloadAction<any>) => {
      state.isLoading = false
      //state.error = action.payload
      state.error = 'Something went wrong ...'
    })
    builder.addCase(fetchCategoryThunk.fulfilled, (state, action: PayloadAction<Category[]>) => {
      state.isLoading = false
      state.items = action.payload
    })

    //adding categorys reducers
    builder.addCase(addNewCategoryThunk.pending, (state, action) => {
      state.isLoading = true
    })

    builder.addCase(addNewCategoryThunk.rejected, (state, action: PayloadAction<any>) => {
      state.isLoading = false
      state.error = action.payload
      //state.error = 'Something went wrong ...'
    })
    builder.addCase(addNewCategoryThunk.fulfilled, (state, action: PayloadAction<any>) => {
      if (action.payload?.status == 200) {
        state.items = [action.payload.data, ...state.items]
        state.error = null
      } else {
        state.error = action.payload?.data
      }

      //console.log('inside addnewcategoryThunk reducer>payload: ', action.payload)
    })

    //edit category thunk reducers
    builder.addCase(editCategoryThunk.pending, (state) => {
      state.isLoading = true
    })

    builder.addCase(editCategoryThunk.rejected, (state, action: PayloadAction<any>) => {
      state.isLoading = false
      state.error = action.payload.data
    })
    builder.addCase(editCategoryThunk.fulfilled, (state, action: PayloadAction<any>) => {
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

    //delet category thunk reducers
    builder.addCase(deleteCategoryThunk.pending, (state) => {
      state.isLoading = true
    })

    builder.addCase(deleteCategoryThunk.rejected, (state, action: PayloadAction<any>) => {
      state.isLoading = false
      state.error = action.payload.data
    })
    builder.addCase(deleteCategoryThunk.fulfilled, (state, action: PayloadAction<any>) => {
      if (action.payload?.status == 200) {
        state.error = null
        state.items = state.items.filter((prev) => prev.id !== action.payload.data.id)
      } else {
        state.error = action.payload?.data
      }
    })
  }
})

export default categorySlice.reducer
