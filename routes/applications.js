const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const nodemailer = require('nodemailer');
const Application = require('../models/Application'); // Import your Application model

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileExt = path.extname(file.originalname);
        cb(null, `${uniqueSuffix}${fileExt}`);
    },
});

const upload = multer({ storage: storage });

// Configure the Nodemailer transporter
const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: false, // Use `true` for port 465, `false` for other ports
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
    },
});

// POST route for form submission
router.post('/applications', upload.single('resume'), async (req, res) => {
    try {
        const {
            email,
            name,
            gender,
            qualification,
            internshipPreference,
            college,
            contactNo,
            currentYear,
        } = req.body;

        // Parse `termsAccepted` to a boolean
        const termsAccepted = req.body.termsAccepted === 'true' || req.body.termsAccepted === 'on';

        // Resume file path
        const resumePath = req.file ? req.file.path : null;

        if (!resumePath) {
            return res.status(400).json({ message: 'Resume file is required.' });
        }

        // Create a new application
        const application = new Application({
            email,
            name,
            gender,
            qualification,
            internshipPreference,
            college,
            contactNo,
            currentYear,
            termsAccepted,
            resume: resumePath,
        });

        await application.save();

        // Send a confirmation email
        const mailOptions = {
            from: `"Pace-Nexus" <${process.env.MAIL_FROM_ADDRESS}>`,
            to: email,
            subject: 'Congratulations on Taking the First Step Towards Your Career!',
            text: `Dear ${name},
      
      Thank you for submitting your application for the internship opportunity at Pace-nexus! 🎉
      
      You’ve officially taken the first step toward an exciting journey, and we couldn’t be happier to have you in the process. Our hiring team is now reviewing your information and exploring your profile. We’ll be reaching out to you soon with the next steps!
      
      Stay tuned and keep an eye on your inbox 📬. In the meantime, feel free to explore more about us and share the internship opportunity with your friends so that we can hire the talents and grow our team.
      
      We’re thrilled at the possibility of having you on board. Here’s to new beginnings and exciting opportunities ahead!
      
      Best regards,
      Hiring Team
      Pace-Nexus Pvt. Ltd. India`,
          };
      

        await transporter.sendMail(mailOptions);

        res.status(201).json({ message: 'Application submitted successfully, and confirmation email sent.' });
    } catch (error) {
        console.error('Error while saving application or sending email:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


module.exports = router;
