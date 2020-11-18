const Pool = require('pg').Pool;
const db = new Pool({
    user: 'ia5',
    host: 'database',
    database: 'testdatabase',
    password: '9$raT8*HNvyzJ@j!b^Gl8qoCIG&qu7Tj',
    port: 5432,
});

module.exports = db;