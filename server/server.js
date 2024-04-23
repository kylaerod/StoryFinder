const express = require('express');
const path = require('path');
const { User } = require('./models');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const authMiddleware = require('./utils/auth');
const db = require('./config/connection');


// Define your schema
const typeDefs = `
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
    addUser(username: String!, email: String!, password: String!): User
    login(email: String!, password: String!): User
  }
`;

// Your resolvers
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
    hello: () => 'Hello, World!',
  },
  Mutation: {
    addUser: async (_, { username, email, password }) => {
      try {
        const user = new User({ username, email, password });
        await user.save();
        return user;
      } catch (err) {
        throw new Error('Failed to create user');
      }
    },
    login: async (_, { email, password }) => {
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

const PORT = process.env.PORT || 3001;

// Create a schema
const server = new ApolloServer({
  typeDefs,
  resolvers
});

// Create an Express server
const app = express();

const startApolloServer = async () => {
  await server.start();

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  // Use the authMiddleware middleware for all GraphQL requests
  app.use('/graphql', expressMiddleware(server, {
    context: authMiddleware
  }));

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));

    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });
  }

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
    });
  });
}

startApolloServer();

