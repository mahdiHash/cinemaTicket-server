import express = require('express');
import cookieParser = require('cookie-parser');
import cors = require('cors');
import { createNotFoundErr, errorHandler } from './helpers/errors';
import swaggerUI = require('swagger-ui-express');
import swaggerDocFile = require( '../swagger.json');
import getApiKey from './controllers/apikey/getapikey.js';
import { passport } from './config';
import { authorizeApiKey, middlewareWrapper } from './middlewares';
import {
  authRouter,
  userRouter,
  imgRouter,
  adminRouter,
  placeRouter,
  celebrityRouter,
  playRouter,
} from './routers';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(cors({
    origin: process.env.ENV === 'dev' ? 'http://localhost:3000' : 'domain.com',
    optionsSuccessStatus: 200,
    credentials: true,
}));

passport.initialize();

// swagger docs
app.use('/apidocs', swaggerUI.serve, swaggerUI.setup(swaggerDocFile));

// check and create api keys
app.get('/getapikey', getApiKey);
app.use(middlewareWrapper(authorizeApiKey));

// set routers
app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/img', imgRouter);
app.use('/admin', adminRouter);
app.use('/place', placeRouter);
app.use('/celebrity', celebrityRouter);
app.use('/play', playRouter);

/*
  if the route is not found, create a 404 error
  if there's an error, pass it to errorHandler
*/
app.use('/', createNotFoundErr);
app.use('/', errorHandler);

export default app;
