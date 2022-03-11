import React from 'react';
import './App.scss';
import { useSessionContext } from 'supertokens-auth-react/recipe/session';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
} from '@apollo/client';
import AppRoutes from './shared/components/routes/AppRoutes';

function App() {
  const { accessTokenPayload } = useSessionContext();
  const client = new ApolloClient({
    uri: `${process.env.REACT_APP_API_GRAPHQL_URL}`,
    cache: new InMemoryCache(),
    headers: {
      Authorization: `Bearer ${accessTokenPayload?.jwt}`,
      'Content-Type': 'application/json',
    },
  });
  return (
    <div className="App">
      <ApolloProvider client={client}>
        <AppRoutes />
      </ApolloProvider>
    </div>
  );
}

export default App;
