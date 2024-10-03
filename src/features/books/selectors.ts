import { createSelector } from '@reduxjs/toolkit'
import { RootState } from '../../store'

export const selectBooks = (state: RootState) => state.books.items
export const selectSearchQuery = (state: RootState) => state.books.searchQuery
export const selectFilterCriteria = (state: RootState) => state.books.filterCriteria

export const selectFilteredBooks = createSelector(
  selectBooks,
  selectSearchQuery,
  selectFilterCriteria,
  (books, searchQuery, filterCriteria) => {
    // Apply the search query and filter criteria to filter the books
    let filteredBooks = books

    if (searchQuery) {
      filteredBooks = filteredBooks.filter((book) =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // if (filterCriteria) {
    //   filteredBooks = filteredBooks.filter(
    //     (book) => book.publishers.toLowerCase() === filterCriteria.toLowerCase()
    //   )
    // }

    if (filterCriteria) {
      filteredBooks = filteredBooks.filter((book) =>
        book.authorList.some((author) => author.name.toLowerCase() === filterCriteria.toLowerCase())
      )
    }

    return filteredBooks
  }
)
