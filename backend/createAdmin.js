const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

// Replace this with your actual MongoDB connection string
const mongoURI = "mongodb://gpcoin_user:sufiDON143@ac-r7kmfda-shard-00-00.hrxzmzu.mongodb.net:27017,ac-r7kmfda-shard-00-01.hrxzmzu.mongodb.net:27017,ac-r7kmfda-shard-00-02.hrxzmzu.mongodb.net:27017/?ssl=true&replicaSet=atlas-bw79ve-shard-0&authSource=admin&retryWrites=true&w=majority&appName=gpcoin";

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

const AdminSchema = new mongoose.Schema({
    username: String,
    password: String
});
const Admin = mongoose.model("Admin", AdminSchema);

async function createAdmin() {
    const hashedPassword = await bcrypt.hash("1sufyan2qazlbash3aftab4error", 10); // Replace with your desired password
    const newAdmin = new Admin({ username: "sufyan", password: hashedPassword });
    await newAdmin.save();
    console.log("✅ Admin account created successfully!");
    mongoose.connection.close();
}

createAdmin();