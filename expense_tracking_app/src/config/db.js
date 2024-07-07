const mysql = require('mysql2');
require('dotenv').config();
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.PROD_DB_PORT,
    multipleStatements: true
})
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});
exports.query = (sql, args) => {
    return new Promise((resolve, reject) => {
        db.query(sql, args, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}
