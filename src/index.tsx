import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import SuperTokens from 'supertokens-auth-react';
import Session, { SessionAuth } from 'supertokens-auth-react/recipe/session';
import { BrowserRouter } from 'react-router-dom';
import EmailPassword from 'supertokens-auth-react/recipe/emailpassword';
import { getApiDomain, getWebsiteDomain } from './utils/utils';
import App from './App';
import reportWebVitals from './reportWebVitals';

SuperTokens.init({
  appInfo: {
    appName: 'Shopping App',
    apiDomain: getApiDomain(),
    websiteDomain: getWebsiteDomain(),
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

ReactDOM.render(
  <React.StrictMode>

    <BrowserRouter>
      <SessionAuth>
        <App />
      </SessionAuth>
    </BrowserRouter>

  </React.StrictMode>,
  document.getElementById('root'),
);

reportWebVitals();
