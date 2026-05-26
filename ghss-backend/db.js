// db.js
const mariadb = require('mariadb');
require('dotenv').config();
const fs = require('fs');

// Create a connection pool

const pool = mariadb.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  dateStrings: true,
  // 2. SSL is REQUIRED for SkySQL. We read the certificate file here.
  ssl: {
    ca: fs.readFileSync(process.env.DB_SSL_CERT_PATH, 'utf8')
  },
  connectionLimit: 5,
 // Closes idle connections after 30 seconds
  idleTimeout: 30,
    
    // THIS IS THE FIX: It must be "connectionTimeout"
    connectionTimeout: 10000
});

// Export the pool so we can use it in our server.js routes
module.exports = pool;