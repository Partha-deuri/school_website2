// setup-db.js
const pool = require('./db');
require('dotenv').config();

async function initializeDatabase() {
    let conn;
    try {
        // 1. Connect to the database server
        conn = await pool.getConnection();
        console.log("Connected to MariaDB server.");

        // 2. Safely grab the database name from your .env file
        const dbName = process.env.DB_NAME || 'ghss_database';

        // 3. Create the database if it doesn't exist, and SELECT it
        await conn.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
        await conn.query(`USE \`${dbName}\``);
        console.log(`✅ Selected database: ${dbName}`);

        // 4. Create the Announcements Table
        await conn.query(`
            CREATE TABLE IF NOT EXISTS announcements (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                date DATE NOT NULL,
                content TEXT NOT NULL,
                linkUrl VARCHAR(255),
                fileName VARCHAR(255),
                isNew BOOLEAN DEFAULT FALSE,
                showOnHome BOOLEAN DEFAULT FALSE,
                showInTicker BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log("✅ Announcements table ready.");

        // 5. Create the Faculty Table
        await conn.query(`
            CREATE TABLE IF NOT EXISTS faculty (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                role VARCHAR(100) NOT NULL,
                qual VARCHAR(255) NOT NULL,
                subject VARCHAR(100) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log("✅ Faculty table ready.");

        console.log("🎉 All tables initialized successfully!");

    } catch (err) {
        console.error("❌ Error initializing database:", err);
    } finally {
        // Safely close the connection
        if (conn) conn.release();
        process.exit(); 
    }
}

initializeDatabase();