const express = require("express");
const admin = require("firebase-admin");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt"); // Hash passwords securely
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// **Initialize Firebase**
const serviceAccount = require("./firebase-credentials.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://netzerox-6948e.firebaseio.com"
});
const db = admin.firestore();

// **Email Transporter for OTP**
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// **Send OTP for Registration**
app.post("/send-otp", async (req, res) => {
    const { email } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000);

    try {
        console.log(`📩 Sending OTP to ${email}...`);

        await db.collection("otp").doc(email).set({
            otp,
            createdAt: admin.firestore.Timestamp.now(),
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "NetZeroX OTP Verification",
            text: `Your OTP Code is ${otp}. It is valid for 5 minutes.`,
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent successfully to ${email}`);

        res.json({ success: true, message: "OTP sent successfully!" });
    } catch (error) {
        console.error("❌ Error sending OTP:", error);
        res.status(500).json({ success: false, message: "Error sending OTP", error: error.message });
    }
});

// **Verify OTP & Register User**
app.post("/register", async (req, res) => {
    const { email, otp, username, password } = req.body;

    try {
        const doc = await db.collection("otp").doc(email).get();
        if (!doc.exists || doc.data().otp != otp) {
            return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
        }

        // **Check if username exists**
        const userCheck = await db.collection("users").where("username", "==", username).get();
        if (!userCheck.empty) {
            return res.status(400).json({ success: false, message: "Username already taken" });
        }

        // **Hash Password**
        const hashedPassword = await bcrypt.hash(password, 10);

        // **Save User in Firestore**
        await db.collection("users").doc(email).set({
            username,
            password: hashedPassword,
            createdAt: admin.firestore.Timestamp.now()
        });

        await db.collection("otp").doc(email).delete(); // Remove OTP after use
        console.log(`✅ User ${username} registered successfully`);

        res.json({ success: true, message: "Registration successful! You can now log in." });
    } catch (error) {
        console.error("❌ Error registering user:", error);
        res.status(500).json({ success: false, message: "Registration failed" });
    }
});

// **Login User**
app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const users = await db.collection("users").where("username", "==", username).get();

        if (users.empty) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        const userDoc = users.docs[0].data();
        const passwordMatch = await bcrypt.compare(password, userDoc.password);

        if (!passwordMatch) {
            return res.status(400).json({ success: false, message: "Invalid password" });
        }

        console.log(`✅ User ${username} logged in successfully`);
        res.json({ success: true, message: "Login successful! Redirecting to dashboard..." });
    } catch (error) {
        console.error("❌ Login error:", error);
        res.status(500).json({ success: false, message: "Login failed" });
    }
});

// **Start Server**
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
