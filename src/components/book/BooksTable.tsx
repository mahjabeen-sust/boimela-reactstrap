import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Row, Col, Table, Card, CardTitle, CardBody, Button } from "reactstrap";
import type { RootState, AppDispatch } from "../../store";
import {
  fetchBooksThunk,
  deleteBookThunk,
} from "../../features/books/booksSlice";
import EditBookForm from "./EditBookForm";

const BooksTable = () => {
  const books = useSelector((state: RootState) => state.books);
  const [updateBookIsbn, setUpdateBookIsbn] = useState<null | string>();
  const [deleteBookIsbn, setDeleteBookIsbn] = useState<null | string>();

  //console.log('received book', book)

  const dispatch = useDispatch<AppDispatch>();

  //console.log('before handle edit', books.items)

  const bookToBeUpdated = books.items.find((book) => {
    if (book.isbn === updateBookIsbn) return book;
  });

  useEffect(() => {
    dispatch(fetchBooksThunk());
  }, []);

  const handleEdit = (isbn: string) => {
    //alert(isbn)
    setUpdateBookIsbn(isbn);
  };

  const handleDelete = (isbn: string) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      // Proceed with deleting the book
      setDeleteBookIsbn(isbn);
      dispatch(deleteBookThunk(isbn));
    }
  };

  return (
    <Row>
      <Col lg="12">
        <Card>
          <CardTitle tag="h6" className="border-bottom p-3 mb-0">
            <i className="bi bi-card-text me-2"> </i>
            Books
          </CardTitle>
          <CardBody className="">
            <Table bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Author(s)</th>
                  <th>Publisher</th>
                  <th>Publish Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {books.items.map((book, index) => (
                  <tr key={book.isbn}>
                    <th scope="row">{index + 1}</th>
                    <td>{book.title}</td>
                    <td>
                      {book.authorList.map((author) => (
                        <div key={author.id}>{author.name}</div>
                      ))}
                    </td>
                    <td>{book.publishers}</td>
                    <td>{book.publishedDate}</td>
                    <td>{book.status}</td>
                    <td className="button-group">
                      <Button
                        className="btn"
                        color="primary"
                        size="sm"
                        onClick={() => handleEdit(book.isbn)}
                      >
                        Edit
                      </Button>
                      <Button
                        className="btn"
                        color="primary"
                        size="sm"
                        onClick={() => handleDelete(book.isbn)}
                      >
                        Delete
                      </Button>
                      {books.error && deleteBookIsbn == book.isbn ? (
                        <span className="error">{books.error.message}</span>
                      ) : (
                        ""
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            {/* bookToBeUpdated && <EditBookForm {...bookToBeUpdated} /> */}
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default BooksTable;
