import { useState } from "react";
import BookSearch from "./components/BookSearch";
import BookList from "./components/BookList";
import Header from "./components/Header";
import useFetchBooks from "./hooks/useFetchBooks";
import CenterdSpinner from "./components/CenteredSpinner";
import "./App.css";

const App = () => {
  const [searchParams, setSearchParams] = useState({
    searchValue: "",
    searchType: "title",
    language: "en",
    sortType: "relevance",
  });
  const { books, loading, error, success } = useFetchBooks(searchParams);

  const handleSearch = (searchValue, searchType, language, sortType) => {
    setSearchParams({ searchValue, searchType, language, sortType });
  };

  return (
    <div>
      <Header />
      <BookSearch onSearch={handleSearch} searchParams={searchParams} />
      {loading && <CenterdSpinner />}
      {error && <p>Error: {error.message}</p>}
      {success && <BookList books={books} language={searchParams.language} />}
    </div>
  );
};

export default App;
