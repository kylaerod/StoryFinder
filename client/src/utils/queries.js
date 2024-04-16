import { gql } from '@apollo/client';

export const QUERY_USER = gql`
  query user($username: String!) {
    user(username: $username) {
      _id
      username
      email
    }
  }
`;

export const QUERY_ME = gql`
  query me {
    me {
      _id
      username
      email
    }
  }
`;

export const me = gql`
  query me {
    me {
      _id
      username
      email
      savedBooks {
        bookId
        authors
        description
        title
        image
        link
      }
    }
  }
`;

export const GET_SAVED_BOOK_IDS = gql`
  query getSavedBookIds {
    me {
      savedBooks {
        bookId
      }
    }
  }
`;
export const saveBookIds = gql`
  mutation saveBookIds($bookIds: [String]!) {
    saveBookIds(bookIds: $bookIds) {
      _id
      username
      email
      savedBooks {
        bookId
      }
    }
  }
`;