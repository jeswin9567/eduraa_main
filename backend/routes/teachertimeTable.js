const express = require('express');
const router = express.Router();
const TeacherTimetable = require('../model/TeacherTimetable');
const Teacher = require('../model/Teacher');
const User = require('../model/User');

// Get all active teachers
router.get('/teachers', async (req, res) => {
  try {
    // Get all active teachers with their IDs
    const teachers = await Teacher.find({ active: true }).select('_id firstname lastname email');
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all teachers with their timetables
router.get('/timetables', async (req, res) => {
  try {
    const timetables = await TeacherTimetable.find().populate('teacherId', 'firstname lastname email');
    res.json(timetables);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get timetable for a specific teacher
router.get('/timetable/:teacherId', async (req, res) => {
  try {
    // First check if teacher exists
    const teacher = await Teacher.findById(req.params.teacherId);
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    // Get teacher's timetable or create empty one if doesn't exist
    let timetable = await TeacherTimetable.findOne({ teacherId: req.params.teacherId });
    
    if (!timetable) {
      // If no timetable exists, return empty timeSlots array
      return res.json({ 
        teacherId: req.params.teacherId,
        teacherName: `${teacher.firstname} ${teacher.lastname}`,
        teacherEmail: teacher.email,
        timeSlots: [] 
      });
    }

    res.json(timetable);
  } catch (error) {
    console.error('Error fetching timetable:', error);
    res.status(500).json({ message: error.message });
  }
});

// Add this helper function at the top of the file
const hasStudentConflict = async (teacherId, timeSlot) => {
  try {
    // Get the teacher and populate assigned students
    const teacher = await Teacher.findById(teacherId)
      .populate('assignedStudents', 'name email'); // Populate with student name and email

    if (!teacher || !teacher.assignedStudents || teacher.assignedStudents.length === 0) {
      return false;
    }

    // Get all teachers who share students with this teacher and populate their students
    const teachersWithSharedStudents = await Teacher.find({
      _id: { $ne: teacherId },
      assignedStudents: { $in: teacher.assignedStudents.map(s => s._id) }
    }).populate('assignedStudents', 'name email');

    if (!teachersWithSharedStudents.length) {
      return false;
    }

    // Get timetables for all teachers with shared students
    const timetables = await TeacherTimetable.find({
      teacherId: { $in: teachersWithSharedStudents.map(t => t._id) }
    });

    // Check for time conflicts
    for (const timetable of timetables) {
      for (const existingSlot of timetable.timeSlots) {
        const daysOverlap = timeSlot.days.some(day => 
          existingSlot.days.includes(day)
        );

        if (daysOverlap) {
          const newStart = new Date(`2000-01-01 ${timeSlot.startTime}`);
          const newEnd = new Date(`2000-01-01 ${timeSlot.endTime}`);
          const existingStart = new Date(`2000-01-01 ${existingSlot.startTime}`);
          const existingEnd = new Date(`2000-01-01 ${existingSlot.endTime}`);

          if (newStart < existingEnd && newEnd > existingStart) {
            const conflictingTeacher = await Teacher.findById(timetable.teacherId);
            
            // Find common students using the populated data
            const commonStudents = teacher.assignedStudents.filter(student1 => 
              teachersWithSharedStudents.find(t => t._id.equals(timetable.teacherId))
                .assignedStudents.some(student2 => student2._id.equals(student1._id))
            );

            // Format the error message with student details
            const studentList = commonStudents.map(student => 
              `• ${student.name} (${student.email})`
            ).join('\n');

            throw new Error(
              `⚠️ Schedule Conflict Detected!\n\n` +
              `Unable to schedule this time slot due to a conflict with another teacher's schedule:\n\n` +
              `Teacher Information:\n` +
              `• ${conflictingTeacher.firstname} ${conflictingTeacher.lastname}\n` +
              `• Email: ${conflictingTeacher.email}\n\n` +
              `Conflicting Schedule:\n` +
              `• Days: ${existingSlot.days.join(', ')}\n` +
              `• Time: ${existingSlot.startTime} - ${existingSlot.endTime}\n` +
              `• Topic: ${existingSlot.topic}\n\n` +
              `Common Students Affected:\n${studentList}\n\n` +
              `Please choose a different time slot to avoid scheduling conflicts for these students.`
            );
          }
        }
      }
    }

    return false;
  } catch (error) {
    throw error;
  }
};

// Update the POST route to include student conflict check
router.post('/timetable', async (req, res) => {
  try {
    const { teacherId, timeSlots } = req.body;

    // Find teacher
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    // Check for time slot conflicts within the same teacher's schedule
    const hasConflict = timeSlots.some((slot1, index1) => {
      return timeSlots.some((slot2, index2) => {
        if (index1 === index2) return false;
        
        const daysOverlap = slot1.days.some(day => slot2.days.includes(day));
        if (!daysOverlap) return false;

        const start1 = new Date(`2000-01-01 ${slot1.startTime}`);
        const end1 = new Date(`2000-01-01 ${slot1.endTime}`);
        const start2 = new Date(`2000-01-01 ${slot2.startTime}`);
        const end2 = new Date(`2000-01-01 ${slot2.endTime}`);

        return (start1 < end2 && end1 > start2);
      });
    });

    if (hasConflict) {
      return res.status(400).json({ 
        message: `⚠️ Schedule Conflict!\n\n` +
                `The selected time slots overlap with each other. ` +
                `Please ensure that the time slots for this teacher don't overlap on the same days.`
      });
    }

    // Check for conflicts with other teachers who share students
    for (const timeSlot of timeSlots) {
      try {
        await hasStudentConflict(teacherId, timeSlot);
      } catch (error) {
        return res.status(400).json({ message: error.message });
      }
    }

    // If no conflicts, create or update timetable
    const timetable = await TeacherTimetable.findOneAndUpdate(
      { teacherId },
      {
        teacherId,
        teacherName: `${teacher.firstname} ${teacher.lastname}`,
        teacherEmail: teacher.email,
        timeSlots,
        updatedAt: Date.now()
      },
      { new: true, upsert: true }
    );

    res.status(201).json(timetable);
  } catch (error) {
    console.error('Error creating/updating timetable:', error);
    res.status(400).json({ message: error.message });
  }
});

// Delete a time slot
router.delete('/timetable/:teacherId/slot/:slotId', async (req, res) => {
  try {
    const timetable = await TeacherTimetable.findOne({ teacherId: req.params.teacherId });
    if (!timetable) {
      return res.status(404).json({ message: 'Timetable not found' });
    }

    timetable.timeSlots = timetable.timeSlots.filter(
      slot => slot._id.toString() !== req.params.slotId
    );
    await timetable.save();

    res.json(timetable);
  } catch (error) {
    console.error('Error deleting time slot:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 