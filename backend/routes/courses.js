const express = require("express");
const router = express.Router();
const upload = require("../config/multerStorage"); // This already has Cloudinary config
const Class = require("../model/courses");
const Teacher = require("../model/Teacher");
const axios = require('axios');
const fs = require('fs');
const dotenv = require('dotenv');
const User = require("../model/User");

dotenv.config();

// Update the AssemblyAI configuration
const ASSEMBLY_AI_API_KEY = process.env.ASSEMBLY_AI_API_KEY;

const assemblyApi = axios.create({
  baseURL: 'https://api.assemblyai.com/v2',
  headers: {
    authorization: ASSEMBLY_AI_API_KEY,
    'content-type': 'application/json',
  },
});

const assemblyUploadApi = axios.create({
  baseURL: 'https://api.assemblyai.com/v2',
  headers: {
    authorization: ASSEMBLY_AI_API_KEY,
    'content-type': 'application/octet-stream',
  },
});

router.post("/upload-class", upload.fields([
  { name: "notes", maxCount: 1 },
  { name: "video", maxCount: 1 },
]), async (req, res) => {
  try {
    if (!req.files || !req.files.notes || !req.files.video) {
      return res.status(400).json({ message: "Please upload both notes and video." });
    }

    const { topic, subTopic, teacherEmail } = req.body;
    
    if (!topic || !subTopic || !teacherEmail) {
      return res.status(400).json({ message: "Topic, subTopic, and teacher email are required." });
    }

    const teacher = await Teacher.findOne({ email: teacherEmail });
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found." });
    }

    const teacherName = teacher.firstname + " " + teacher.lastname;
    const teacherAssignedSub = teacher.subjectassigned;

    // Get Cloudinary URLs
    const notesUrl = req.files.notes[0].path;
    const videoUrl = req.files.video[0].path;

    try {
      // Upload video to AssemblyAI
      const videoResponse = await axios({
        method: 'GET',
        url: videoUrl,
        responseType: 'arraybuffer'
      });

      const uploadResponse = await assemblyUploadApi.post('/upload', videoResponse.data);

      console.log('Upload response:', uploadResponse.data);

      // Start transcription
      const transcriptResponse = await assemblyApi.post('/transcript', {
        audio_url: uploadResponse.data.upload_url,
        auto_chapters: true,
      });

      console.log('Transcript initiated:', transcriptResponse.data);

      // Poll for completion
      const checkCompletionInterval = setInterval(async () => {
        try {
          const transcript = await assemblyApi.get(`/transcript/${transcriptResponse.data.id}`);
          console.log('Transcript status:', transcript.data.status);
          
          if (transcript.data.status === 'completed') {
            clearInterval(checkCompletionInterval);
            
            // Log the transcript data structure to debug
            console.log('Transcript data structure:', {
              text: transcript.data.text ? 'present' : 'missing',
              words: transcript.data.words ? `${transcript.data.words.length} words` : 'missing',
              chapters: transcript.data.chapters ? `${transcript.data.chapters.length} chapters` : 'missing'
            });
            
            const newClass = new Class({
              topic,
              subTopic,
              notes: notesUrl,
              video: videoUrl,
              teacherEmail,
              teacherName,
              teacherAssignedSub,
              captions: transcript.data.text,
              words: transcript.data.words,
              chapters: transcript.data.chapters
            });

            await newClass.save();
            res.status(201).json({ message: "Class uploaded successfully!", class: newClass });
          } else if (transcript.data.status === 'error') {
            clearInterval(checkCompletionInterval);
            throw new Error('Transcription failed');
          }
        } catch (error) {
          clearInterval(checkCompletionInterval);
          console.error('Error in transcription polling:', error);
          throw error;
        }
      }, 3000);

    } catch (error) {
      console.error("Error processing video:", error);
      throw error;
    }

  } catch (error) {
    console.error("Upload error:", error.response?.data || error.message);
    res.status(500).json({ 
      message: "An error occurred while uploading the class.",
      error: error.response?.data || error.message 
    });
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
    console.log("Fetching subtopics for topic:", topicName); // Debug log

    // Find all active classes under the given topic
    const classes = await Class.find({ 
      topic: topicName,
      activeStatus: true // Only get active classes
    });

    console.log("Found classes:", classes); // Debug log

    // Extract unique subtopics
    const subtopics = [...new Set(classes.map((item) => item.subTopic))];
    console.log("Extracted subtopics:", subtopics); // Debug log

    res.json(subtopics);
  } catch (error) {
    console.error("Error fetching subtopics:", error);
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

// Temporary debug route to check all classes
router.get("/debug/all-classes", async (req, res) => {
  try {
    const classes = await Class.find({});
    res.json({
      total: classes.length,
      classes: classes.map(c => ({
        topic: c.topic,
        subTopic: c.subTopic,
        activeStatus: c.activeStatus
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Temporary debug route to check classes by topic
router.get("/debug/classes-by-topic/:topic", async (req, res) => {
  try {
    const classes = await Class.find({ topic: req.params.topic });
    res.json({
      topic: req.params.topic,
      total: classes.length,
      classes: classes
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add endpoint to mark class as completed
router.post("/student/complete-class/:classId", async (req, res) => {
  try {
    const { classId } = req.params;
    const { studentEmail } = req.body;

    if (!studentEmail) {
      return res.status(400).json({ error: "Student email is required" });
    }

    const classDoc = await Class.findById(classId);
    if (!classDoc) {
      return res.status(404).json({ error: "Class not found" });
    }

    // Check if student has already completed this class
    const alreadyCompleted = classDoc.completedBy.some(
      entry => entry.studentEmail === studentEmail
    );

    if (!alreadyCompleted) {
      classDoc.completedBy.push({ studentEmail });
      await classDoc.save();
    }

    res.json({ message: "Class marked as completed" });
  } catch (error) {
    res.status(500).json({ error: "Failed to mark class as completed" });
  }
});

// Add feedback route
router.post("/student/feedback/:classId", async (req, res) => {
  try {
    const { classId } = req.params;
    const { studentEmail, feedback } = req.body;

    if (!studentEmail || !feedback) {
      return res.status(400).json({ error: "Student email and feedback are required" });
    }

    const classDoc = await Class.findById(classId);
    if (!classDoc) {
      return res.status(404).json({ error: "Class not found" });
    }

    // Add feedback to the class document
    classDoc.feedback = classDoc.feedback || [];
    classDoc.feedback.push({
      studentEmail,
      feedback,
      timestamp: new Date()
    });

    await classDoc.save();

    res.json({ message: "Feedback submitted successfully" });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ error: "Failed to submit feedback" });
  }
});

// Get feedbacks for a specific class
router.get("/feedback/:classId", async (req, res) => {
  try {
    const { classId } = req.params;
    
    const classDoc = await Class.findById(classId);
    if (!classDoc) {
      return res.status(404).json({ error: "Class not found" });
    }

    // Return the feedbacks array (or empty array if no feedbacks)
    res.json(classDoc.feedback || []);
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    res.status(500).json({ error: "Failed to fetch feedbacks" });
  }
});

// Get students who viewed a specific class
router.get("/viewed-students/:classId", async (req, res) => {
  try {
    const { classId } = req.params;
    
    const classDoc = await Class.findById(classId);
    if (!classDoc) {
      return res.status(404).json({ error: "Class not found" });
    }

    // Get all student details from User model
    const viewedStudentsDetails = await Promise.all(
      classDoc.completedBy.map(async (viewer) => {
        const userDoc = await User.findOne({ email: viewer.studentEmail });
        return {
          name: userDoc ? userDoc.name : 'Unknown User',
          completedAt: viewer.completedAt
        };
      })
    );

    res.json(viewedStudentsDetails);
  } catch (error) {
    console.error('Error fetching viewed students:', error);
    res.status(500).json({ error: "Failed to fetch viewed students" });
  }
});

module.exports = router;
