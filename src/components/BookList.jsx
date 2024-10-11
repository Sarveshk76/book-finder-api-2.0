import { useState } from "react";
import Box from "@mui/material/Box";
import BookItem from "./BookItem";
import Paginate from "./Paginate";

const BookList = ({ books, language }) => {
  console.log(books, language);
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 10;
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  return (
    <>
      <Box
        className="data-wrapper"
        sx={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        {currentBooks.map((book, index) => (
          book.volumeInfo.language === language && <BookItem key={book.id || index} book={book} />
        ))}
      </Box>
      <Box
        className="pagination-wrapper"
        sx={{ display: "flex", justifyContent: "center" }}
      >
        <Paginate
          booksPerPage={booksPerPage}
          totalBooks={books.length}
          paginate={paginate}
        />
      </Box>
    </>
  );
};

export default BookList;
