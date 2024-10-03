import React, { useState, useEffect, ChangeEvent } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import AdminNav from '../admin/AdminNav'
import type { RootState, AppDispatch } from '../../store'
import { fetchCategoryThunk, addNewCategoryThunk } from '../../features/category/categorySlice'

//mui

import { TextField, Button } from '@mui/material'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Grid from '@mui/material/Grid'

export default function CategoryForm() {
  const dispatch = useDispatch<AppDispatch>()
  const { categories } = useSelector((state: RootState) => state)

  const [name, setName] = useState('')

  const handleSubmit = (e: any) => {
    e.preventDefault()

    //from mui example
    setNameError(false)

    if (name == '') {
      setNameError(true)
    }

    if (name) {
      dispatch(addNewCategoryThunk({ name: name }))
      //;<Link to="/adminDashboard">Go back to dashboard</Link>
    }
  }
  const [nameError, setNameError] = useState(false)

  useEffect(() => {
    dispatch(fetchCategoryThunk())
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
                <TableCell>Category Name</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.items.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>{category.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* category add form */}
          <form action="" className="categoryForm" onSubmit={handleSubmit}>
            <h2>Add New Category</h2>

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
            {categories.error ? <span>{categories.error}</span> : ''}
          </form>
        </Grid>
      </Grid>
    </React.Fragment>
  )
}
