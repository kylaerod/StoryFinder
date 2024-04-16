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

const resolvers = {
  Query: {
    users: async () => {
      try {
        return await User.find();
      } catch (err) {
        throw new Error('Failed to fetch users');
      }
    },
    user: async (_, { username }) => {
      try {
        return await User.findOne({ username });
      } catch (err) {
        throw new Error('Failed to fetch user');
      }
    },
    me: async (_, __, context) => {
      if (!context.user) {
        throw new Error('Authentication required');
      }
      return context.user;
    },
    hello: () => 'Hello, world!',
  },
  Mutation: {
    createUser: async (_, { username, email, password }) => {
      try {
        const user = new User({ username, email, password });
        await user.save();
        return user;
      } catch (err) {
        throw new Error('Failed to create user');
      }
    },
    loginUser: async (_, { email, password }) => {
      try {
        const user = await User.findOne({ email });
        if (!user || !user.comparePassword(password)) {
          throw new Error('Invalid credentials');
        }
        return user;
      } catch (err) {
        throw new Error('Failed to log in');
      }
    },
  },
};

const app = express();
const PORT = process.env.PORT || 3000;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: () => ({ User }), 
});

server.start().then(async () => {
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
  }

  await server.applyMiddleware({ app });

  app.listen(PORT, () => {
    console.log(`🌍 Now listening on localhost:${PORT}`);
  });
});