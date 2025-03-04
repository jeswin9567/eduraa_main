const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Chat = require('../model/Chat');
const Course = require('../model/courses');
const MockTest = require('../model/Mocktest');
const Teacher = require('../model/Teacher');
const LiveClass = require('../model/liveClass');
const rateLimit = require('express-rate-limit');
const NodeCache = require('node-cache');
const dotenv = require('dotenv');
const ScholarShipModel = require('../model/scholarship');
const Entrance = require('../model/Entrance');
const StudentLoanModel = require('../model/StudentLoan');

dotenv.config();

// Configure Gemini with the correct model name
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" }); // Changed model name

// Cache website data for 5 minutes
const websiteDataCache = new NodeCache({ stdTTL: 300 });

// Rate limit to 20 requests per minute
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20
});

router.use(limiter);

router.post('/ai-chat', async (req, res) => {
  try {
    const { message } = req.body;
    const websiteData = await getWebsiteData();

    // Create the request payload with enhanced context
    const requestData = {
      contents: [{
        parts: [{
          text: `You are a helpful assistant for an educational website. 
          Here is the current information about our website:
          
          Courses Available: ${websiteData.courses}
          Mock Tests: ${websiteData.mockTests}
          Class Schedules: ${websiteData.schedules}
          Teachers: ${websiteData.teachers}
          Scholarships: ${websiteData.scholarships}
          Entrance Exams: ${websiteData.entrances}
          Student Loans: ${websiteData.loans}
          
          Instructions for responding:
          - Always start with a title line followed by two blank lines
          - List each item on its own line with a blank line between items
          - Number each item when listing multiple things
          - Format like this example:
            
            Here is a list of entrance exams:


            1. LBS for BSc Nursing Post Basic:
               Education - Undergraduate, Exam Type - Medical

            2. sample:
               Education - +2, Exam Type - Medical

          Please provide responses in this exact format.
          
          User question: ${message}`
        }]
      }]
    };

    // Generate response using Gemini
    const result = await model.generateContent(requestData);
    const response = result.response.text();

    // Store the conversation with proper userId handling
    const userId = req.user ? req.user._id.toString() : 'anonymous';
    
    await Chat.findOneAndUpdate(
      { userId: userId },
      { 
        $push: { 
          messages: [
            { content: message, sender: 'user' },
            { content: response, sender: 'ai' }
          ] 
        } 
      },
      { upsert: true }
    );

    res.json({
      response: response
    });

  } catch (error) {
    console.error('Error in AI chat:', error);
    res.status(500).json({ 
      error: 'Error processing your request',
      details: error.message 
    });
  }
});

// Function to fetch current data from your models
async function getWebsiteData() {
  const cachedData = websiteDataCache.get('websiteData');
  if (cachedData) return cachedData;

  try {
    // Get courses information
    const courses = await Course.find({}).lean();
    const courseInfo = courses.map(course => ({
      name: course.name,
      description: course.description,
      topics: course.topics
    }));

    // Get mock tests information
    const mockTests = await MockTest.find({}).lean();
    const mockTestInfo = mockTests.map(test => ({
      title: test.title,
      subject: test.subject,
      duration: test.duration
    }));

    // Get schedules information
    const schedules = await LiveClass.find({}).lean();
    const scheduleInfo = schedules.map(schedule => ({
      className: schedule.className,
      time: schedule.scheduledTime,
      date: schedule.scheduledDate
    }));

    // Get teachers information
    const teachers = await Teacher.find({}).lean();
    const teacherInfo = teachers.map(teacher => ({
      name: teacher.name,
      subjects: teacher.subjects,
      expertise: teacher.expertise
    }));

    // Get scholarship information
    const scholarships = await ScholarShipModel.find({}).lean();
    const scholarshipInfo = scholarships.map(scholarship => ({
      name: scholarship.name,
      description: scholarship.description,
      eligibility: scholarship.eligibility,
      award: scholarship.award
    }));

    // Get entrance exam information
    const entrances = await Entrance.find({}).lean();
    const entranceInfo = entrances.map(entrance => ({
      name: entrance.name,
      details: entrance.details,
      education: entrance.education,
      examType: entrance.examType
    }));

    // Get student loan information
    const loans = await StudentLoanModel.find({}).lean();
    const loanInfo = loans.map(loan => ({
      loanName: loan.loanName,
      bankName: loan.bankName,
      loanType: loan.loanType,
      minAmount: loan.minAmount,
      maxAmount: loan.maxAmount
    }));

    const data = {
      courses: JSON.stringify(courseInfo),
      mockTests: JSON.stringify(mockTestInfo),
      schedules: JSON.stringify(scheduleInfo),
      teachers: JSON.stringify(teacherInfo),
      scholarships: JSON.stringify(scholarshipInfo),
      entrances: JSON.stringify(entranceInfo),
      loans: JSON.stringify(loanInfo)
    };

    websiteDataCache.set('websiteData', data);
    return data;
  } catch (error) {
    console.error('Error fetching website data:', error);
    return {
      courses: '[]',
      mockTests: '[]',
      schedules: '[]',
      teachers: '[]',
      scholarships: '[]',
      entrances: '[]',
      loans: '[]'
    };
  }
}

// Add a test route to verify the API is working
router.get('/test', (req, res) => {
  res.json({ message: 'AI Chat API is working' });
});

module.exports = router; 