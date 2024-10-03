import React, { useState, ChangeEvent, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import type { AppDispatch, RootState } from '../../store'
import { fetchBooksThunk, editBookThunk } from '../../features/books/booksSlice'
import { Book } from '../../type'
import { fetchAuthorsThunk } from '../../features/authors/authorsSlice'
import { fetchCategoryThunk } from '../../features/category/categorySlice'

//mui
import { TextField, Button, InputLabel, Select, MenuItem } from '@mui/material'

import styled from '@mui/system/styled'

function formatTheDate(dateString: string) {
  if (typeof dateString == 'undefined' || dateString == null) return '0000-00-00'
  // console.log(dateString)
  // return dateString
  var r_date = dateString.split('/')
  var mod_date =
    r_date[2] + '-' + (r_date[0].length === 1 ? 0 + r_date[0] : r_date[0]) + '-' + r_date[1]
  console.log('Mod ' + mod_date)

  return mod_date
}

function EditBookForm(props: Book) {
  const { books } = useSelector((state: RootState) => state)
  const { authors } = useSelector((state: RootState) => state)
  const { categories } = useSelector((state: RootState) => state)
  const authorIdList = props.authorList.map((author) => author.id)

  const dispatch = useDispatch<AppDispatch>()

  //setting values for book
  const [newBook, setNewBook] = useState({
    isbn: props.isbn,
    title: props.title,
    description: props.description,
    publishers: props.publishers,
    categoryId: props.category.id,
    authorIdList: authorIdList,
    status: props.status,
    publishedDate: props.publishedDate

    //publishedDate: formatTheDate(props.publishedDate)
  })

  //to change the props value dynamically when the 'Edit' button is clicked next to each book!
  if (newBook.isbn !== props.isbn) {
    setNewBook((prev) => ({
      ...prev,
      isbn: props.isbn,
      title: props.title,
      description: props.description,
      publishers: props.publishers,
      categoryId: props.category.id,
      authorIdList: authorIdList,
      status: props.status,
      publishedDate: props.publishedDate

      //publishedDate: formatTheDate(props.publishedDate)
    }))
  }

  //console.log('newBook: ', newBook)

  // R:8/17/2022
  // Req: 2023-08-10
  //filtering the prop values for checkboxes

  const filteredAuthors = authors.items.filter((value) => {
    return !props.authorList.some((Obj) => Obj.id === value.id)
  })

  const [checkboxes, setCheckboxes] = useState<any[]>(authorIdList)

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target
    if (checked) {
      // Add the value to the array
      setCheckboxes((checkboxes) => [...checkboxes, value])
    } else {
      // Remove the value from the array
      setCheckboxes((checkboxes) => checkboxes.filter((item) => item !== value))
    }
    //console.log('checkbox added > ', checkboxes)
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value
    let name = e.target.name
    setNewBook((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: any) => {
    e.preventDefault()

    //from mui example
    setTitleError(false)
    setDescriptionError(false)

    if (newBook.title == '') {
      setTitleError(true)
    }
    if (newBook.description == '') {
      setDescriptionError(true)
    }

    if (newBook.title && newBook.description) {
      newBook.authorIdList = checkboxes
      dispatch(editBookThunk(newBook))
      //console.log('book to be edited: ', newBook)
    }

    //console.log('after handle edit', books.items)
  }

  //from mui example
  const [titleError, setTitleError] = useState(false)
  const [descriptionError, setDescriptionError] = useState(false)

  useEffect(() => {
    dispatch(fetchBooksThunk())
    dispatch(fetchAuthorsThunk())
    dispatch(fetchCategoryThunk())
  }, [])

  return (
    <React.Fragment>
      <form action="" className="bookForm" onSubmit={handleSubmit}>
        <h2>Edit Book Form</h2>

        <TextField
          label="ISBN"
          name="isbn"
          onChange={handleChange}
          disabled
          required
          variant="outlined"
          color="secondary"
          type="text"
          sx={{ mb: 3 }}
          fullWidth
          value={newBook.isbn}
          //error={titleError}
        />
        <TextField
          label="Title"
          name="title"
          onChange={handleChange}
          required
          variant="outlined"
          color="secondary"
          type="text"
          sx={{ mb: 3 }}
          fullWidth
          value={newBook.title}
          error={titleError}
        />

        <TextField
          label="Description"
          name="description"
          onChange={handleChange}
          required
          variant="outlined"
          color="secondary"
          type="text"
          value={newBook.description}
          error={descriptionError}
          fullWidth
          sx={{ mb: 3 }}
        />
        <TextField
          label="Publishers"
          name="publishers"
          onChange={handleChange}
          required
          variant="outlined"
          color="secondary"
          type="text"
          sx={{ mb: 3 }}
          fullWidth
          value={newBook.publishers}
          //error={titleError}
        />
        <InputLabel id="category-add-label">Category</InputLabel>
        <Select
          label="Category"
          name="categoryId"
          value={newBook.categoryId}
          required
          //onChange={handleChange} //this works
          onChange={(event) => handleChange(event as any)}>
          <MenuItem value={newBook.categoryId} selected>
            {props.category.name}
          </MenuItem>
          {categories.items.map((category) => (
            <MenuItem value={category.id}>{category.name}</MenuItem>
          ))}
        </Select>
        <InputLabel id="author-add-label">Authors</InputLabel>
        {/* first defaultchecked the authors from editable book */}
        {props.authorList.map((author) => (
          <div>
            <input
              type="checkbox"
              value={author.id}
              defaultChecked
              onChange={handleCheckboxChange}
            />
            {author.name}
          </div>
        ))}

        {/* now the rest of the authors from state.authors*/}

        {filteredAuthors.map((author) => (
          <div>
            <input
              type="checkbox"
              value={author.id}
              checked={checkboxes.includes(author.id.toString())}
              onChange={handleCheckboxChange}
            />
            {author.name}
          </div>
        ))}

        <InputLabel id="status-edit-label">Status</InputLabel>
        <Select
          label="Status"
          name="status"
          required
          labelId="status-edit-label"
          id="status-edit-select"
          value={newBook.status}
          onChange={(event) => handleChange(event as any)}
          sx={{ mb: 2 }}>
          <MenuItem value={newBook.status} selected>
            {newBook.status}
          </MenuItem>
          <MenuItem value="AVAILABLE">AVAILABLE</MenuItem>
          <MenuItem value="BORROWED">BORROWED</MenuItem>
        </Select>

        <TextField
          type="text"
          name="publishedDate"
          id="publish-date-edit"
          variant="outlined"
          color="secondary"
          label="Publish Date"
          onChange={handleChange}
          value={newBook.publishedDate}
          // value="2023-08-10"
          fullWidth
          required
          sx={{ mb: 4 }}
        />

        {/* <TextField
          type="date"
          name="publishedDate"
          id="publish-date-edit"
          variant="outlined"
          color="secondary"
          label="Publish Date"
          onChange={handleChange}
          value={newBook.publishedDate}
          // value="2023-08-10"
          fullWidth
          required
          sx={{ mb: 4 }}
        /> */}

        {/* more inputs to be loaded.... */}
        <Button variant="outlined" color="secondary" type="submit">
          Submit
        </Button>
        {books.error ? <span className="error">{books.error}</span> : ''}
        {books.status == '200' ? <span className="success">Book Updated Succesfully!</span> : ''}
      </form>
    </React.Fragment>
  )
}

export default EditBookForm
