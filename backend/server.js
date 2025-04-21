//server.js
require("dotenv").config();
const cors = require("cors"); // Import CORS package
const express = require("express");
const connectDB = require("./config/db");
const authMiddleware = require("./middleware/authMiddleware");

const app = express();
const PORT = 3000;

app.use(cors()); // Enable CORS for all requests
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/mine", require("./routes/miningRoutes"));
app.use("/api/dashboard", authMiddleware, require("./routes/dashboardRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/user", authMiddleware, require("./routes/userRoutes")); // Protected user routes
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/admin", require("./routes/adminAuthRoutes"));
app.use("/api/withdrawal", require("./routes/withdrawalRoutes"));
app.use("/api/subscription", require("./routes/subscriptionRoutes"));
app.use("/api/rank", require("./routes/rankRoutes"));
app.use("/api/forgot-password", require("./routes/forgotPasswordRoutes"));

app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

