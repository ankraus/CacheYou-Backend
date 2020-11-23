const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
const routes = require('./routes');
const {errorUtils} = require('./utils');

const whitelist = ['http://localhost:8100', 'http://127.0.0.1:8100'];
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || whitelist.indexOf(origin) !== -1) {
          callback(null, true)
        } else {
          callback(new Error('Not allowed by CORS'))
        }
      },
    credentials: true
}

app.use(morgan('tiny'));
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use('/', routes);

app.use(errorUtils.errorLogger);
app.use(errorUtils.authenticationErrorHandler);
app.use(errorUtils.validationErrorHandler);
app.use(errorUtils.generalErrorHandler);

const port = 8080;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

module.exports = {
    app
}
