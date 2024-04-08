import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { createHttpLink } from '@apollo/client/link/http';
import { InMemoryCache } from '@apollo/client/cache';
import { ApolloClient } from '@apollo/client/core';

const httpLink = createHttpLink({
  uri: 'http://localhost:3000/graphql',
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

const MainApp = () => (
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  );
  
  export default MainApp;