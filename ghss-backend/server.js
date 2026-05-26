// server.js

const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken');
const express = require('express');
const cors = require('cors');
const pool = require('./db'); 
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
const multer = require('multer');
const cloudinary = require('cloudinary').v2;

// ==========================================
// JWT BOUNCER (MIDDLEWARE)
// ==========================================
const authenticateToken = (req, res, next) => {
    // Look for the token in the headers: "Authorization: Bearer <token>"
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: "Access Denied. No token provided." });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: "Invalid or expired token." });
        req.user = user;
        next(); // Token is good, let them pass!
    });
};

// ==========================================
// FILE UPLOAD CONFIGURATION
// ==========================================
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const upload = multer({ storage: multer.memoryStorage() });

// The Upload Route - PROTECTED
app.post('/api/upload', authenticateToken, upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    const originalName = req.file.originalname;
    const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.'));
    const safeName = nameWithoutExt.replace(/\s+/g, '_'); 

    const uploadStream = cloudinary.uploader.upload_stream(
        { 
            folder: 'ghss_uploads', 
            resource_type: 'auto',
            public_id: `${Date.now()}-${safeName}`,
            use_filename: true 
        },
        (error, result) => {
            if (error) {
                console.error("Cloudinary Error:", error);
                return res.status(500).json({ error: "Failed to upload to Cloudinary" });
            }
            
            res.json({ 
                fileUrl: result.secure_url,
                originalName: originalName 
            });
        }
    );

    uploadStream.end(req.file.buffer);
});


// ==========================================
// ANNOUNCEMENTS API ROUTES
// ==========================================

app.get('/api/', (req, res) => {
    res.send('GHSS API is running and ready for database queries!');
});

// 1. GET ALL ANNOUNCEMENTS (PUBLIC - Read from Database)
app.get('/api/announcements', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query("SELECT * FROM announcements ORDER BY date DESC");
        res.json(rows);
    } catch (err) {
        console.error("Database Error: ", err);
        res.status(500).json({ error: "Failed to fetch announcements" });
    } finally {
        if (conn) conn.release(); 
    }
});

// 2. CREATE NEW ANNOUNCEMENT - PROTECTED
app.post('/api/announcements', authenticateToken, async (req, res) => {
    let conn;
    try {
        const { title, date, content, linkUrl, fileName, fileUrl, isNew, showOnHome, showInTicker } = req.body;
        conn = await pool.getConnection();
        const result = await conn.query(
            `INSERT INTO announcements 
            (title, date, content, linkUrl, fileName, fileUrl, isNew, showOnHome, showInTicker) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [title, date, content, linkUrl, fileName || null, fileUrl || null, isNew, showOnHome, showInTicker]
        );
        res.status(201).json({ message: "Announcement published!", insertId: result.insertId.toString() });
    } catch (err) {
        console.error("Database Error: ", err);
        res.status(500).json({ error: "Failed to create announcement" });
    } finally {
        if (conn) conn.release();
    }
});

// 3. UPDATE ANNOUNCEMENT - PROTECTED
app.put('/api/announcements/:id', authenticateToken, async (req, res) => {
    let conn;
    try {
        const { id } = req.params;
        const { title, date, content, linkUrl, fileName, fileUrl, isNew, showOnHome, showInTicker } = req.body;
        conn = await pool.getConnection();
        
        await conn.query(
            `UPDATE announcements 
            SET title = ?, date = ?, content = ?, linkUrl = ?, fileName = ?, fileUrl = ?, isNew = ?, showOnHome = ?, showInTicker = ? 
            WHERE id = ?`,
            [title, date, content, linkUrl, fileName || null, fileUrl || null, isNew, showOnHome, showInTicker, id]
        );
        res.json({ message: "Announcement updated successfully" });
    } catch (err) {
        console.error("Database Error: ", err);
        res.status(500).json({ error: "Failed to update announcement" });
    } finally {
        if (conn) conn.release();
    }
});

// 4. DELETE ANNOUNCEMENT - PROTECTED
app.delete('/api/announcements/:id', authenticateToken, async (req, res) => {
    let conn;
    try {
        const { id } = req.params;
        conn = await pool.getConnection();
        await conn.query("DELETE FROM announcements WHERE id = ?", [id]);
        res.json({ message: "Announcement deleted successfully" });
    } catch (err) {
        console.error("Database Error: ", err);
        res.status(500).json({ error: "Failed to delete announcement" });
    } finally {
        if (conn) conn.release();
    }
});


// ==========================================
// FACULTY API ROUTES
// ==========================================

// 1. GET ALL FACULTY (PUBLIC)
app.get('/api/faculty', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query("SELECT * FROM faculty ORDER BY created_at ASC");
        res.json(rows);
    } catch (err) {
        console.error("Database Error: ", err);
        res.status(500).json({ error: "Failed to fetch faculty" });
    } finally {
        if (conn) conn.release();
    }
});

// 2. CREATE NEW FACULTY - PROTECTED
app.post('/api/faculty', authenticateToken, async (req, res) => {
    let conn;
    try {
        const { name, role, qual, subject, classTaught } = req.body;
        conn = await pool.getConnection();
        const result = await conn.query(
            "INSERT INTO faculty (name, role, qual, subject, classTaught) VALUES (?, ?, ?, ?, ?)",
            [name, role, qual, subject || null, classTaught || null] 
        );
        res.status(201).json({ message: "Faculty added!", insertId: result.insertId.toString() });
    } catch (err) {
        console.error("Database Error: ", err);
        res.status(500).json({ error: "Failed to add faculty" });
    } finally {
        if (conn) conn.release();
    }
});

// 3. UPDATE FACULTY - PROTECTED
app.put('/api/faculty/:id', authenticateToken, async (req, res) => {
    let conn;
    try {
        const { id } = req.params;
        const { name, role, qual, subject, classTaught } = req.body;
        conn = await pool.getConnection();
        await conn.query(
            "UPDATE faculty SET name = ?, role = ?, qual = ?, subject = ?, classTaught = ? WHERE id = ?",
            [name, role, qual, subject || null, classTaught || null, id]
        );
        res.json({ message: "Faculty updated successfully" });
    } catch (err) {
        console.error("Database Error: ", err);
        res.status(500).json({ error: "Failed to update faculty" });
    } finally {
        if (conn) conn.release();
    }
});

// 4. DELETE FACULTY - PROTECTED
app.delete('/api/faculty/:id', authenticateToken, async (req, res) => {
    let conn;
    try {
        const { id } = req.params;
        conn = await pool.getConnection();
        await conn.query("DELETE FROM faculty WHERE id = ?", [id]);
        res.json({ message: "Faculty deleted successfully" });
    } catch (err) {
        console.error("Database Error: ", err);
        res.status(500).json({ error: "Failed to delete faculty" });
    } finally {
        if (conn) conn.release();
    }
});


// ==========================================
// MANDATORY DISCLOSURE API ROUTES
// ==========================================

// GET DISCLOSURE (PUBLIC)
app.get('/api/disclosure', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query("SELECT * FROM mandatory_disclosure WHERE id = 1");
        
        if (rows.length > 0) {
            const data = rows[0];
            res.json({
                generalData: data.general_data ? JSON.parse(data.general_data) : null,
                docsData: data.docs_data ? JSON.parse(data.docs_data) : null,
                academicDocs: data.academic_docs ? JSON.parse(data.academic_docs) : null,
                classXResults: data.class_x_results ? JSON.parse(data.class_x_results) : null,
                classXIIResults: data.class_xii_results ? JSON.parse(data.class_xii_results) : null,
                staffData: data.staff_data ? JSON.parse(data.staff_data) : null,
                infraData: data.infra_data ? JSON.parse(data.infra_data) : null
            });
        } else {
            res.json({});
        }
    } catch (err) {
        console.error("Database Error: ", err);
        res.status(500).json({ error: "Failed to fetch disclosure data" });
    } finally {
        if (conn) conn.release();
    }
});

// UPDATE DISCLOSURE - PROTECTED
app.put('/api/disclosure', authenticateToken, async (req, res) => {
    let conn;
    try {
        const { generalData, docsData, academicDocs, classXResults, classXIIResults, staffData, infraData } = req.body;
        conn = await pool.getConnection();
        
        await conn.query(`
            UPDATE mandatory_disclosure SET 
                general_data = ?, docs_data = ?, academic_docs = ?, 
                class_x_results = ?, class_xii_results = ?, staff_data = ?, infra_data = ?
            WHERE id = 1
        `, [
            JSON.stringify(generalData), JSON.stringify(docsData), JSON.stringify(academicDocs),
            JSON.stringify(classXResults), JSON.stringify(classXIIResults), JSON.stringify(staffData), JSON.stringify(infraData)
        ]);
        
        res.json({ message: "Mandatory Disclosure updated successfully!" });
    } catch (err) {
        console.error("Database Error: ", err);
        res.status(500).json({ error: "Failed to update disclosure data" });
    } finally {
        if (conn) conn.release();
    }
});


// ==========================================
// SITE SETTINGS API ROUTES
// ==========================================

// GET SETTINGS (PUBLIC)
app.get('/api/settings', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query("SELECT * FROM site_settings WHERE id = 1");
        
        if (rows.length > 0) {
            const data = rows[0];
            res.json({
                generalData: data.general_data ? JSON.parse(data.general_data) : null,
                socialData: data.social_data ? JSON.parse(data.social_data) : null,
                brandingData: data.branding_data ? JSON.parse(data.branding_data) : null
            });
        } else {
            res.json({});
        }
    } catch (err) {
        console.error("Database Error: ", err);
        res.status(500).json({ error: "Failed to fetch settings" });
    } finally {
        if (conn) conn.release();
    }
});

// UPDATE SETTINGS - PROTECTED
app.put('/api/settings', authenticateToken, async (req, res) => {
    let conn;
    try {
        const { generalData, socialData, brandingData } = req.body;
        conn = await pool.getConnection();
        
        await conn.query(`
            UPDATE site_settings SET 
                general_data = ?, social_data = ?, branding_data = ?
            WHERE id = 1
        `, [
            JSON.stringify(generalData), 
            JSON.stringify(socialData), 
            JSON.stringify(brandingData)
        ]);
        
        res.json({ message: "Site settings updated successfully!" });
    } catch (err) {
        console.error("Database Error: ", err);
        res.status(500).json({ error: "Failed to update settings" });
    } finally {
        if (conn) conn.release();
    }
});



// ==========================================
// SECURITY API ROUTES
// ==========================================

// UPDATE PASSWORD - PROTECTED
app.put('/api/security/change-password', authenticateToken, async (req, res) => {
    let conn;
    try {
        const { currentPassword, newPassword } = req.body;
        conn = await pool.getConnection();
        
        const users = await conn.query("SELECT * FROM admin_users WHERE id = 1");
        if (users.length === 0) {
            return res.status(404).json({ error: "Admin user not found" });
        }
        
        const admin = users[0];

        const isMatch = await bcrypt.compare(currentPassword, admin.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Incorrect current password." });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedNewPassword = await bcrypt.hash(newPassword, salt);

        await conn.query("UPDATE admin_users SET password = ? WHERE id = 1", [hashedNewPassword]);

        res.json({ message: "Password updated successfully!" });
    } catch (err) {
        console.error("Database Error: ", err);
        res.status(500).json({ error: "Failed to change password" });
    } finally {
        if (conn) conn.release();
    }
});

// ==========================================
// AUTHENTICATION ROUTES
// ==========================================

// LOGIN - PUBLIC (Obviously, you need to be able to log in without a token!)
app.post('/api/auth/login', async (req, res) => {
    let conn;
    try {
        const { username, password } = req.body;
        conn = await pool.getConnection();
        
        const users = await conn.query("SELECT * FROM admin_users WHERE username = ?", [username]);
        if (users.length === 0) {
            return res.status(401).json({ error: "Invalid username or password" });
        }
        
        const admin = users[0];

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid username or password" });
        }

        const token = jwt.sign(
            { id: admin.id, username: admin.username }, 
            process.env.JWT_SECRET, 
            { expiresIn: '24h' }
        );

        res.json({ message: "Login successful", token });
    } catch (err) {
        console.error("Login Error: ", err);
        res.status(500).json({ error: "Server error during login" });
    } finally {
        if (conn) conn.release();
    }
});

// ==========================================
// STUDENT CORNER API ROUTES
// ==========================================

// 1. GET ALL RESOURCES (PUBLIC)
app.get('/api/student-resources', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query("SELECT * FROM student_resources ORDER BY created_at DESC");
        res.json(rows);
    } catch (err) {
        console.error("Database Error: ", err);
        res.status(500).json({ error: "Failed to fetch student resources" });
    } finally {
        if (conn) conn.release();
    }
});

// 2. CREATE NEW RESOURCE - PROTECTED
app.post('/api/student-resources', authenticateToken, async (req, res) => {
    let conn;
    try {
        const { title, description, fileName, fileUrl } = req.body;
        conn = await pool.getConnection();
        const result = await conn.query(
            "INSERT INTO student_resources (title, description, file_name, file_url) VALUES (?, ?, ?, ?)",
            [title, description || null, fileName || null, fileUrl || null]
        );
        res.status(201).json({ message: "Resource added!", insertId: result.insertId.toString() });
    } catch (err) {
        console.error("Database Error: ", err);
        res.status(500).json({ error: "Failed to add student resource" });
    } finally {
        if (conn) conn.release();
    }
});

// 3. UPDATE RESOURCE - PROTECTED
app.put('/api/student-resources/:id', authenticateToken, async (req, res) => {
    let conn;
    try {
        const { id } = req.params;
        const { title, description, fileName, fileUrl } = req.body;
        conn = await pool.getConnection();
        await conn.query(
            "UPDATE student_resources SET title = ?, description = ?, file_name = ?, file_url = ? WHERE id = ?",
            [title, description || null, fileName || null, fileUrl || null, id]
        );
        res.json({ message: "Resource updated successfully" });
    } catch (err) {
        console.error("Database Error: ", err);
        res.status(500).json({ error: "Failed to update resource" });
    } finally {
        if (conn) conn.release();
    }
});

// 4. DELETE RESOURCE - PROTECTED
app.delete('/api/student-resources/:id', authenticateToken, async (req, res) => {
    let conn;
    try {
        const { id } = req.params;
        conn = await pool.getConnection();
        await conn.query("DELETE FROM student_resources WHERE id = ?", [id]);
        res.json({ message: "Resource deleted successfully" });
    } catch (err) {
        console.error("Database Error: ", err);
        res.status(500).json({ error: "Failed to delete resource" });
    } finally {
        if (conn) conn.release();
    }
});


// ==========================================
// START THE SERVER
// ==========================================
app.listen(PORT, () => {
    console.log(`Server connected and running on http://localhost:${PORT}`);
});