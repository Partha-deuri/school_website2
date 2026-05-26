// update-db-student.js
const pool = require('./db');

async function updateDatabase() {
    let conn;
    try {
        conn = await pool.getConnection();
        console.log("Connected! Creating Student Resources table...");

        await conn.query(`
            CREATE TABLE IF NOT EXISTS student_resources (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                file_name VARCHAR(255),
                file_url TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        
        console.log("🎉 Student Resources database update complete!");
    } catch (err) {
        console.error("❌ Error:", err);
    } finally {
        if (conn) conn.release();
        process.exit(); 
    }
}
updateDatabase();