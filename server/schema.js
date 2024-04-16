// your-schema-file.js
const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID!
    username: String!
    email: String!
    savedBooks: [Book]
  }

  type Book {
    _id: ID!
    authors: [String]
    description: String
    bookId: String
    image: String
    link: String
    title: String
  }

  type Query {
    hello: String
  }

  type Mutation {
    addUser(username: String, email: String, pasword: String): User
  }
`;

const resolvers = {
  Query: {
    hello: () => 'Hello, world!',
  },
};

module.exports = { typeDefs, resolvers };
