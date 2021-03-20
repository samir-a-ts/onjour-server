import mongoose from 'mongoose';

const schoolObj = {    
    uid: String,
    location: {
        latitude: Number,
        longtitude: Number,
        address: String,
    },
    directorUid: String,
    confirmed: Boolean,
    assistantsUids: Array,
    parentUids: Array,
    studentUids: Array,
    teacherUids: Array,
    name: String,
};

const schoolSchema = new mongoose.Schema(schoolObj);

const SchoolSchema = mongoose.model('School', schoolSchema, 'schools');

export default SchoolSchema;