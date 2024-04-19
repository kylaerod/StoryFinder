const express = require('express');
const { gql } = require('apollo-server-express');
const { ApolloServer } = require('@apollo/server');
const path = require('path');
const { User } = require('./models');
const userRouter = require('./routes/api/users');
const { expressMiddleware } = require('@apollo/server/express4');
const db = require('./config/connection');
const { authMiddleware } = require('./utils/auth');


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

const app = express();
const PORT = process.env.PORT || 3001;

// Serve the static files from the React app
// app.use(express.static(path.join(__dirname, '../client/build')));

const server = new ApolloServer({
  typeDefs,
  resolvers,
});
const startApolloServer = async () => {
  await server.start();
  
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  
  app.use('/graphql', expressMiddleware(server, {
    context: authMiddleware
  }));
  // if we're in production, serve client/dist as static assets
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
};

startApolloServer();

// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

// // app.use('/api/users', userRouter);

// // Handle all other routes by serving the React app
// app.use(express.static(path.join(__dirname, '../client/dist')));

// // Define a route for the homepage
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, '../client/dist/index.html'));
// });

// server/server.js
// server.start().then(async () => {
//   await server.applyMiddleware({ app });

//   app.listen(PORT, () => {
//     console.log(`🌍 Now listening on localhost:${PORT}`);
//   });
// });
