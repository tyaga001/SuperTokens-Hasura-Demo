/* eslint-disable no-undef */
import { useSessionContext } from 'supertokens-auth-react/recipe/session';
import { Navigate } from 'react-router-dom';
import React from 'react';

export default function RequireAuth({ children }: {children: JSX.Element}) {
  const { doesSessionExist } = useSessionContext();
  if (doesSessionExist) {
    return children;
  }
  return <Navigate to="/auth" />;
}
