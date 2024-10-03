import { useState } from "react";

import {
  Card,
  CardBody,
  CardImg,
  CardSubtitle,
  CardText,
  CardTitle,
  Button,
} from "reactstrap";

const Book = (book: BookProps) => {
  const [showFullDescription, setShowFullDescription] = useState(false);

  const handleToggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };
  return (
    <Card className="book-card">
      <CardImg alt="Card image cap" src={book.image} />
      <CardBody className="p-4">
        <CardTitle tag="h5">{book.title}</CardTitle>
        <CardSubtitle>
          {book.authorList.map((author) => author.name+" ")}
        </CardSubtitle>

        <CardText className="mt-3">Category : {book.category}</CardText>
        <CardText className="mt-3">{book.status}</CardText>
        <CardText className="mt-3 book-description">
          {showFullDescription
            ? book.description
            : book.description.substring(0, 50) + "..."}
        </CardText>

        <Button color={book.color} onClick={handleToggleDescription}>
          {showFullDescription ? "Show Less" : "Read More"}
        </Button>
      </CardBody>
    </Card>
  );
};
interface Author {
  id: number;
  name: string;
}
interface BookProps {
  image: string;
  title: string;
  authorList: Author[];
  category: string;
  description: string;
  status: string;
  color: string;
}

export default Book;
