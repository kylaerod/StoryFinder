const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const path = require('path');
const { typeDefs, resolvers } = require('./schema.js');
const db = require('./config/connection');
const routes = require('./routes');
const { User } = require('./models');

const app = express();
const PORT = process.env.PORT || 3001;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: () => ({ User }), // Pass the User model to the context
});

const startApolloServer = async () => {
  await server.start();

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  server.applyMiddleware({ app });

  // if we're in production, serve client/build as static assets
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
  }

  app.use(routes);

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'));
  });
};

db.once('open', () => {
  console.log('MongoDB connected');
  startApolloServer().then(() => {
    app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
  });
});
