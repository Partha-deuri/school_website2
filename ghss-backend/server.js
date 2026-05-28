// server.js
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Import DB and Models
const connectDB = require('./db');
const { 
    Admin, 
    Announcement, 
    Faculty, 
    StudentResource,  
    SiteSettings,
    Facility, 
    MandatoryDisclosure 
} = require('./models/Models');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '12h';

// Connect to MongoDB Atlas
connectDB();

app.use(cors());
app.use(express.json());

// ==========================================
// JWT BOUNCER (MIDDLEWARE)
// ==========================================
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) return res.status(401).json({ error: "Access Denied. No token provided." });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: "Invalid or expired token." });
        req.user = user;
        next(); 
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

app.post('/api/upload', authenticateToken, upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const originalName = req.file.originalname;
    const safeName = originalName.substring(0, originalName.lastIndexOf('.')).replace(/\s+/g, '_'); 

    const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'ghss_uploads', resource_type: 'auto', public_id: `${Date.now()}-${safeName}`, use_filename: true },
        (error, result) => {
            if (error) {
                console.error("Cloudinary Error:", error);
                return res.status(500).json({ error: "Failed to upload" });
            }
            res.json({ fileUrl: result.secure_url, originalName: originalName });
        }
    );
    uploadStream.end(req.file.buffer);
});


// ==========================================
// 1. AUTHENTICATION (PUBLIC)
// ==========================================
app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        const admin = await Admin.findOne({ username });
        if (!admin) return res.status(401).json({ error: "Invalid username or password" });
        
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return res.status(401).json({ error: "Invalid username or password" });

        const token = jwt.sign(
            { id: admin._id, username: admin.username }, 
            process.env.JWT_SECRET, 
            { expiresIn: JWT_EXPIRES_IN }
        );
        
        res.json({ message: "Login successful", token });
    } catch (err) {
        console.error("Login Error: ", err);
        res.status(500).json({ error: "Server error during login" });
    }
});


// ==========================================
// 2. ANNOUNCEMENTS
// ==========================================
app.get('/api/announcements', async (req, res) => {
    try {
        const notices = await Announcement.find().sort({ date: -1 });
        res.json(notices);
    } catch (err) { res.status(500).json({ error: "Failed to fetch announcements" }); }
});

app.post('/api/announcements', authenticateToken, async (req, res) => {
    try {
        const newNotice = new Announcement(req.body);
        const savedNotice = await newNotice.save();
        res.status(201).json({ message: "Announcement published!", insertId: savedNotice._id });
    } catch (err) { res.status(500).json({ error: "Failed to create announcement" }); }
});

app.put('/api/announcements/:id', authenticateToken, async (req, res) => {
    try {
        await Announcement.findByIdAndUpdate(req.params.id, req.body);
        res.json({ message: "Announcement updated successfully" });
    } catch (err) { res.status(500).json({ error: "Failed to update announcement" }); }
});

app.delete('/api/announcements/:id', authenticateToken, async (req, res) => {
    try {
        await Announcement.findByIdAndDelete(req.params.id);
        res.json({ message: "Announcement deleted successfully" });
    } catch (err) { res.status(500).json({ error: "Failed to delete announcement" }); }
});


// ==========================================
// 3. FACULTY
// ==========================================
app.get('/api/faculty', async (req, res) => {
    try {
        const faculty = await Faculty.find().sort({ created_at: 1 });
        res.json(faculty);
    } catch (err) { res.status(500).json({ error: "Failed to fetch faculty" }); }
});

app.post('/api/faculty', authenticateToken, async (req, res) => {
    try {
        const newFaculty = new Faculty(req.body);
        const savedFaculty = await newFaculty.save();
        res.status(201).json({ message: "Faculty added!", insertId: savedFaculty._id });
    } catch (err) { res.status(500).json({ error: "Failed to add faculty" }); }
});

app.put('/api/faculty/:id', authenticateToken, async (req, res) => {
    try {
        await Faculty.findByIdAndUpdate(req.params.id, req.body);
        res.json({ message: "Faculty updated successfully" });
    } catch (err) { res.status(500).json({ error: "Failed to update faculty" }); }
});

app.delete('/api/faculty/:id', authenticateToken, async (req, res) => {
    try {
        await Faculty.findByIdAndDelete(req.params.id);
        res.json({ message: "Faculty deleted successfully" });
    } catch (err) { res.status(500).json({ error: "Failed to delete faculty" }); }
});


// ==========================================
// 4. STUDENT CORNER
// ==========================================
app.get('/api/student-resources', async (req, res) => {
    try {
        const resources = await StudentResource.find().sort({ created_at: -1 });
        res.json(resources);
    } catch (err) { res.status(500).json({ error: "Failed to fetch resources" }); }
});

app.post('/api/student-resources', authenticateToken, async (req, res) => {
    try {
        const newResource = new StudentResource(req.body);
        const savedResource = await newResource.save();
        res.status(201).json({ message: "Resource added!", insertId: savedResource._id });
    } catch (err) { res.status(500).json({ error: "Failed to add resource" }); }
});

app.put('/api/student-resources/:id', authenticateToken, async (req, res) => {
    try {
        await StudentResource.findByIdAndUpdate(req.params.id, req.body);
        res.json({ message: "Resource updated successfully" });
    } catch (err) { res.status(500).json({ error: "Failed to update resource" }); }
});

app.delete('/api/student-resources/:id', authenticateToken, async (req, res) => {
    try {
        await StudentResource.findByIdAndDelete(req.params.id);
        res.json({ message: "Resource deleted successfully" });
    } catch (err) { res.status(500).json({ error: "Failed to delete resource" }); }
});


// ==========================================
// 5. MANDATORY DISCLOSURE
// ==========================================
app.get('/api/disclosure', async (req, res) => {
    try {
        const doc = await MandatoryDisclosure.findOne();
        res.json(doc || {}); // Return empty object if nothing exists yet
    } catch (err) { res.status(500).json({ error: "Failed to fetch disclosure data" }); }
});

app.put('/api/disclosure', authenticateToken, async (req, res) => {
    try {
        await MandatoryDisclosure.findOneAndUpdate({}, req.body, { upsert: true, new: true });
        res.json({ message: "Mandatory Disclosure updated successfully!" });
    } catch (err) { res.status(500).json({ error: "Failed to update disclosure data" }); }
});


// ==========================================
// 6. SITE SETTINGS
// ==========================================
app.get('/api/settings', async (req, res) => {
    try {
        const doc = await SiteSettings.findOne();
        res.json(doc || {});
    } catch (err) { res.status(500).json({ error: "Failed to fetch settings" }); }
});

app.put('/api/settings', authenticateToken, async (req, res) => {
    try {
        await SiteSettings.findOneAndUpdate({}, req.body, { upsert: true, new: true });
        res.json({ message: "Site settings updated successfully!" });
    } catch (err) { res.status(500).json({ error: "Failed to update settings" }); }
});


// ==========================================
// SECURITY API ROUTES (Change Password)
// ==========================================
app.put('/api/security/change-password', authenticateToken, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        
        // Find the admin based on the token ID securely attached by our middleware
        const admin = await Admin.findById(req.user.id);
        if (!admin) return res.status(404).json({ error: "Admin user not found" });

        const isMatch = await bcrypt.compare(currentPassword, admin.password);
        if (!isMatch) return res.status(401).json({ error: "Incorrect current password." });

        const salt = await bcrypt.genSalt(10);
        admin.password = await bcrypt.hash(newPassword, salt);
        await admin.save();

        res.json({ message: "Password updated successfully!" });
    } catch (err) {
        console.error("Database Error: ", err);
        res.status(500).json({ error: "Failed to change password" });
    }
});

// ==========================================
// 7. FACILITIES
// ==========================================
app.get('/api/facilities', async (req, res) => {
    try {
        const facilities = await Facility.find().sort({ created_at: -1 });
        res.json(facilities);
    } catch (err) { res.status(500).json({ error: "Failed to fetch facilities" }); }
});

app.post('/api/facilities', authenticateToken, async (req, res) => {
    try {
        const newFacility = new Facility(req.body);
        const savedFacility = await newFacility.save();
        res.status(201).json({ message: "Facility added!", insertId: savedFacility._id });
    } catch (err) { 
        console.error("🔥 DATABASE ERROR:", err); // <-- ADD THIS LINE
        res.status(500).json({ error: "Failed to add facility" }); 
    }
});

app.put('/api/facilities/:id', authenticateToken, async (req, res) => {
    try {
        await Facility.findByIdAndUpdate(req.params.id, req.body);
        res.json({ message: "Facility updated successfully" });
    } catch (err) { res.status(500).json({ error: "Failed to update facility" }); }
});

app.delete('/api/facilities/:id', authenticateToken, async (req, res) => {
    try {
        await Facility.findByIdAndDelete(req.params.id);
        res.json({ message: "Facility deleted successfully" });
    } catch (err) { res.status(500).json({ error: "Failed to delete facility" }); }
});
 

// ==========================================
// START SERVER
// ==========================================
app.get('/', (req, res) => res.send('GHSS API (MongoDB) is running!'));
app.get('/api', (req, res) => res.send('GHSS API (MongoDB) is running!'));

app.get('/api/ping', (req, res) => {
    res.status(200).send('OK');
});

app.listen(PORT, () => {
    console.log(`🚀 Server connected and running on port ${PORT}`);
});