const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
const routes = require('./routes');

const corsOptions = {
    origin: 'http://localhost:8100',
    credentials: true
}


app.use(morgan('tiny'));
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use('/', routes);

const port = 8080;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

module.exports = {
    app
}
