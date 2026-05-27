// models/Models.js
const mongoose = require('mongoose');

// Helper to rename _id to id for React frontend compatibility
const transformConfig = {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
    }
};

// 1. Admin User Schema
const AdminSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
AdminSchema.set('toJSON', transformConfig);

// 2. Announcement Schema
const AnnouncementSchema = new mongoose.Schema({
    title: String,
    date: Date,
    content: String,
    linkUrl: String,
    fileName: String,
    fileUrl: String,
    isRecent: Boolean, // <-- Changed from isNew
    showOnHome: Boolean,
    showInTicker: Boolean
});
AnnouncementSchema.set('toJSON', transformConfig);



// 3. Faculty Schema
const FacultySchema = new mongoose.Schema({
    name: String,
    role: String,
    qual: String,
    subject: String,
    classTaught: String,
    created_at: { type: Date, default: Date.now }
});
FacultySchema.set('toJSON', transformConfig);

// 4. Student Resource Schema
const StudentResourceSchema = new mongoose.Schema({
    title: String,
    description: String,
    fileName: String,
    fileUrl: String,
    created_at: { type: Date, default: Date.now }
});
StudentResourceSchema.set('toJSON', transformConfig);

// 5. Facility Schema
const FacilitySchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    imageName: String,
    imageUrl: String,
    created_at: { type: Date, default: Date.now }
});
FacilitySchema.set('toJSON', transformConfig);



// 5. Settings & Disclosure (Look how easy JSON is now!)
const SiteSettingsSchema = new mongoose.Schema({
    generalData: Object,
    socialData: Object,
    brandingData: Object
});

const MandatoryDisclosureSchema = new mongoose.Schema({
    generalData: Object,
    docsData: Object,
    academicDocs: Object,
    classXResults: Array,
    classXIIResults: Array,
    staffData: Object,
    infraData: Object
});

module.exports = {
    Admin: mongoose.model('Admin', AdminSchema),
    Announcement: mongoose.model('Announcement', AnnouncementSchema),
    Faculty: mongoose.model('Faculty', FacultySchema),
    StudentResource: mongoose.model('StudentResource', StudentResourceSchema),
    Facility: mongoose.model('Facility', FacilitySchema), // <--- DID YOU ADD THIS?
    SiteSettings: mongoose.model('SiteSettings', SiteSettingsSchema),
    MandatoryDisclosure: mongoose.model('MandatoryDisclosure', MandatoryDisclosureSchema)
};