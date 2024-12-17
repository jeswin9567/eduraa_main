const express = require('express');
const router = express.Router();
const MockTest = require('../model/Mocktest'); // Assuming the MockTest model is in the 'models' folder
const Entrance = require('../model/Entrance');

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
router.put('/upmockTest/:id', async (req, res) => {
  try {
    const { title, examId } = req.body; // Extract title and examId from the request body

    // Check if another mock test with the same title exists for the same exam (excluding the current one)
    const existingMockTest = await MockTest.findOne({
      title,
      examId, // Ensure it matches the same exam ID
      _id: { $ne: req.params.id }, // Exclude the current mock test by its ID
    });

    if (existingMockTest) {
      return res.status(400).json({ message: 'A mock test with the same title already exists for this exam.' });
    }

    // Proceed with the update if no conflict
    const updatedMockTest = await MockTest.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedMockTest) return res.status(404).json({ message: 'Mock test not found' });

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



module.exports = router;
