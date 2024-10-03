import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

//mui
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Box from '@mui/system/Box'
import Grid from '@mui/system/Unstable_Grid'
import styled from '@mui/system/styled'

import type { RootState, AppDispatch } from '../../store'
import { fetchBooksThunk, setSearchQuery, setFilterCriteria } from '../../features/books/booksSlice'
import { fetchAuthorsThunk } from '../../features/authors/authorsSlice'
import { selectFilteredBooks } from '../../features/books/selectors'
import { fetchLoansThunk, createLoanThunk } from '../../features/books/loansSlice'
import { Book, loanDTO } from '../../type'

const SearchBook = () => {
  //const { books } = useSelector((state: RootState) => state)
  const books = useSelector(selectFilteredBooks)
  const { authors } = useSelector((state: RootState) => state)
  //console.log('books', books.items)
  const dispatch = useDispatch<AppDispatch>()

  //check if user is admin
  const loggedInUser = useSelector((state: RootState) => state.auth.user.username)

  useEffect(() => {
    dispatch(fetchBooksThunk())
    dispatch(fetchAuthorsThunk())
  }, [])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchQuery(e.target.value))
  }

  const handleFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setFilterCriteria(e.target.value))
  }

  const borrow = (isbn: string) => {
    const loanDTO: loanDTO = {
      bookIsbn: isbn,
      username: loggedInUser,
      borrowDate: new Date().toISOString().slice(0, 10).replace('/-/gi', '/'),
      loanStatus: 'INDEBT'
    }

    //console.log('book to be borrowed:', borrowedBook)
    //dispatch the borrowBook

    dispatch(createLoanThunk(loanDTO))
  }

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        {/* {books.isLoading ? <span>Loading .... </span> : ''} */}
        <div>
          <input type="text" placeholder="Search by Title" onChange={handleSearch} />
          <span> Filter By: </span>
          <select onChange={handleFilter}>
            {/* <option value="">All Publisher</option>
            <option value="QP">QP</option>
            <option value="PP">PP</option> */}
            <option value="">All Authors</option>
            {authors.items.map((author) => (
              <option value={author.name}>{author.name}</option>
            ))}
          </select>
        </div>
        <div>
          <br />
        </div>
        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
          {/* {Array.from(Array(50)).map((_, index) => ( */}
          {books.map((book) => (
            <Grid xs={2} sm={4} key={book.isbn}>
              <Card sx={{ maxWidth: 345, p: 0, minHeight: 200 }}>
                <CardMedia
                  sx={{ height: 100 }}
                  image="/assets/images/book-image.jpg"
                  title={book.title}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {book.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    By -
                    {book.authorList.map((author) => (
                      <span key={author.id}>{author.name}</span>
                    ))}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Category - {book.category.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Publisher :{book.publishers}
                  </Typography>

                  <Typography gutterBottom variant="button" component="span">
                    {book.status == 'AVAILABLE' ? (
                      <Button
                        size="small"
                        variant="contained"
                        type="button"
                        onClick={() => borrow(book.isbn)}>
                        Borrow
                      </Button>
                    ) : (
                      'BORROWED'
                    )}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  )
}

export default SearchBook
