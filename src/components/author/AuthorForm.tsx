import React, { useState, useEffect, ChangeEvent } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import AdminNav from '../admin/AdminNav'
import type { RootState, AppDispatch } from '../../store'
import { fetchAuthorsThunk, addNewAuthorThunk } from '../../features/authors/authorsSlice'

//mui

import { TextField, Button } from '@mui/material'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Grid from '@mui/material/Grid'

export default function AuthorForm() {
  const dispatch = useDispatch<AppDispatch>()
  const { authors } = useSelector((state: RootState) => state)
  //console.log('author object length', Object.keys(authors.items).length)

  // const [newAuthor, setNewAuthor] = useState({
  //   id: Object.keys(authors.items).length + 1,
  //   name: ''
  // })

  // const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   let value = e.target.value
  //   let name = e.target.name
  //   setNewAuthor((prev) => ({
  //     ...prev,
  //     [name]: value
  //   }))
  // }

  const [name, setName] = useState('')

  const handleSubmit = (e: any) => {
    e.preventDefault()

    //from mui example
    setNameError(false)

    if (name == '') {
      setNameError(true)
    }

    if (name) {
      dispatch(addNewAuthorThunk({ name: name }))
      //;<Link to="/adminDashboard">Go back to dashboard</Link>
    }
  }
  const [nameError, setNameError] = useState(false)

  useEffect(() => {
    dispatch(fetchAuthorsThunk())
  }, [])

  return (
    <React.Fragment>
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
                <TableCell>Author Name</TableCell>
                <TableCell>Published Books</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {authors.items.map((author) => (
                <TableRow key={author.id}>
                  <TableCell>{author.name}</TableCell>
                  <TableCell>#of Books</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* author add form */}
          <form action="" className="AuthorForm" onSubmit={handleSubmit}>
            <h2>Add New Author</h2>

            <TextField
              label="Name"
              name="name"
              onChange={(e) => setName(e.target.value)}
              required
              variant="outlined"
              color="secondary"
              type="text"
              sx={{ mb: 3 }}
              fullWidth
              value={name}
              //error={nameError}
            />
            <Button variant="outlined" color="secondary" type="submit">
              Add
            </Button>
            {authors.error ? <span>{authors.error}</span> : ''}
          </form>
        </Grid>
      </Grid>
    </React.Fragment>
  )
}
