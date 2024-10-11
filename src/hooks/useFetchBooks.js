import { useState, useEffect } from "react";

const useFetchBooks = (searchParams) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!searchParams.searchValue) {
      setBooks([]);
      return;
    }

    const fetchBooks = async () => {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const baseUrl = "https://www.googleapis.com/books/v1/volumes";
      const key = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;
      const { searchValue, searchType, language, sortType } = searchParams;

      const createQueryParam = () => {
        const normalizedValue = searchValue.replace(/\./g, "").replace(/\s+/g, " ").trim();
        const parts = normalizedValue.split(" ");
    
        if (searchType === "title") {
            return `intitle:"${searchValue}"`;
        } else if (searchType === "author") {
            let queries = [];
    
            // Generate queries for each part (individual words)
            parts.forEach(part => {
                queries.push(`inauthor:"${part}"`);
            });
    
            // Combine parts for a full name search
            const combinedQuery = parts.join(" ");
            queries.push(`inauthor:"${combinedQuery}"`);
            queries.push(`inauthor:"${normalizedValue}"`);
    
            // Create a version that keeps initials separate
            const withInitials = parts.map(part => `inauthor:"${part}*"`).join(' AND ');
            queries.push(withInitials);
    
            // Join all queries with OR
            return queries.join(' OR ');
        } else if (searchType === "subject") {
            return `subject:"${searchValue}"`;
        }
        return '';
    };
    

      const queryParam = createQueryParam();

      try {
        const response = await fetch(
          `${baseUrl}?q=${queryParam}&maxResults=40&langRestrict=${language}&printType=books&orderBy=${sortType}&fields=items(id,volumeInfo(title,authors,language,description,imageLinks,canonicalVolumeLink,categories,publishedDate,publisher,pageCount,averageRating))&key=${key}`
        );

        const data = await response.json();
        console.log(data);
        const uniqueBooks = data.items?.filter((item, index, self) =>
          index === self.findIndex(t => t.volumeInfo.title === item.volumeInfo.title)
        ) || [];

        if (searchParams.sortType === "newest") {
          uniqueBooks.sort((a, b) => new Date(b.volumeInfo.publishedDate) - new Date(a.volumeInfo.publishedDate));
        }

        setBooks(uniqueBooks);
        setSuccess(true);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [searchParams]);

  return { books, loading, error, success };
};

export default useFetchBooks;
