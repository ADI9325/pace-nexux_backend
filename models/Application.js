const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  email: { type: String, required: true },
  name: { type: String, required: true },
  gender: { type: String, required: true },
  qualification: { type: String, required: true },
  internshipPreference: { type: String, required: true },
  college: { type: String, required: true },
  contactNo: { type: String, required: true },
  currentYear: { type: String, required: true },
  resume: { type: String, required: true }, // Path to the uploaded file
  termsAccepted: { type: Boolean, required: true }
});

const Application = mongoose.model('Application', applicationSchema);
module.exports = Application;
