import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'

import type { RootState, AppDispatch } from '../../store'
//import { editBook } from '../../features/books/booksSlice'
import { fetchAllLoansForAdminThunk } from '../../features/books/loansSlice'
import AdminNav from './AdminNav'

import Table from '@mui/material/Table'
import { Button } from '@mui/material'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Grid from '@mui/material/Grid'

const Loans = () => {
  const { loans } = useSelector((state: RootState) => state)
  //console.log('loans > ', loans)

  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    dispatch(fetchAllLoansForAdminThunk())
  }, [])

  return (
    <Grid
      container
      rowSpacing={1}
      columnSpacing={{ xs: 1, sm: 0, md: 0 }}
      className="main-container">
      <Grid item xs={3}>
        <AdminNav />
      </Grid>
      <Grid item xs={9} className="pl-24">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Borrower</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Authors</TableCell>
              <TableCell>Borrow Date</TableCell>
              <TableCell>Return Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loans.items.map((loan) => (
              <TableRow key={loan.id}>
                <TableCell>{loan.loanUser?.username}</TableCell>
                <TableCell>{loan.book.title}</TableCell>
                <TableCell>{loan.book.category.name}</TableCell>
                <TableCell>
                  {loan.book.authorList.map((author) => (
                    <>
                      <span key={author.id}>{author.name} </span>
                      <br />
                    </>
                  ))}
                </TableCell>
                <TableCell>{loan.borrowDate}</TableCell>
                <TableCell>{loan.returnDate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Grid>
    </Grid>
  )
}

export default Loans
