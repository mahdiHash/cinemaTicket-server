const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const swaggerUI = require('swagger-ui-express');
const swaggerDoc = require('./swagger.json');
const getApiKey = require('./utils/middlewares/getapikey');
const authorizeApiKey = require('./utils/middlewares/authorizeApiKey');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

// check and create api keys
app.get('/getapikey', getApiKey);
app.use('/', authorizeApiKey);

// swagger docs
app.use('/apidocs', swaggerUI.serve, swaggerUI.setup(swaggerDoc));

module.exports = app;
