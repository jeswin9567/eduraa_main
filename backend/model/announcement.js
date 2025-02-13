const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
  targetAudience: { type: String, enum: ["all", "teachers", "students"], required: true },
});

module.exports = mongoose.model("Announcement", announcementSchema);


