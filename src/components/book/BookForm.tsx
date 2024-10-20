import { useEffect, ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
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
} from "reactstrap";

import type { AppDispatch, RootState } from "../../store";
import { fetchAuthorsThunk } from "../../features/authors/authorsSlice";
import { fetchCategoryThunk } from "../../features/category/categorySlice";
import { BookDTO } from "../../type";

// Define the props type
type BookFormProps = {
  book: BookDTO;
  setBook: React.Dispatch<React.SetStateAction<BookDTO>>;
  title: string;
  handleSubmit: () => void;
};

const BookForm: React.FC<BookFormProps> = ({
  book,
  setBook,
  title,
  handleSubmit,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const authors = useSelector((state: RootState) => state.authors);
  const categories = useSelector((state: RootState) => state.categories);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBook((prev) => ({
      ...prev,
      [name]: value,
    }));
    // console.log("inside handle change newBook", newBook);
  };

  // for author(s)
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { options } = event.target;
    const values: string[] = [];

    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        values.push(options[i].value);
      }
    }
    setBook((prev) => ({
      ...prev,
      authorIdList: values,
    }));
  };

  useEffect(() => {
    dispatch(fetchAuthorsThunk());
    dispatch(fetchCategoryThunk());
  }, []);

  return (
    <Row>
      <Col>
        <Card>
          <CardTitle tag="h6" className="border-bottom p-3 mb-0">
            <i className="bi bi-bell me-2"> </i>
            {title}
          </CardTitle>
          <CardBody>
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              <FormGroup>
                <Label for="isbn">ISBN</Label>
                <Input
                  id="isbn"
                  name="isbn"
                  disabled={title === "Edit Book"}
                  value={book.isbn}
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
                  value={book.title}
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
                  value={book.description}
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
                  value={book.publishers}
                />
              </FormGroup>
              <FormGroup>
                <Label for="category">Category</Label>
                <Input
                  id="category"
                  name="categoryId"
                  type="select"
                  value={book.categoryId}
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
                  value={book.authorIdList.map((id) => id.toString())} // Map to string since value is a string
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
                  value={book.status}
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
                  value={book.publishedDate}
                />
              </FormGroup>

              <Button className="btn" outline color="primary" type="submit">
                {title}
              </Button>
            </Form>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default BookForm;
