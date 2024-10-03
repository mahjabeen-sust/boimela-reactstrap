import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux' // useDispatch
import type { RootState, AppDispatch } from '../../store'
import { fetchBooksThunk } from '../../features/books/booksSlice'

import {
  Row,
  Col,
} from "reactstrap";

import bg1 from "../../assets/images/bg/bg1.jpg";
// import { BookList } from '../../utils/data';

import Book from "./Book";



const Books = () => {
  const books = useSelector((state: RootState) => state.books);
  // console.log('books', books);
  const dispatch = useDispatch<AppDispatch>()

  //commenting for cors problem, will uncomment later
  useEffect(() => {
    dispatch(fetchBooksThunk())
  }, []);

  return (
    <div>
      <h5 className="mb-3">Books</h5>
      <Row>
        {books.items.map((book) => (
          <Col sm="6" lg="6" xl="3" key={book.isbn}>
            <Book
              image={bg1}
              title={book.title}
              authorList={book.authorList}
              category={book.category.name}
              description={book.description}
              status={book.status}
              color="primary"
            />
          </Col>
        ))}
      </Row>
    </div>
  )
}

export default Books
