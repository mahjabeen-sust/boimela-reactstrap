import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Alert } from "reactstrap";

import type { AppDispatch, RootState } from "../../store";
import { editBookThunk } from "../../features/books/booksSlice";
import BookForm from "./BookForm";
import { Book, BookDTO } from "../../type";

const EditBook = (props: Book) => {
  const authorIdList = props.authorList.map((author) => author.id);
  const dispatch = useDispatch<AppDispatch>();
  const { error, status } = useSelector((state: RootState) => state.books);
  const [showSuccess, setShowSuccess] = useState(false); // For success alert
  const [errorMessage, setErrorMessage] = useState(""); // For error messages

  //setting values for book
  const [newBook, setNewBook] = useState<BookDTO>({
    isbn: props.isbn,
    title: props.title,
    description: props.description,
    publishers: props.publishers,
    categoryId: props.category.id,
    authorIdList: authorIdList,
    status: props.status,
    publishedDate: props.publishedDate,

    //publishedDate: formatTheDate(props.publishedDate)
  });

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
      publishedDate: props.publishedDate,

      //publishedDate: formatTheDate(props.publishedDate)
    }));
  }

  const handleSubmit = () => {
    // Logic for editing the book
    console.log("Editing book:", newBook);
    if (newBook.title && newBook.description) {
      dispatch(editBookThunk(newBook));
      //console.log('book to be edited: ', newBook)
    }
  };

  useEffect(() => {
    if (status === 200) {
      // console.log("success adding book:");
      setShowSuccess(true); // Show the success alert
      setErrorMessage(""); // Clear any previous error messages
      // Reset form values

      // Delay to hide the success alert
      const timeout = setTimeout(() => {
        setShowSuccess(false); // Hide success alert
      }, 5000);

      // Reset status after showing success message
      const resetStatusTimeout = setTimeout(() => {
        dispatch({ type: "books/resetStatus" }); // Reset status in Redux store
      }, 5000); // Adjust the time according to your needs

      return () => {
        clearTimeout(timeout); // Cleanup timeout for the success alert
        clearTimeout(resetStatusTimeout); // Cleanup for status reset
      };
    }
    if (error) {
      // console.error("Failed to add the book:", error);
      setShowSuccess(false);
      setErrorMessage(
        error.message || "An error occurred while editing the book"
      );
    }
  }, [status, error]);

  return (
    <div>
      {errorMessage && <Alert color="danger">{errorMessage}</Alert>}
      {showSuccess && <Alert color="success">Book updated successfully!</Alert>}
      <BookForm
        book={newBook}
        setBook={setNewBook}
        title="Edit Book"
        handleSubmit={handleSubmit}
      />
    </div>
  );
};

export default EditBook;
