import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'

import { Loan, loanDTO } from '../../type'

export interface LoanState {
  items: Loan[]
  isLoading: boolean
  error: string | null
  status: string | null
}

const initialState: LoanState = {
  items: [],
  isLoading: false,
  error: null,
  status: null
}

const API_PLACEHOLDER = import.meta.env.VITE_API_ORIGIN

//fetching all loans for admin
export const fetchAllLoansForAdminThunk = createAsyncThunk('loans/fetchAll', async () => {
  const token = localStorage.getItem('token')

  const headers = {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + token
  }
  const response = await axios
    .get(`${API_PLACEHOLDER}/api/v1/loan/all`, {
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

//ACTION

export const fetchLoansThunk = createAsyncThunk('loans/fetch', async (username: string | null) => {
  //console.log('username inside loan thunk', username)
  const token = localStorage.getItem('token')

  const headers = {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + token
  }
  const response = await axios
    .get(`${API_PLACEHOLDER}/api/v1/loan/${username}`, {
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

//add loan thunk
export const createLoanThunk = createAsyncThunk('loans/add', async (loan: loanDTO) => {
  const token = localStorage.getItem('token')

  const headers = {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + token
  }

  // Make the Axios request
  const response = await axios
    .post(`${API_PLACEHOLDER}/api/v1/loan/`, loan, {
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

  return {
    status: response?.status,
    data: response?.data
  }
})

//return loan thunk

export const returnLoanThunk = createAsyncThunk('loans/return', async (id: string) => {
  const token = localStorage.getItem('token')
  //console.log('Sent token >', token)
  const emptyBody = 'test text'
  const headers = {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + token
  }

  // Make the Axios request
  const response = await axios
    .put(`${API_PLACEHOLDER}/api/v1/loan/${id}`, emptyBody, {
      headers
    })
    .catch(function (error) {
      console.log('error.response > ', error.response)
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
export const loansSlice = createSlice({
  name: 'loans',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    //all loans for admin
    builder.addCase(fetchAllLoansForAdminThunk.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(fetchAllLoansForAdminThunk.rejected, (state, action: PayloadAction<any>) => {
      state.isLoading = false
      //state.error = action.payload
      state.error = 'Something went wrong ...'
    })
    builder.addCase(fetchAllLoansForAdminThunk.fulfilled, (state, action: PayloadAction<any>) => {
      state.isLoading = false
      state.items = action.payload.data
      state.error = null
    })

    //loans for users
    builder.addCase(fetchLoansThunk.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(fetchLoansThunk.rejected, (state, action: PayloadAction<any>) => {
      state.isLoading = false
      //state.error = action.payload
      state.error = 'Something went wrong ...'
    })
    builder.addCase(fetchLoansThunk.fulfilled, (state, action: PayloadAction<any>) => {
      if (action.payload?.status == 200) {
        state.isLoading = false
        state.items = action.payload.data
        state.error = null
      } else {
        state.error = action.payload?.data
      }
      state.status = action.payload?.status
    })

    //return loan reducers
    builder.addCase(returnLoanThunk.pending, (state, action) => {
      state.isLoading = true
    })

    builder.addCase(returnLoanThunk.rejected, (state, action: PayloadAction<any>) => {
      state.isLoading = false
      state.error = action.payload
      console.log('rejected', action.payload)
      //state.error = 'Something went wrong ...'
    })
    builder.addCase(returnLoanThunk.fulfilled, (state, action: PayloadAction<any>) => {
      if (action.payload?.status == 200) {
        //console.log('returnLoan fulfilled!')
        state.items = state.items.map((item) => {
          if (item.id === action.payload.data.id) {
            return action.payload.data
          }

          return item
        })
        state.error = null
      } else {
        state.error = action.payload?.data
        console.log('state error > ', state.error)
      }
      state.status = action.payload?.status

      //console.log('inside addnewauthorThunk reducer>payload: ', action.payload)
    })

    //create reducers
    builder.addCase(createLoanThunk.pending, (state) => {
      state.isLoading = true
    })

    builder.addCase(createLoanThunk.rejected, (state, action: PayloadAction<any>) => {
      state.isLoading = false
      state.error = action.payload.data
    })
    builder.addCase(createLoanThunk.fulfilled, (state, action: PayloadAction<any>) => {
      if (action.payload?.status == 200) {
        state.error = null
        state.items = [action.payload.data, ...state.items]
      } else {
        state.error = action.payload?.data
      }
      state.status = action.payload?.status
    })
  }
})

export default loansSlice.reducer
