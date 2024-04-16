const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const path = require('path');
const { User } = require('./models');

// Your type definitions
const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    password: String
  }

  type Query {
    users: [User]
    user(username: String!): User
    me: User
    hello: String
  }

  type Mutation {
    createUser(username: String!, email: String!, password: String!): User
    loginUser(email: String!, password: String!): User
  }
`;

// Your resolvers
const resolvers = {
  Query: {
    // Define your resolvers here
  },
  Mutation: {
    // Define your resolvers here
  },
};

const app = express();
const PORT = process.env.PORT || 3002;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: () => ({ User }), 
});

server.start().then(() => {
  server.applyMiddleware({ app });

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());


  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));

    
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/build/index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`🌍 Now listening on localhost:${PORT}`);
  });
});
