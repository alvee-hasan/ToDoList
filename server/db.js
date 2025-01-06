const mysql = require('mysql2');

// Create a connection pool to MySQL
const pool = mysql.createPool({
    host: 'localhost', // Host where MySQL is running
    user: 'root',
    password: '', // replace with your password
    database: 'tasks_db',
  });
  

// Export the pool to use it in other files
module.exports = pool;
