import React from 'react';
import SuperTokens from 'supertokens-auth-react';
import EmailPassword from 'supertokens-auth-react/recipe/emailpassword';
import Session from 'supertokens-auth-react/recipe/session';
import { getApiDomain, getWebsiteDomain } from '../utils/utils';
import ProductList from '../products/product-list/ProductList';

SuperTokens.init({
  appInfo: {
    appName: 'Shopping App', // TODO: Your app name
    apiDomain: getApiDomain(), // TODO: Change to your app's API domain
    websiteDomain: getWebsiteDomain(), // TODO: Change to your app's website domain
  },
  recipeList: [
    EmailPassword.init({
      getRedirectionURL: async (context) => {
        if (context.action === 'SUCCESS') {
          return '/home';
        }
        return '/auth';
      },
      emailVerificationFeature: {
        mode: 'REQUIRED',
      },
    }),
    Session.init(),
  ],
});
export default function Login() {
  return (
    <EmailPassword.EmailPasswordAuth>
      <ProductList />
    </EmailPassword.EmailPasswordAuth>
  );
}
