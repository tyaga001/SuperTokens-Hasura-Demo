/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable global-require */
import React from 'react';
import {
  Routes,
  Route,
  Outlet,
} from 'react-router-dom';
import { getSuperTokensRoutesForReactRouterDom } from 'supertokens-auth-react';
import { SessionAuth } from 'supertokens-auth-react/recipe/session';
import Login from '../../../app-login/Login';
import ProductList from '../../../products/product-list/ProductList';
import Navbar from '../navbar/Navbar';
import RequireAuth from './RequireAuth';
import ToastProvider from '../../providers/toast-provider/ToastProvider';
import ProductDetails from '../../../products/product-details/ProductDetails';
import CartList from '../../../cart/cart-list/CartList';

function WithNav() {
  // const logout = useLogout();

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

function WithoutNav() {
  return (
    <Outlet />
  );
}

function WithSession({ children }: {children: JSX.Element}) {
  return (
    <SessionAuth>
      <RequireAuth>{children}</RequireAuth>
    </SessionAuth>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      {getSuperTokensRoutesForReactRouterDom(require('react-router-dom'))}
      <Route element={<WithoutNav />}>
        <Route path="/" element={<Login />} />
      </Route>
      <Route element={<WithNav />}>
        <Route path="/home" element={<WithSession><ToastProvider><ProductList /></ToastProvider></WithSession>} />
        <Route path="/product/:pid" element={<WithSession><ToastProvider><ProductDetails /></ToastProvider></WithSession>} />
        <Route path="/cart" element={<WithSession><ToastProvider><CartList /></ToastProvider></WithSession>} />
      </Route>
    </Routes>
  );
}
