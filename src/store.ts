import { configureStore } from '@reduxjs/toolkit'
import booksReducer from './features/books/booksSlice'
import authReducer from './features/login/authSlice'
import authorReducer from './features/authors/authorsSlice'
import categoryReducer from './features/category/categorySlice'
import loanReducer from './features/books/loansSlice'

export const store = configureStore({
  reducer: {
    books: booksReducer,
    auth: authReducer,
    authors: authorReducer,
    categories: categoryReducer,
    loans: loanReducer 
  }
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}

export type AppDispatch = typeof store.dispatch
