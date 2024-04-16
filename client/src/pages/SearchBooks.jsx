import React, { useState, useEffect } from 'react';
import Auth from '../utils/auth';
import { searchGoogleBooks } from '../utils/API';
import { saveBookIds, getSavedBookIds } from '../utils/localStorage';
import { useMutation, useQuery } from '@apollo/client'; // Import useQuery and useMutation
import { SAVE_BOOK, SEARCH_GOOGLE_BOOKS } from '../utils/mutations'; // Import mutations
import { GET_SAVED_BOOK_IDS } from '../utils/queries'; // Import query

const SearchBooks = () => {
  const [searchedBooks, setSearchedBooks] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [savedBookIds, setSavedBookIds] = useState(getSavedBookIds());

  const [saveBook] = useMutation(SAVE_BOOK);
  const { loading, data } = useQuery(GET_SAVED_BOOK_IDS); // Use the query

  useEffect(() => {
    return () => saveBookIds(savedBookIds);
  }, [savedBookIds]);

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }

    try {
      const response = await searchGoogleBooks(searchInput);

      if (!response.ok) {
        throw new Error('something went wrong!');
      }

      const { items } = await response.json();

      const bookData = items.map((book) => ({
        bookId: book.id,
        authors: book.volumeInfo.authors || ['No author to display'],
        title: book.volumeInfo.title,
        description: book.volumeInfo.description,
        image: book.volumeInfo.imageLinks?.thumbnail || '',
        link: book.volumeInfo.infoLink
      }));

      setSearchedBooks(bookData);
      setSearchInput('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveBook = async (bookId) => {
    const bookToSave = searchedBooks.find((book) => book.bookId === bookId);

    if (!Auth.loggedIn()) {
      return false;
    }

    try {
      await saveBook({
        variables: { book: bookToSave },
      });
      setSavedBookIds([...savedBookIds, bookToSave.bookId]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className='text-light bg-dark'>
        <div>
          <h1>Search for Books!</h1>
          <form onSubmit={handleFormSubmit}>
            <div>
              <input
                name='searchInput'
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                type='text'
                size='lg'
                placeholder='Search for a book'
              />
            </div>
            <div>
              <button type='submit' variant='success' size='lg'>
                Submit Search
              </button>
            </div>
          </form>
        </div>
      </div>

      <div>
        <h2>
          {searchedBooks.length
            ? `Viewing ${searchedBooks.length} results:`
            : 'Search for a book to begin'}
        </h2>
        <div>
          {searchedBooks.map((book) => {
            return (
              <div key={book.bookId}>
                {book.image ? (
                  <a href={book.link} target="_blank" rel="noreferrer"> 
                    <img src={book.image} alt={`The cover for ${book.title}`} /> 
                  </a>
                ) : null}
                <div>
                  <h3>{book.title}</h3>
                  <p>Authors: {book.authors}</p>
                  <p>{book.description}</p>
                  {Auth.loggedIn() && (
                    <button
                      disabled={savedBookIds?.some((savedBookId) => savedBookId === book.bookId)}
                      onClick={() => handleSaveBook(book.bookId)}>
                      {savedBookIds?.some((savedBookId) => savedBookId === book.bookId)
                        ? 'This book has already been saved!'
                        : 'Save this Book!'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default SearchBooks;
