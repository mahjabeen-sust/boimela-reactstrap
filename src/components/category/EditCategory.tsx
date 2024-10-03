import React, { useState, useEffect, ChangeEvent } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import AdminNav from '../admin/AdminNav'
import type { RootState, AppDispatch } from '../../store'
import { fetchCategoryThunk, deleteCategoryThunk } from '../../features/category/categorySlice'
import EditCategoryForm from './EditCategoryForm'

//mui
import { TextField, Button } from '@mui/material'
import Grid from '@mui/material/Grid'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'

export default function Editcategory() {
  const dispatch = useDispatch<AppDispatch>()
  const { categories } = useSelector((state: RootState) => state)
  //console.log('category object length', Object.keys(categorys.items).length)
  const [isEdit, setIsEdit] = useState(false)

  const [updatecategoryId, setupdatecategoryId] = useState<null | number>()
  const categoryToBeUpdated = categories.items.find((category) => {
    if (category.id === updatecategoryId) return category
  })
  //console.log('category to be updated', categoryToBeUpdated)

  const deleteAction = (id: number) => {
    setupdatecategoryId(id)
    dispatch(deleteCategoryThunk(id))
  }

  useEffect(() => {
    dispatch(fetchCategoryThunk())
  }, [])

  return (
    <div>
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
                <TableCell>Update</TableCell>
                <TableCell>Remove</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.items.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      onClick={() => {
                        setupdatecategoryId(category.id)
                      }}>
                      Edit
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      onClick={() => {
                        deleteAction(category.id)
                      }}>
                      Delete
                    </Button>
                    {categories.error && categoryToBeUpdated?.id == category.id ? (
                      <span className="error">{categories.error}</span>
                    ) : (
                      ''
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {categoryToBeUpdated && <EditCategoryForm {...categoryToBeUpdated} />}
        </Grid>
      </Grid>
    </div>
  )
}
