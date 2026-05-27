// db.js
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        // Set connection options to handle stability gracefully
        const options = {
            autoIndex: true, // Build indexes automatically
            serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds instead of locking up
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        };

        await mongoose.connect(process.env.MONGO_URI, options);
        console.log('✅ MongoDB Atlas Connected Successfully');
    } catch (err) {
        console.error('❌ MongoDB Connection Initial Error:', err.message);
        console.log('⏳ Retrying initial connection in 5 seconds...');
        setTimeout(connectDB, 5000); // Retry loop for initial boot failures
    }
};

// ==========================================
// THE SELF-HEALING SAFETY NET (Your Logic)
// ==========================================
mongoose.connection.on('disconnected', () => {
    console.warn('⚠️ Mongoose disconnected from MongoDB Atlas!');
    console.log('🔄 Attempting to re-establish the dead pipe via connectDB()...');
    
    // Clear out any old, broken connection state caches cleanly
    mongoose.connection.close(() => {
        connectDB();
    });
});

mongoose.connection.on('error', (err) => {
    console.error('🔥 Mongoose runtime connection error:', err.message);
});

module.exports = connectDB;