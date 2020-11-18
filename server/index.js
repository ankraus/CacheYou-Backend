const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
// const Pool = require('pg').Pool;
// const pool = new Pool({
//     user: 'ia5',
//     host: 'database',
//     database: 'testdatabase',
//     password: '9$raT8*HNvyzJ@j!b^Gl8qoCIG&qu7Tj',
//     port: 5432,
// });

const app = express();
const routes = require('./routes');

app.use(morgan('tiny'));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/', routes);

// app.get('/', (req, res) => {
//     var routes = [];
//     app._router.stack.forEach(element => {
//         if (element.route && element.route.path) {
//             routes.push(element.route.path);
//         }
//     });
//     res.json({
//         routes: routes
//     });
// })

// app.get('/users/:user_id/collections', async (req, res) => {
//     try {
//         const db_resp = await pool.query(`SELECT collection_id, public, title FROM collections WHERE user_id = $1`, [req.params.user_id]);
//         res.json({
//             collections: db_resp.rows
//         });        
//     } catch (error) {
//         res.status(500);
//         res.send('Internal Server Error');
//     }
// });

const port = 8080;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

module.exports = {
    app
}