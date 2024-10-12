import { useState, useEffect, ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch, RootState } from "../../store";
import { addNewBookThunk } from "../../features/books/booksSlice";
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
  const { error, status } = useSelector((state: RootState) => state.books);
  const authors = useSelector((state: RootState) => state.authors);
  const categories = useSelector((state: RootState) => state.categories);

  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);
  const [showSuccess, setShowSuccess] = useState(false); // For success alert
  const [errorMessage, setErrorMessage] = useState(""); // For error messages

  const [newBook, setNewBook] = useState({
    isbn: "",
    title: "",
    description: "",
    publishers: "",
    categoryId: categories?.items[0]?.id,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("newBook inside handle submit", newBook);

    if (newBook.title && newBook.description) {
      //adding the multiple select to authorIdList
      newBook.authorIdList = selectedAuthors;
      // console.log("newbook: ", newBook);
      dispatch(addNewBookThunk(newBook));
    }
  };

  useEffect(() => {
    dispatch(fetchAuthorsThunk());
    dispatch(fetchCategoryThunk());
  }, []);

  // Update categoryId after categories are fetched
  useEffect(() => {
    if (categories?.items.length > 0) {
      setNewBook((prevBook) => ({
        ...prevBook,
        categoryId: categories.items[0].id, // Update categoryId once categories are loaded
      }));
    }
  }, [categories]);

  useEffect(() => {
    if (status === 200) {
      console.error("success adding book:");
      setShowSuccess(true); // Show the success alert
      setErrorMessage(""); // Clear any previous error messages
      // Reset form values
      setNewBook({
        title: "",
        description: "",
        categoryId: categories?.items[0]?.id ?? "",
        authorIdList: [],
        isbn: "",
        publishers: "",
        publishedDate: "",
        status: "AVAILABLE",
      });
      // delay to fade the suucess alert
      setTimeout(() => {
        setShowSuccess(false); // Hide the success alert
      }, 2000);
    }
    if (error) {
      console.error("Failed to add the book:", error);
      setShowSuccess(false);
      setErrorMessage(
        error.message || "An error occurred while adding the book"
      );
    }
  }, [status, error]);

  return (
    <Row>
      <Col>
        <Card>
          {errorMessage && <Alert color="danger">{errorMessage}</Alert>}

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
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
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
                  <option>AVAILABLE</option>
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
            </Form>
            {showSuccess && (
              <Alert color="success">Book added successfully!</Alert>
            )}
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default Forms;
