const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const swaggerUI = require('swagger-ui-express');
const swaggerDoc = require('./swagger.json');
const getApiKey = require('./controllers/others/getapikey');
const authorizeApiKey = require('./controllers/others/authorizeApiKey');
const authRouter = require('./routers/auth');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

// check and create api keys
app.get('/getapikey', getApiKey);
app.use('/', authorizeApiKey);

// set routers
app.use('/auth', authRouter);

// swagger docs
app.use('/apidocs', swaggerUI.serve, swaggerUI.setup(swaggerDoc));

module.exports = app;
