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
const dotenv = require('dotenv');

dotenv.config();

supertokens.init({
  framework: 'express',
  supertokens: {
    connectionURI: process.env.API_TOKENS_URL,
    apiKey: process.env.API_KEY,
  },
  appInfo: {
    appName: 'SuperTokens Demo App',
    apiDomain,
    websiteDomain,
  },
  recipeList: [EmailPassword.init({}), Session.init({
    jwt: {
      enable: true,
      /*
                * This is an example of a URL that ngrok generates when
                * you expose localhost to the internet
                */
      issuer: process.env.API_JWT_URL,
    },
    override: {
      functions(originalImplementation) {
        return {
          ...originalImplementation,
          async createNewSession(sessionInput) {
            const input = sessionInput;
            console.log(process.env.KEY);
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
    query: `query {  emailpassword_users(where: {user_id: {_eq: "${req.session.getUserId()}"}}) {    role  }}`,
  }, {
    headers: {
      Authorization: `Bearer ${req.session.getAccessTokenPayload().jwt}`,
    },
  });
  const currAccessTokenPayload = session.getAccessTokenPayload();
  await session.updateAccessTokenPayload(
    {
      ...currAccessTokenPayload,
      'https://hasura.io/jwt/claims': {
        'x-hasura-user-id': req.session.getUserId(),
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
