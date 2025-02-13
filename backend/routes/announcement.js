const express = require("express");
const Announcement = require("../model/announcement");
const LoginModel = require("../model/login");
const router = express.Router();

// Create Announcement
router.post("/create", async (req, res) => {
  try {
    const { title, content, targetAudience, createdBy } = req.body;

    // Find the user by email
    const user = await LoginModel.findOne({ email: createdBy });
    if (!user || user.role !== "manager") {
      return res.status(403).json({ error: "Unauthorized: Only managers can create announcements" });
    }

    // Create the announcement with the user's ObjectId
    const announcement = new Announcement({ title, content, createdBy: user._id, targetAudience });
    await announcement.save();
    res.status(201).json({ message: "Announcement created successfully", announcement });
  } catch (error) {
    console.error("Error creating announcement:", error); // Log the error for debugging
    res.status(500).json({ error: "Failed to create announcement" });
  }
});

// Get All Announcements
router.get("/get", async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 });
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch announcements" });
  }
});

// Delete Announcement
router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Announcement.findByIdAndDelete(id);
    res.status(200).json({ message: "Announcement deleted successfully" });
  } catch (error) {
    console.error("Error deleting announcement:", error);
    res.status(500).json({ error: "Failed to delete announcement" });
  }
});

router.post("/check-role", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await LoginModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ role: user.role });
  } catch (error) {
    console.error("Error checking user role:", error);
    res.status(500).json({ error: "Failed to check role" });
  }
});

// Get announcements for teachers
router.get("/get-teacher", async (req, res) => {
  try {
    const announcements = await Announcement.find({
      $or: [{ targetAudience: "all" }, { targetAudience: "teachers" }],
    }).sort({ createdAt: -1 });

    res.json(announcements);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch announcements" });
  }
});

router.get("/get-student", async (req, res) => {
  try {
    const announcements = await Announcement.find({ targetAudience: { $in: ["all", "students"] } }).sort({ createdAt: -1 });
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch announcements" });
  }
});

module.exports = router;
