import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { ApolloClient } from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import registerServiceWorker from './registerServiceWorker';
import App from './App';
import RepoPage from './components/RepoPage';

const token = process.env.REACT_APP_GITHUB;

const httpLink = createHttpLink({
  uri: 'https://api.github.com/graphql',
});

const authLink = setContext((_, { headers }) => {
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: `Bearer ${token}`,
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <Router>
      <Switch>
        <Route exact path="/" component={App} />
        <Route path="/:owner/:name" component={RepoPage} />
      </Switch>
    </Router>
  </ApolloProvider>,
  document.getElementById('root'),
);
registerServiceWorker();
