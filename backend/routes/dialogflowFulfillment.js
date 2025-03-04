const express = require('express');
const router = express.Router();
const Course = require('../model/courses');
const MockTest = require('../model/Mocktest');

router.post('/fulfillment', async (req, res) => {
  const intent = req.body.queryResult.intent.displayName;
  
  switch (intent) {
    case 'courses.info':
      const courses = await Course.find({});
      const courseList = courses.map(c => c.name).join(', ');
      res.json({
        fulfillmentText: `We offer the following courses: ${courseList}`
      });
      break;
      
    case 'courses.info.specific':
      const courseName = req.body.queryResult.parameters.course_name;
      const course = await Course.findOne({ name: courseName });
      if (course) {
        res.json({
          fulfillmentText: `${course.name} covers: ${course.description}`
        });
      }
      break;
      
    // Add more cases for other intents
  }
}); 