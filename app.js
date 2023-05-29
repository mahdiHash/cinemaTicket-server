const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const errHandler = require('./utils/errors/errorHandler');
const createNotFoundErr = require('./utils/errors/createNotFoundErr');
const swaggerUI = require('swagger-ui-express');
const swaggerDoc = require('./swagger.json');
const getApiKey = require('./controllers/others/getapikey');
const authorizeApiKey = require('./controllers/others/authorizeApiKey');
const authRouter = require('./routers/auth');
const userRouter = require('./routers/user');
const imgRouter = require('./routers/img');
const adminRouter = require('./routers/admin');
const placeRouter = require('./routers/place');
const celebrityRouter = require('./routers/celebrity');
const passport = require('./config/passportConfig');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(cors());

passport.initialize();

// swagger docs
app.use('/apidocs', swaggerUI.serve, swaggerUI.setup(swaggerDoc));

// create api keys
app.get('/getapikey', getApiKey);

// access image route without checking apikey
app.use('/img', imgRouter);

// check client's api key
app.use('/', authorizeApiKey);

// set routers
app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/admin', adminRouter);
app.use('/place', placeRouter);
app.use('/celebrity', celebrityRouter);

// if the route is not found, create a 404 error
// if there's an error, pass it to errorHandler
app.use('/', createNotFoundErr);
app.use('/', errHandler);

module.exports = app;
