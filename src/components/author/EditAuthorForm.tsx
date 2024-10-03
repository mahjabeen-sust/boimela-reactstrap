import React, { useState, useEffect, ChangeEvent } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import AdminNav from '../admin/AdminNav'
import type { RootState, AppDispatch } from '../../store'
import { fetchAuthorsThunk, editAuthorThunk } from '../../features/authors/authorsSlice'
import { Author } from '../../type'

//mui
import { TextField, Button } from '@mui/material'
import Grid from '@mui/material/Grid'

export default function EditAuthorForm(props: Author) {
  const dispatch = useDispatch<AppDispatch>()
  const { authors } = useSelector((state: RootState) => state)
  //console.log('Received as props:', props)

  const [newAuthor, setNewAuthor] = useState({
    id: props.id,
    name: props.name
  })
  if (newAuthor.id !== props.id) {
    setNewAuthor((prev) => ({
      ...prev,
      id: props.id,
      name: props.name
    }))
  }

  //console.log('newAuthor from props:', newAuthor)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value
    let name = e.target.name
    // console.log(value)
    setNewAuthor((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: any) => {
    e.preventDefault()
    //from mui example
    setNameError(false)
    if (newAuthor.name == '') {
      setNameError(true)
    }
    if (newAuthor.name) {
      dispatch(editAuthorThunk(newAuthor))
      //;<Link to="/adminDashboard">Go back to dashboard</Link>
    }
  }
  const [nameError, setNameError] = useState(false)

  useEffect(() => {
    dispatch(fetchAuthorsThunk())
  }, [])

  return (
    <React.Fragment>
      <form action="" className="authorEditForm" onSubmit={handleSubmit}>
        <h2>Edit Author</h2>

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
          value={newAuthor.name}
          placeholder="placeholder"
          //error={nameError}
        />
        {authors.error ? <span>{authors.error}</span> : ''}
        <Button variant="outlined" color="secondary" type="submit">
          Submit
        </Button>
      </form>
    </React.Fragment>
  )
}
