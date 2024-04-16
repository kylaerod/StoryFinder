import React, { useState } from 'react';
import { Container, Col, Form, Button, Card, Row } from 'react-bootstrap';
import Auth from '../utils/auth';
import { useQuery, useApolloClient } from '@apollo/client';
import { GET_SAVED_BOOK_IDS } from '../utils/queries';
import { SEARCH_GOOGLE_BOOKS } from '../utils/mutations';

const SearchBooks = () => {
  const [searchedBooks, setSearchedBooks] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const client = useApolloClient();
  const { loading, error, data } = useQuery(GET_SAVED_BOOK_IDS);
  const [savedBookIds, setSavedBookIds] = useState(() => {
    if (data) {
      return data.me.savedBooks.map((book) => book.bookId);
    }
    return [];
  });

const handleFormSubmit = async (event) => {
  event.preventDefault();

  if (!searchInput) {
    return false;
  }

  try {
    const { data } = await client.query({
      query: SEARCH_GOOGLE_BOOKS,
      variables: { searchInput: searchInput }, // Ensure variable name matches the query
    });

    const { searchGoogleBooks } = data;

    const bookData = searchGoogleBooks.map((book) => ({
      bookId: book.bookId,
      authors: book.authors || ['No author to display'],
      title: book.title,
      description: book.description,
      image: book.image || '',
    }));

    setSearchedBooks(bookData);
    setSearchInput('');
  } catch (err) {
    console.error(err);
  }
};


  const handleSaveBook = async (bookId) => {
    // Implement handleSaveBook logic
  };

  return (
    <>
      <div className="text-light bg-dark p-5">
        <Container>
          <h1>Search for Books!</h1>
          <Form onSubmit={handleFormSubmit}>
            <Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name='searchInput'
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type='text'
                  size='lg'
                  placeholder='Search for a book'
                />
              </Col>
              <Col xs={12} md={4}>
                <Button type='submit' variant='success' size='lg'>
                  Submit Search
                </Button>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>

      <Container>
        <h2 className='pt-5'>
          {searchedBooks.length
            ? `Viewing ${searchedBooks.length} results:`
            : 'Search for a book to begin'}
        </h2>
        <Row>
          {searchedBooks.map((book) => {
            return (
              <Col md="4" key={book.bookId}>
                <Card border='dark'>
                  {book.image ? (
                    <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' />
                  ) : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className='small'>Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    {Auth.loggedIn() && (
                      <Button
                        disabled={savedBookIds?.some((savedBookId) => savedBookId === book.bookId)}
                        className='btn-block btn-info'
                        onClick={() => handleSaveBook(book.bookId)}>
                        {savedBookIds?.some((savedBookId) => savedBookId === book.bookId)
                          ? 'This book has already been saved!'
                          : 'Save this Book!'}
                      </Button>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SearchBooks;
