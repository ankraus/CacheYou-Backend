const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');

const app = express();
const routes = require('./routes');

app.use(morgan('tiny'));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/', routes);

const port = 8080;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

module.exports = {
    app
}