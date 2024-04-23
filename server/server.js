(function () {
  const express = require('express');
  const { User } = require('./models');
  const { ApolloServer } = require('@apollo/server');
  const { expressMiddleware } = require('@apollo/server/express4');
  const authMiddleware = require('./utils/auth');
  const db = require('./config/connection');
  const path = require('path');

  // Define your schema, resolvers, and other code here...

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
})();
