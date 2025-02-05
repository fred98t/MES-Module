import { ApolloClient, InMemoryCache } from '@apollo/client/core';
import { createHttpLink } from '@apollo/client/core';


const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql',
});

const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  credentials: 'include',
});

export default apolloClient;
