import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import { useMutation, useQuery } from '@apollo/client';
import { me } from '../utils/queries';
import { deleteBook as deleteBookMutation } from '../utils/mutations'; // Rename deleteBook to deleteBookMutation
import Auth from '../utils/auth';

const SavedBooks = () => {
  const [userData, setUserData] = useState({});
  const { loading, data } = useQuery(me, {
    variables: { token: Auth.getToken() }
  });

  useEffect(() => {
    if (data) {
      setUserData(data.me);
    }
  }, [data]);

  const [deleteBook] = useMutation(deleteBookMutation); // Rename deleteBook to deleteBookMutation

  const handleDeleteBook = async (bookId) => {
    try {
      const { data } = await deleteBook({
        variables: { bookId }
      });
      setUserData(data.deleteBook.user);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <div fluid className="text-light bg-dark p-5">
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </div>
      <Container>
        <h2 className='pt-5'>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <Row>
          {userData.savedBooks.map((book) => {
            return (
              <Col md="4" key={book.bookId}>
                <Card border='dark'>
                  {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className='small'>Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                      Delete this Book!
                    </Button>
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

export default SavedBooks;
