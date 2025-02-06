const express = require("express");
const router = express.Router();
const upload = require("../config/multerStorage"); // Your multer middleware
const Class = require("../model/courses"); // Import the Class model
const Teacher = require("../model/Teacher");

// Route to handle class upload

router.post("/upload-class", upload.fields([
  { name: "notes", maxCount: 1 },
  { name: "video", maxCount: 1 },
]), async (req, res) => {
  try {
    // Check if files are uploaded
    if (!req.files || !req.files.notes || !req.files.video) {
      return res.status(400).json({ message: "Please upload both notes and video." });
    }

    const { topic, subTopic, teacherEmail } = req.body;
    
    // Validate required fields
    if (!topic || !subTopic || !teacherEmail) {
      return res.status(400).json({ message: "Topic, subTopic, and teacher email are required." });
    }

    // Retrieve teacher's name based on teacherEmail
    const teacher = await Teacher.findOne({ email: teacherEmail });
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found." });
    }

    const teacherName = teacher.firstname + " " + teacher.lastname; // Construct full name
    const teacherAssignedSub = teacher.subjectassigned;

    const notesFileUrl = req.files.notes[0].path; // Path of the uploaded PDF file
    const videoFileUrl = req.files.video[0].path; // Path of the uploaded video file

    // Create a new class entry
    const newClass = new Class({
      topic,
      subTopic,
      notes: notesFileUrl,
      video: videoFileUrl,
      teacherEmail,  // Store teacher email
      teacherName,   // Store teacher name
      teacherAssignedSub,
    });

    // Save to the database
    await newClass.save();

    res.status(201).json({ message: "Class uploaded successfully!", class: newClass });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: error.message || "An error occurred while uploading the class." });
  }
});

// Get all unique topics
router.get("/topics", async (req, res) => {
  try {
    const topics = await Class.distinct("topic"); // Fetch unique topics from the 'Class' collection
    res.status(200).json(topics);
  } catch (error) {
    console.error("Error fetching topics:", error);
    res.status(500).json({ message: "Failed to fetch topics" });
  }
});


// Get classes by teacher email
router.get("/classes", async (req, res) => {
  const { email } = req.query; // Email sent as a query parameter

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const classes = await Class.find({ teacherEmail: email });
    res.status(200).json(classes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching classes", error });
  }
});

// Route to get unique topics
router.get("/topics", async (req, res) => {
  try {
    const topics = await Class.distinct("topic");
    res.status(200).json(topics);
  } catch (error) {
    console.error("Error fetching topics:", error);
    res.status(500).json({ message: "Failed to fetch topics." });
  }
});


router.get("/subtopics", async (req, res) => {
  const { email, topic } = req.query;

  try {
    const classes = await Class.find({ teacherEmail: email, topic, });
    res.json(classes);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch subtopics" });
  }
});



//disable classes

router.patch("/disable-subtopic/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedSubtopic = await Class.findByIdAndUpdate(
      id,
      { activeStatus: false },
      { new: true }
    );
    if (!updatedSubtopic) {
      return res.status(404).json({ message: "Subtopic not found" });
    }
    res.json({ message: "Subtopic disabled successfully", updatedSubtopic });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// enablesubtopic

router.patch("/toggle-subtopic/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { activeStatus } = req.body; // Get the new status from the request body

    const updatedSubtopic = await Class.findByIdAndUpdate(
      id,
      { activeStatus },
      { new: true }
    );

    if (!updatedSubtopic) {
      return res.status(404).json({ message: "Subtopic not found" });
    }

    res.json({ message: "Subtopic status updated successfully", updatedSubtopic });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// to get number of classes uploaded

router.get("/classes/teacher-count", async (req, res) => {
    const { email } = req.query;

    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    try {
        const count = await Class.countDocuments({ teacherEmail: email });
        res.status(200).json({ count });
    } catch (error) {
        res.status(500).json({ message: "Error fetching class count", error });
    }
});

// to get all courses for the students


router.get("/student/course", async (req, res) => {
  try {
    const courses = await Class.find(); // Fetch all courses
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// to get subtopic

router.get("/student/course/:topic", async (req, res) => {
  try {
    const topicName = req.params.topic;

    // Find all classes under the given topic
    const classes = await Class.find({ topic: topicName });

    // Extract unique subtopics
    const subtopics = [...new Set(classes.map((item) => item.subTopic))];

    res.json(subtopics);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch subtopics" });
  }
});

// to get class detials like notes

router.get("/student/course/:topic/:subTopic", async (req, res) => {
  try {
    const { topic, subTopic } = req.params;

    // Find all classes matching the topic and subtopic
    const classes = await Class.find({ topic, subTopic });

    if (!classes || classes.length === 0) {
      return res.status(404).json({ error: "No classes found for this subtopic" });
    }

    res.json(classes);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch class details" });
  }
});

// view boxes

router.get("/teachers/subjects", async (req, res) => {
  try {
    const teachers = await Teacher.find({}, "subjectassigned");
    
    // Extract unique subjects
    const uniqueSubjects = [...new Set(teachers.map(teacher => teacher.subjectassigned).filter(Boolean))];

    res.json(uniqueSubjects);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

// update class

router.get("/subtopic/:id", async (req, res) => {
  try {
    const subtopic = await Class.findById(req.params.id);
    if (!subtopic) {
      return res.status(404).send({ message: "Subtopic not found" });
    }
    res.status(200).json(subtopic);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

// udpdate by id
router.patch("/update-subtopic/:id", upload.fields([
  { name: "notes", maxCount: 1 },
  { name: "video", maxCount: 1 }
]), async (req, res) => {
  try {
    const { subTopic } = req.body;
    let updateData = { subTopic };

    // Handle notes file update
    if (req.files && req.files.notes) {
      updateData.notes = req.files.notes[0].path;
    } else if (req.body.notes) {
      updateData.notes = req.body.notes; // Keep existing URL
    }

    // Handle video file update
    if (req.files && req.files.video) {
      updateData.video = req.files.video[0].path;
    } else if (req.body.video) {
      updateData.video = req.body.video; // Keep existing URL
    }

    const updatedSubtopic = await Class.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    
    if (!updatedSubtopic) {
      return res.status(404).send({ message: "Subtopic not found" });
    }

    res.status(200).json(updatedSubtopic);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

module.exports = router;
