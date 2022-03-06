const Pool = require("pg").Pool;

const pool = new Pool({
    user: "postgres",
    password: "11122001",
    host: "localhost",
    port: 5432,
    database: "quanlynhavanhoa-6"
});

module.exports = pool;