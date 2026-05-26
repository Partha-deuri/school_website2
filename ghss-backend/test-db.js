require('dotenv').config();
const mariadb = require('mariadb');
const fs = require('fs');

// 1. Create a connection pool (better for performance than a single connection)
const pool = mariadb.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  // 2. SSL is REQUIRED for SkySQL. We read the certificate file here.
  ssl: {
    ca: fs.readFileSync(process.env.DB_SSL_CERT_PATH, 'utf8')
  },
  connectionLimit: 5
});

async function testConnection() {
  let conn;
  try {
    // 3. Request a connection from the pool
    conn = await pool.getConnection();
    console.log("✅ Successfully connected to MariaDB SkySQL!");

    // 4. Run a simple test query
    const rows = await conn.query("SELECT VERSION()");
    console.log("📊 Database Version:", rows[0]['VERSION()']);

  } catch (err) {
    console.error("❌ Connection failed:", err);
  } finally {
    // 5. Always release the connection back to the pool
    if (conn) conn.release();
    
    // End the pool so the Node script can exit
    pool.end(); 
  }
}

testConnection();