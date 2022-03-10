/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react';
import './App.scss';
import axios from 'axios';
import Session, { useSessionContext } from 'supertokens-auth-react/recipe/session';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { Outlet } from 'react-router-dom';
import AppRoutes from './shared/components/routes/AppRoutes';
import useLogout from './hooks/useLogout';
import Login from './app-login/Login';

Session.addAxiosInterceptors(axios);

function App() {
  const { accessTokenPayload } = useSessionContext();
  const client = new ApolloClient({
    uri: 'https://supertokens.hasura.app/v1/graphql',
    cache: new InMemoryCache(),
    headers: {
      Authorization: `Bearer ${accessTokenPayload?.jwt}`,
      'Content-Type': 'application/json',
    },
  });
  useEffect(() => {
    console.log(accessTokenPayload);
  }, [accessTokenPayload]);
  const logout = useLogout();
  return (
    <div className="App">
      <ApolloProvider client={client}>
        <AppRoutes />
      </ApolloProvider>
    </div>
  );
}

export default App;
