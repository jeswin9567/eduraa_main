const express = require('express');
const router = express.Router();
const MockTest = require('../model/Mocktest'); // Assuming the MockTest model is in the 'models' folder
const Entrance = require('../model/Entrance');
const Teacher = require('../model/Teacher')
const User = require('../model/User');
const upload = require('../config/multerStorage');
const QuizAnswer = require('../model/quiz');
const Class = require('../model/courses');

//teacher add mocktest
router.post('/teacheraddMockTest', upload.array('questionImages', 10), async (req, res) => {
  try {
    const {
      title,
      description,
      duration,
      totalMarks,
      numberOfQuestions,
      passingMarks,
      entranceExam,
      email
    } = req.body;

    // Verify that the title (topic) exists in the Course model
    const existingCourse = await Class.findOne({ 
      teacherEmail: email,
      topic: title 
    });

    if (!existingCourse) {
      return res.status(400).json({ 
        message: 'Selected topic does not exist in your courses' 
      });
    }

    // Parse the questions from the request body
    const questions = JSON.parse(req.body.questions);

    // If images were uploaded, assign them to their respective questions
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        const questionIndex = file.originalname.split('-')[0]; // Assuming format: "index-questionimage"
        if (questions[questionIndex]) {
          questions[questionIndex].questionImage = file.path;
        }
      });
    }

    // Check if the entrance exam exists
    const exam = await Entrance.findById(entranceExam);
    if (!exam) {
      return res.status(404).json({ message: 'Entrance exam not found' });
    }

    // Fetch the teacher's name using the teacherId
    const teacher = await Teacher.findOne({email});
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    const subject = teacher.subjectassigned;
    // Combine teacher's firstname and lastname to get the full name
    const teacherFullName = `${teacher.firstname} ${teacher.lastname}`;
    console.log(teacherFullName);

    // Check for duplicate mock test by title within the same entrance exam
    const existingMockTest = await MockTest.findOne({ description, examId: entranceExam });
    if (existingMockTest) {
      return res.status(400).json({ message: 'A mock test with this title already exists for the selected entrance exam.' });
    }

    // Create the mock test with the updated questions array
    const mockTest = new MockTest({
      examId: entranceExam,
      title,
      description,
      duration,
      totalMarks,
      numberOfQuestions,
      passingMarks,
      questions,
      email,
      subject,
      teacherName: teacherFullName
    });

    // Save the mock test and link it to the entrance exam
    const savedMockTest = await mockTest.save();

    // Add the new mock test to the entrance exam
    exam.mockTests.push(savedMockTest._id);
    await exam.save();

    res.status(201).json(savedMockTest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// get number of mocktest
router.get('/mocktest-status', async (req, res) => {
  try {
      const { email } = req.query;
      if (!email) {
          return res.status(400).json({ message: 'Email is required' });
      }

      const activeMockTests = await MockTest.countDocuments({ email, status: true });
      const nonActiveMockTests = await MockTest.countDocuments({ email, status: false });

      res.status(200).json({ activeMockTests, nonActiveMockTests });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
  }
});


// Create a new mock test
router.post('/addMockTest', async (req, res) => {
  try {
    const {
      title,
      description,
      duration,
      totalMarks,
      numberOfQuestions,
      passingMarks,
      questions,
      entranceExam // Assuming this is the entrance exam's ID
    } = req.body;

    // Check if the entrance exam exists
    const exam = await Entrance.findById(entranceExam);
    if (!exam) {
      return res.status(404).json({ message: 'Entrance exam not found' });
    }

    // Check for duplicate mock test by title within the same entrance exam
    const existingMockTest = await MockTest.findOne({ title, examId: entranceExam });
    if (existingMockTest) {
      return res.status(400).json({ message: 'A mock test with this title already exists for the selected entrance exam.' });
    }

    // Create the mock test
    const mockTest = new MockTest({
      examId: entranceExam,
      title,
      description,
      duration,
      totalMarks,
      numberOfQuestions,
      passingMarks,
      questions
    });

    // Save the mock test and link it to the entrance exam
    const savedMockTest = await mockTest.save();

    // Add the new mock test to the entrance exam
    exam.mockTests.push(savedMockTest._id);
    await exam.save();

    res.status(201).json(savedMockTest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// Get all mock tests with entrance exam details
router.get('/mockTests', async (req, res) => {
  try {
    const mockTests = await MockTest.find().populate('examId', 'name details'); // Populate entrance exam name and details
    res.json(mockTests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// Get all mock tests for a specific entrance exam
router.get('/viewmocktests/:examId', async (req, res) => { 
  try {
    const { examId } = req.params;

    // Find the entrance exam and populate its mock tests with status true
    const entranceExam = await Entrance.findById(examId)
      .populate({
        path: 'mockTests',
        match: { status: true }  // Filter to only include mock tests with status true
      });

    if (!entranceExam) {
      return res.status(404).json({ message: 'Entrance exam not found' });
    }

    res.json(entranceExam.mockTests); // Return the filtered mock tests
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// teacher mocktest view

router.get('/teacherviewmocktests/:examId', async (req, res) => { 
  try {
    const { examId } = req.params;
    const email = req.headers.email; // Retrieve email from the request headers

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Find the entrance exam and populate its mock tests with the email filter and status true
    const entranceExam = await Entrance.findById(examId)
      .populate({
        path: 'mockTests',
        match: { email, status: true }, // Filter by email and status true
      });

    if (!entranceExam) {
      return res.status(404).json({ message: 'Entrance exam not found' });
    }

    res.json(entranceExam.mockTests); // Return the filtered mock tests
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});


// route to get deleted mocktest

// Route to get deleted mock tests with entrance exam details
router.get('/deletedmocktests', async (req, res) => { 
  try {
    // Find deleted mock tests (status: false) and populate the examId field with the entrance exam details
    const mockTests = await MockTest.find({ status: false })
      .populate('examId', 'name'); // Populating only the 'name' field of Entrance exam

    if (mockTests.length === 0) {
      return res.status(404).json({ message: 'No deleted mock tests found' });
    }

    res.json(mockTests); // Return the populated mock tests
  } catch (error) {
    console.error('Error fetching deleted mock tests:', error);
    res.status(500).json({ message: 'Error fetching deleted mock tests' });
  }
});

// get teacher deleted mocktest

router.get('/teacherdeletedmocktests', async (req, res) => {
  try {
    const email = req.headers.email; // Extract email from headers

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Find deleted mock tests where the email matches and status is false
    const mockTests = await MockTest.find({ status: false, email: email })
      .populate('examId', 'name'); // Populate only the 'name' field of Entrance exam

    if (mockTests.length === 0) {
      return res.status(404).json({ message: 'No deleted mock tests found for this teacher' });
    }

    res.json(mockTests); // Return the filtered mock tests
  } catch (error) {
    console.error('Error fetching deleted mock tests:', error);
    res.status(500).json({ message: 'Error fetching deleted mock tests' });
  }
});



// get a mocktest for user

router.get('/umocktest/:id', async (req, res) => {
  try {
    const mockTest = await MockTest.findById(req.params.id);
    if (!mockTest) return res.status(404).json({ message: 'Mock Test not found' });
    res.json(mockTest);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});
// Get a single mock test by ID with entrance exam details
router.get('/mockTest/:id', async (req, res) => {
  try {
    const mockTest = await MockTest.findById(req.params.id).populate('examId', 'name details');
    if (!mockTest) return res.status(404).json({ message: 'Mock test not found' });
    res.json(mockTest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// Update a mock test by ID
router.put('/upmockTest/:id', upload.array('questionImages', 10), async (req, res) => {
  try {
    const { title, examId } = req.body;
    const questions = JSON.parse(req.body.questions);

    // Handle new image uploads
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        const questionIndex = file.originalname.split('-')[0];
        if (questions[questionIndex]) {
          questions[questionIndex].questionImage = file.path;
        }
      });
    }

    // Check for duplicate title
    const existingMockTest = await MockTest.findOne({
      title,
      examId,
      _id: { $ne: req.params.id },
    });

    if (existingMockTest) {
      return res.status(400).json({ message: 'A mock test with the same title already exists for this exam.' });
    }

    // Update the mock test with the new data including questions with updated images
    const updatedMockTest = await MockTest.findByIdAndUpdate(
      req.params.id,
      { ...req.body, questions },
      { new: true }
    );

    if (!updatedMockTest) {
      return res.status(404).json({ message: 'Mock test not found' });
    }

    res.json(updatedMockTest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});


// Soft delete a mock test (set its status to false)
router.delete('/mockTest/deactivate/:id', async (req, res) => {
  try {
    const deletedMockTest = await MockTest.findByIdAndUpdate(req.params.id, { status: false }, { new: true });
    if (!deletedMockTest) return res.status(404).json({ message: 'Mock test not found' });
    res.json({ message: 'Mock test deleted', mockTest: deletedMockTest });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

//enable mocktest

router.put('/enablemocktest/:id', async (req, res) => {
  try {
    const updatedMockTest = await MockTest.findByIdAndUpdate(req.params.id, {status: true}, { new: true });
    if (!updatedMockTest) return res.status(404).json({ message: 'Mock test not found' });
    res.json(updatedMockTest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// Get mocktests by subject for a specific user
router.get('/user-mocktests/:subject', async (req, res) => {
  try {
    const { subject } = req.params;
    const userEmail = req.headers.useremail;

    console.log('Subject:', subject);
    console.log('UserEmail:', userEmail);

    // Get the user with populated assigned teachers
    const user = await User.findOne({ email: userEmail }).populate({
      path: 'assignedTeacher',
      match: { subjectassigned: subject }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('Assigned Teachers:', user.assignedTeacher);

    // Get the assigned teacher emails who teach this subject
    const relevantTeacherEmails = user.assignedTeacher.map(teacher => teacher.email);

    console.log('Relevant Teacher Emails:', relevantTeacherEmails);

    if (relevantTeacherEmails.length === 0) {
      return res.json([]); // Return empty array if no relevant teachers
    }

    // Find all mocktests created by these teachers
    const mocktests = await MockTest.find({
      email: { $in: relevantTeacherEmails },
      status: true // Only active mocktests
    }).populate('examId', 'name');

    console.log('Found Mocktests:', mocktests);

    res.json(mocktests);
  } catch (error) {
    console.error('Error in user-mocktests route:', error);
    res.status(500).json({ 
      message: 'Error fetching mocktests',
      error: error.message 
    });
  }
});

// In your quiz save answers route
router.post('/saveAnswers', async (req, res) => {
  try {
    const { email, mockTestId, answers, score, course } = req.body;

    const quizAnswer = new QuizAnswer({
      email,
      mockTestId,
      answers,
      score,
      course, // Save the course field
    });

    await quizAnswer.save();
    res.status(201).json({ message: 'Quiz answers saved successfully' });
  } catch (error) {
    console.error('Error saving quiz answers:', error);
    res.status(500).json({ message: 'Error saving quiz answers' });
  }
});

// Add this new route to get titles for a specific teacher
router.get('/teacher-titles', async (req, res) => {
  try {
    const email = req.query.email;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const titles = await MockTest.find({ email })
      .distinct('title');

    res.json(titles);
  } catch (error) {
    console.error('Error fetching titles:', error);
    res.status(500).json({ message: 'Error fetching titles' });
  }
});

// Teacher Update Mock Test route
router.put('/teachupdmockTest/:id', upload.array('questionImages', 10), async (req, res) => {
  try {
    const { title, examId, email } = req.body;
    const questions = JSON.parse(req.body.questions);

    // Get teacher's subject and verify teacher
    const teacher = await Teacher.findOne({ email });
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    // Verify if this mock test belongs to this teacher
    const existingTest = await MockTest.findOne({ _id: req.params.id, email });
    if (!existingTest) {
      return res.status(403).json({ message: 'Unauthorized: This mock test does not belong to you' });
    }

    const subject = teacher.subjectassigned;
    const teacherFullName = `${teacher.firstname} ${teacher.lastname}`;

    // Handle new image uploads
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        const questionIndex = file.originalname.split('-')[0];
        if (questions[questionIndex]) {
          questions[questionIndex].questionImage = file.path;
        }
      });
    }

    // Check for duplicate title
    const existingMockTest = await MockTest.findOne({
      title,
      examId,
      _id: { $ne: req.params.id },
      email, // Only check for duplicates within teacher's tests
    });

    if (existingMockTest) {
      return res.status(400).json({ message: 'A mock test with the same title already exists for this exam.' });
    }

    // Update the mock test with the new data
    const updatedMockTest = await MockTest.findByIdAndUpdate(
      req.params.id,
      { 
        ...req.body, 
        questions,
        subject,
        teacherName: teacherFullName,
        email
      },
      { new: true }
    );

    if (!updatedMockTest) {
      return res.status(404).json({ message: 'Mock test not found' });
    }

    res.json(updatedMockTest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// Add this new route to check if user has taken a mocktest
router.get('/check-participation/:mocktestId', async (req, res) => {
  try {
    const { mocktestId } = req.params;
    const email = req.headers.useremail;

    const attempt = await QuizAnswer.findOne({ 
      mockTestId: mocktestId,
      email: email 
    });

    res.json({ 
      hasParticipated: !!attempt,
      result: attempt
    });
  } catch (error) {
    console.error('Error checking participation:', error);
    res.status(500).json({ message: 'Error checking participation status' });
  }
});

// Add this route to get topics for a specific teacher
router.get('/teacher-topics', async (req, res) => {
  try {
    const email = req.query.email;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Fetch unique topics from the Class model where teacherEmail matches
    const topics = await Class.find({ teacherEmail: email })
      .distinct('topic');

    res.json(topics);
  } catch (error) {
    console.error('Error fetching topics:', error);
    res.status(500).json({ message: 'Error fetching topics' });
  }
});

module.exports = router;
