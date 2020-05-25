import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { ApolloProvider } from '@apollo/react-hooks';
import React from 'react';
import ReactDOM from 'react-dom';
import Pages from './pages';
import injectStyles from './styles';

const cache = new InMemoryCache();

const link = new HttpLink({
  headers: { authorization: localStorage.getItem('token') },
  uri: 'http://localhost:4000/graphql',
  // uri: 'http://localhost:4000/' is ok too?
});

const client = new ApolloClient({
  cache,
  link,
});

injectStyles();

ReactDOM.render(
  <ApolloProvider client={client}>
    <Pages />
  </ApolloProvider>,
  document.getElementById('root'),
);
