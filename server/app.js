const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectToDB = require('./config/db');
const { userRoute } = require('./routes/user.route');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS configuration
app.use(cors((req, callback) => {
    const allowedOrigins = [
        'http://localhost:5500',
        'http://127.0.0.1:5500'
    ];
    const origin = req.header('Origin');
    if (allowedOrigins.includes(origin)) {
        callback(null, { origin: true, credentials: true });
    } else {
        callback(new Error('Not allowed by CORS'), { origin: false });
    }
}));

// Connect to the database
connectToDB();

// Routes
app.use("/", userRoute);

module.exports = app;
