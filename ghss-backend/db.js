// db.js
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB Atlas Connected Successfully');
    } catch (err) {
        console.error('❌ MongoDB Connection Error:', err);
        process.exit(1); // Stop the server if the database fails
    }
};

module.exports = connectDB;