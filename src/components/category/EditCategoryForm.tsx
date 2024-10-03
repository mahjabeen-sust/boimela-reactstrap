import React, { useState, useEffect, ChangeEvent } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import AdminNav from '../admin/AdminNav'
import type { RootState, AppDispatch } from '../../store'
import { fetchCategoryThunk, editCategoryThunk } from '../../features/category/categorySlice'
import { Category } from '../../type'

//mui
import { TextField, Button } from '@mui/material'
import Grid from '@mui/material/Grid'

export default function EditCategoryForm(props: Category) {
  const dispatch = useDispatch<AppDispatch>()
  const { categories } = useSelector((state: RootState) => state)
  //console.log('Received as props:', props)

  const [newCategory, setNewCategory] = useState({
    id: props.id,
    name: props.name
  })
  if (newCategory.id !== props.id) {
    setNewCategory((prev) => ({
      ...prev,
      id: props.id,
      name: props.name
    }))
  }

  //console.log('newcategory from props:', newcategory)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value
    let name = e.target.name
    // console.log(value)
    setNewCategory((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: any) => {
    e.preventDefault()
    //from mui example
    setNameError(false)
    if (newCategory.name == '') {
      setNameError(true)
    }
    if (newCategory.name) {
      dispatch(editCategoryThunk(newCategory))
      //;<Link to="/adminDashboard">Go back to dashboard</Link>
    }
  }
  const [nameError, setNameError] = useState(false)

  useEffect(() => {
    dispatch(fetchCategoryThunk())
  }, [])

  return (
    <React.Fragment>
      <form action="" className="categoryEditForm" onSubmit={handleSubmit}>
        <h2>Edit category</h2>

        <TextField
          label="Name"
          name="name"
          onChange={handleChange}
          required
          variant="outlined"
          color="secondary"
          type="text"
          sx={{ mb: 3 }}
          fullWidth
          value={newCategory.name}
          placeholder="placeholder"
          //error={nameError}
        />
        {categories.error ? <span>{categories.error}</span> : ''}
        <Button variant="outlined" color="secondary" type="submit">
          Submit
        </Button>
      </form>
    </React.Fragment>
  )
}
