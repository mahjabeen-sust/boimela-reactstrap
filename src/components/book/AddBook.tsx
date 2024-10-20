import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Alert } from "reactstrap";

import type { AppDispatch, RootState } from "../../store";
import { addNewBookThunk } from "../../features/books/booksSlice";
import BookForm from "./BookForm";
import { BookDTO } from "../../type";
import { initialBookState } from "../../utils/data";

const AddBook = () => {
  const dispatch = useDispatch<AppDispatch>();
  const categories = useSelector((state: RootState) => state.categories);
  const { error, status } = useSelector((state: RootState) => state.books);
  const [showSuccess, setShowSuccess] = useState(false); // For success alert
  const [errorMessage, setErrorMessage] = useState(""); // For error messages

  const [newBook, setNewBook] = useState<BookDTO>(initialBookState); // Use the BookDTO type
  // console.log("1st newBook", newBook);

  const handleSubmit = async () => {
    console.log("newBook inside handle submit", newBook);

    if (newBook.title && newBook.description) {
      dispatch(addNewBookThunk(newBook));
    }
  };

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
      // console.log("success adding book:");
      setShowSuccess(true); // Show the success alert
      setErrorMessage(""); // Clear any previous error messages
      // Reset form values
      setNewBook({
        title: "",
        description: "",
        categoryId: categories?.items[0]?.id,
        authorIdList: [""],
        isbn: "",
        publishers: "",
        publishedDate: "",
        status: "AVAILABLE",
      });

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
        error.message || "An error occurred while adding the book"
      );
    }
  }, [status, error]);

  return (
    <div>
      {errorMessage && <Alert color="danger">{errorMessage}</Alert>}
      {showSuccess && <Alert color="success">Book added successfully!</Alert>}
      <BookForm
        book={newBook}
        setBook={setNewBook}
        title="Add a new Book"
        handleSubmit={handleSubmit}
      />
    </div>
  );
};

export default AddBook;
