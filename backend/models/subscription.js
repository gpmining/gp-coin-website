// models/subscription.js

const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    rank: {
        type: String,
        enum: ["silver", "gold", "diamond", "ultimate"],
        required: true
    },
    amount_paid: {
        type: Number,
        required: true
    },
    transaction_id: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Subscription", subscriptionSchema);
