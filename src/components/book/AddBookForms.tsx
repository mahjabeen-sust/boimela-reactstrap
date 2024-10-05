import { useState, useEffect, ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch, RootState } from "../../store";
import {
  fetchBooksThunk,
  addNewBookThunk,
} from "../../features/books/booksSlice";
import { fetchAuthorsThunk } from "../../features/authors/authorsSlice";
import { fetchCategoryThunk } from "../../features/category/categorySlice";

import {
  Card,
  Row,
  Col,
  CardTitle,
  CardBody,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Alert,
} from "reactstrap";

const Forms = () => {
  const dispatch = useDispatch<AppDispatch>();
  const books = useSelector((state: RootState) => state.books);
  const authors = useSelector((state: RootState) => state.authors);
  const categories = useSelector((state: RootState) => state.categories);

  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);
  // console.log("category id > ", categories.items[0]?.id);

  const [newBook, setNewBook] = useState({
    isbn: "",
    title: "",
    description: "",
    publishers: "",
    categoryId: categories.items[0]?.id || "",
    authorIdList: [""],
    status: "AVAILABLE",
    publishedDate: new Date().toISOString().slice(0, 7).replace("/-/gi", "/"),
  });
  // console.log("1st newBook", newBook);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewBook((prev) => ({
      ...prev,
      [name]: value,
    }));
    // console.log("inside handle change newBook", newBook);
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { options } = event.target;
    const values: string[] = [];

    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        values.push(options[i].value);
      }
    }

    setSelectedAuthors(values);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log("newBook inside handle submit", newBook);
    // return 1
    //from mui example

    if (newBook.title && newBook.description) {
      //adding the multiple select to authorIdList
      newBook.authorIdList = selectedAuthors;
      // console.log("newbook: ", newBook);
      dispatch(addNewBookThunk(newBook));
    }
  };

  useEffect(() => {
    dispatch(fetchBooksThunk());
    dispatch(fetchAuthorsThunk());
    dispatch(fetchCategoryThunk());
  }, []);

  return (
    <Row>
      <Col>
        {/* --------------------------------------------------------------------------------*/}
        {/* Card-1*/}
        {/* --------------------------------------------------------------------------------*/}
        <Card>
          <CardTitle tag="h6" className="border-bottom p-3 mb-0">
            <i className="bi bi-bell me-2"> </i>
            Add a Book
          </CardTitle>
          <CardBody>
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label for="isbn">ISBN</Label>
                <Input
                  id="isbn"
                  name="isbn"
                  value={newBook.isbn}
                  placeholder="provide the isbn"
                  type="text"
                  required
                  onChange={handleChange}
                />
              </FormGroup>
              <FormGroup>
                <Label for="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  type="text"
                  required
                  onChange={handleChange}
                  value={newBook.title}
                  placeholder="Name of the book"
                />
              </FormGroup>

              <FormGroup>
                <Label for="description">Description</Label>
                <Input
                  id="description"
                  name="description"
                  type="textarea"
                  required
                  onChange={handleChange}
                  value={newBook.description}
                  placeholder="something about the book ..."
                />
              </FormGroup>
              <FormGroup>
                <Label for="publishers">Publishers</Label>
                <Input
                  id="publishers"
                  name="publishers"
                  placeholder="Who published the book?"
                  type="text"
                  required
                  onChange={handleChange}
                  value={newBook.publishers}
                />
              </FormGroup>
              <FormGroup>
                <Label for="category">Category</Label>
                <Input
                  id="category"
                  name="categoryId"
                  type="select"
                  value={newBook.categoryId}
                  required
                  onChange={(event) => handleChange(event as any)}
                >
                  {categories.items.map((category) => (
                    <option value={category.id}>{category.name}</option>
                  ))}
                </Input>
              </FormGroup>

              <FormGroup>
                <Label for="authors">Author(s)</Label>
                <Input
                  id="authors"
                  multiple
                  name="authors"
                  type="select"
                  required
                  onChange={(event) => handleSelectChange(event as any)}
                >
                  {authors.items.map((author) => (
                    <option key={author.id} value={author.id.toString()}>
                      {author.name}
                    </option>
                  ))}
                </Input>
              </FormGroup>
              <FormGroup>
                <Label for="status">Status</Label>
                <Input
                  id="status"
                  name="status"
                  type="select"
                  value={newBook.status}
                  onChange={(event) => handleChange(event as any)}
                  required
                >
                  <option selected>AVAILABLE</option>
                  <option>BORROWED</option>
                </Input>
              </FormGroup>
              <FormGroup>
                <Label for="publishedDate">Date of Publishing</Label>
                <Input
                  id="publishedDate"
                  name="publishedDate"
                  type="date"
                  required
                  onChange={handleChange}
                  value={newBook.publishedDate}
                />
              </FormGroup>

              <Button className="btn" outline color="primary" type="submit">
                Add New Book
              </Button>
              {books.error ? <span className="error">{books.error}</span> : ""}
              {books.status == "200" ? (
                <Alert color="success">Book added successfully!</Alert>
              ) : (
                ""
              )}
            </Form>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default Forms;
