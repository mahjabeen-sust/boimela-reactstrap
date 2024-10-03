import React, { useState, useEffect, ChangeEvent } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import AdminNav from '../admin/AdminNav'
import type { RootState, AppDispatch } from '../../store'
import { fetchAuthorsThunk, deleteAuthorThunk } from '../../features/authors/authorsSlice'
import EditAuthorForm from './EditAuthorForm'

//mui
import { TextField, Button } from '@mui/material'
import Grid from '@mui/material/Grid'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'

export default function EditAuthor() {
  const dispatch = useDispatch<AppDispatch>()
  const { authors } = useSelector((state: RootState) => state)
  //console.log('author object length', Object.keys(authors.items).length)
  const [isEdit, setIsEdit] = useState(false)

  const [updateAuthorId, setupdateAuthorId] = useState<null | number>()
  const authorToBeUpdated = authors.items.find((author) => {
    if (author.id === updateAuthorId) return author
  })
  //console.log('author to be updated', authorToBeUpdated)

  const deleteAction = (id: number) => {
    setupdateAuthorId(id)
    dispatch(deleteAuthorThunk(id))
  }

  useEffect(() => {
    dispatch(fetchAuthorsThunk())
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
                <TableCell>Author Name</TableCell>
                <TableCell>Update</TableCell>
                <TableCell>Remove</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {authors.items.map((author) => (
                <TableRow key={author.id}>
                  <TableCell>{author.name}</TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      onClick={() => {
                        setupdateAuthorId(author.id)
                      }}>
                      Edit
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      onClick={() => {
                        deleteAction(author.id)
                      }}>
                      Delete
                    </Button>
                    {authors.error && authorToBeUpdated?.id == author.id ? (
                      <span className="error">{authors.error}</span>
                    ) : (
                      ''
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {authorToBeUpdated && <EditAuthorForm {...authorToBeUpdated} />}
        </Grid>
      </Grid>
    </div>
  )
}
