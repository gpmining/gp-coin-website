const User = require("../models/User");

// Fetch all users
const getUsers = async (req, res) => {
    try {
        const users = await User.find({}, "gp_id name email mobile cnic rank");
        res.status(200).json(users);
    } catch (error) {
        console.error("❌ Failed to fetch users:", error);
        res.status(500).json({ message: "Failed to fetch users", error: error.message });
    }
};

// Update User Rank
const updateUserRank = async (req, res) => {
    try {
        const { user_id, new_rank } = req.body;
        const user = await User.findById(user_id);

        if (!user) return res.status(404).json({ message: "User not found" });

        user.rank = new_rank;
        await user.save();
        res.status(200).json({ message: "User rank updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to update rank", error: error.message });
    }
};

// Delete User Function
const deleteUser = async (req, res) => {
    try {
        const { user_id } = req.body;
        const user = await User.findByIdAndDelete(user_id);

        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete user", error: error.message });
    }
};

// Export deleteUser function
module.exports = { getUsers, updateUserRank, deleteUser };

