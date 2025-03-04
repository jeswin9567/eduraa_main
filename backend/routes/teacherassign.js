const express = require("express");
const router = express.Router();
const Teacher = require("../model/Teacher");
const User = require('../model/User')
const QuizAnswer = require("../model/quiz");
const Class = require("../model/courses");

// Fetch assigned students for a teacher using their email
router.get("/assigned-students", async (req, res) => {
  try {
    const { email } = req.query; // Get teacher's email from query

    if (!email) {
      return res.status(400).json({ message: "Teacher email is required" });
    }

    // Find teacher and populate assigned students
    const teacher = await Teacher.findOne({ email }).populate("assignedStudents", "name email phone education");

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    res.json({ assignedStudents: teacher.assignedStudents });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});



// Route to get the count of assigned students
router.get("/assigned-students/count", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ message: "Teacher email is required." });
    }

    // Find teacher by email
    const teacher = await Teacher.findOne({ email }).populate("assignedStudents");

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found." });
    }

    const studentCount = teacher.assignedStudents.length;
    res.status(200).json({ studentCount });
  } catch (error) {
    console.error("Error fetching assigned students count:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// assinged teacher

router.get("/assigned-teachers", async (req, res) => {
  try {
    const { email } = req.query; // Get users's email from query

    if (!email) {
      return res.status(400).json({ message: "User email is required" });
    }

    // Find teacher and populate assigned students
    const user = await User.findOne({ email }).populate("assignedTeacher", "firstname email phone subjectassigned");

    if (!user) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    res.json({  assignedTeacher: user.assignedTeacher });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Add this new route
router.get("/student-progress/:studentEmail", async (req, res) => {
  try {
    const { studentEmail } = req.params;
    const { teacherEmail } = req.query;

    // Find teacher to get their mock tests
    const teacher = await Teacher.findOne({ email: teacherEmail });
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    // Get all quiz answers for this student
    const quizAnswers = await QuizAnswer.aggregate([
      {
        $match: { email: studentEmail }
      },
      {
        $lookup: {
          from: 'mocktests',
          localField: 'mockTestId',
          foreignField: '_id',
          as: 'mockTest'
        }
      },
      {
        $unwind: '$mockTest'
      },
      {
        $match: {
          'mockTest.email': teacherEmail
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'email',
          foreignField: 'email',
          as: 'userDetails'
        }
      },
      {
        $unwind: '$userDetails'
      },
      {
        $project: {
          mockTestTitle: '$mockTest.title',
          score: 1,
          totalMarks: '$mockTest.totalMarks',
          createdAt: 1,
          studentName: '$userDetails.name',
          attempts: 1,
          percentageScore: 1,
          description: '$mockTest.description'
        }
      },
      {
        $sort: { createdAt: -1 }
      }
    ]);

    // Get completed classes count
    const completedClasses = await Class.aggregate([
      {
        $match: {
          teacherEmail: teacherEmail,
          'completedBy.studentEmail': studentEmail
        }
      },
      {
        $project: {
          topic: 1,
          subTopic: 1,
          completedAt: {
            $filter: {
              input: '$completedBy',
              as: 'completion',
              cond: { $eq: ['$$completion.studentEmail', studentEmail] }
            }
          }
        }
      }
    ]);

    // Get total classes by this teacher
    const totalClasses = await Class.countDocuments({ teacherEmail });

    res.json({ 
      progress: quizAnswers,
      classProgress: {
        completed: completedClasses.length,
        total: totalClasses,
        details: completedClasses
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Add feedback for a teacher
router.post("/teacher-feedback/:teacherId", async (req, res) => {
  try {
    const { teacherId } = req.params;
    const { studentEmail, feedback, rating } = req.body;

    if (!studentEmail || !feedback || !rating) {
      return res.status(400).json({ error: "Student email, feedback, and rating are required" });
    }

    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    // Add feedback to the teacher document
    teacher.feedback = teacher.feedback || [];
    teacher.feedback.push({
      studentEmail,
      feedback,
      rating,
      timestamp: new Date()
    });

    await teacher.save();

    res.json({ message: "Feedback submitted successfully" });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ error: "Failed to submit feedback" });
  }
});

module.exports = router;
