const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const adminLogin = async (req, res) => {
    try {
        const { username, password } = req.body;

        const admin = await Admin.findOne({ username });
        if (!admin) return res.status(400).json({ message: "Invalid username or password" });

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid username or password" });

        const token = jwt.sign({ id: admin._id, role: "admin" }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.status(200).json({ message: "Admin login successful", token });
    } catch (error) {
        res.status(500).json({ message: "Admin login failed", error: error.message });
    }
};

module.exports = { adminLogin };

