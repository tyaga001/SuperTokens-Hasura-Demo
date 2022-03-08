/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable linebreak-style */
/* eslint-disable import/no-extraneous-dependencies */
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const axios = require('axios');
const supertokens = require('supertokens-node');
const Session = require('supertokens-node/recipe/session');
const EmailPassword = require('supertokens-node/recipe/emailpassword');
const { verifySession } = require('supertokens-node/recipe/session/framework/express');
const { middleware, errorHandler } = require('supertokens-node/framework/express');

const apiPort = process.env.REACT_APP_API_PORT || 3002;
const apiDomain = process.env.REACT_APP_API_URL || `http://localhost:${apiPort}`;
const websitePort = process.env.REACT_APP_WEBSITE_PORT || 3000;
const websiteDomain = process.env.REACT_APP_WEBSITE_URL || `http://localhost:${websitePort}`;
supertokens.init({
  framework: 'express',
  supertokens: {
    connectionURI: 'https://0def13719ed411ecb83cf5e5275e2536-ap-southeast-1.aws.supertokens.io:3568',
    apiKey: 'SSugiN8EMGZv=fL33=yJbycgI7UmSd',
  },
  appInfo: {
    appName: 'SuperTokens Demo App', // TODO: Your app name
    apiDomain, // TODO: Change to your app's API domain
    websiteDomain, // TODO: Change to your app's website domain
  },
  recipeList: [EmailPassword.init({
    override: {
      functions: (originalImplementation) => ({
        ...originalImplementation,

        // we will only be overriding what happens when a user
        // clicks the sign in button.
        async signIn(input) {
          // TODO: some custom logic
          console.log(input);
          // or call the default behaviour as show below
          return originalImplementation.signIn(input);
        },
        // ...
        // TODO: override more functions
      }),
    },
  }), Session.init({
    jwt: {
      enable: true,
      /*
                * This is an example of a URL that ngrok generates when
                * you expose localhost to the internet
                */
      issuer: 'http://ec87-223-185-12-185.ngrok.io/auth',
    },
    override: {
      functions(originalImplementation) {
        return {
          ...originalImplementation,
          async createNewSession(sessionInput) {
            const input = sessionInput;
            console.log(input);
            input.accessTokenPayload = {
              ...input.accessTokenPayload,
              'https://hasura.io/jwt/claims': {
                'x-hasura-user-id': input.userId,
                'x-hasura-default-role': 'user',
                'x-hasura-allowed-roles': ['user', 'anonymous', 'admin'],
              },
            };

            return originalImplementation.createNewSession(input);
          },
        };
      },
    },
  })],
});

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    origin: websiteDomain,
    allowedHeaders: ['content-type', ...supertokens.getAllCORSHeaders()],
    methods: ['GET', 'PUT', 'POST', 'DELETE'],
    credentials: true,
  }),
);

app.use(morgan('dev'));
app.use(
  helmet({
    contentSecurityPolicy: false,
  }),
);
app.use(middleware());

app.post('/updateinfo', verifySession(), async (req, res) => {
  const { session } = req;
  const resp = await axios.post('https://e-kart.hasura.app/v1/graphql', {
    query: `query {  emailpassword_users(where: {user_id: {_eq: "${req.session.originalSessionClass.userId}"}}) {    role  }}`,
  }, {
    headers: {
      Authorization: `Bearer ${req.session.originalSessionClass.userDataInAccessToken.jwt}`,
    },
  });
  const currAccessTokenPayload = session.getAccessTokenPayload();
  await session.updateAccessTokenPayload(
    {
      ...currAccessTokenPayload,
      'https://hasura.io/jwt/claims': {
        'x-hasura-user-id': req.session.originalSessionClass.userId,
        'x-hasura-default-role': resp.data.data.emailpassword_users[0].role,
        'x-hasura-allowed-roles': ['user', 'anonymous', 'admin'],
      },
    },
  );

  res.json({ message: 'successfully updated access token payload' });
});

app.use(errorHandler());

app.use((err, req, res, next) => {
  res.status(500).send(`Internal error: ${err.message}`);
});

app.listen(apiPort, () => console.log(`API Server listening on port ${apiPort}`));
