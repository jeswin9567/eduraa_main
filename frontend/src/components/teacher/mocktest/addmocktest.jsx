import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios'; // For making API requests
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './addmocktest.css';

const TeacherMocktest = () => { 
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState(1);
  const [totalMarks, setTotalMarks] = useState(1);
  const [passingMarks, setPassingMarks] = useState(1);
  const [numberOfQuestions, setNumberOfQuestions] = useState(1);
  const [questions, setQuestions] = useState([
    { questionText: '', marks: 1, options: [{ optionText: '', isCorrect: false }], steps: [''] }
  ]);
  const [entranceExams, setEntranceExams] = useState([]); // Entrance exams from the backend
  const [selectedEntranceExam, setSelectedEntranceExam] = useState(''); // Selected entrance exam
  const [message, setMessage] = useState(''); // For success or error messages
  const [error, setError] = useState(''); // For validation errors

  const [titleError, setTitleError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [durationError, setDurationError] = useState('');
  const [totalMarksError, setTotalMarksError] = useState('');
  const [passingMarksError, setPassingMarksError] = useState('');
  const [questionsError, setQuestionsError] = useState('');
  const [entranceExamError, setEntranceExamError] = useState('');

  const [questionImages, setQuestionImages] = useState({});

  useEffect(() => {
    const fetchEntranceExams = async () => {
      try {
        const response = await axios.get('http://localhost:5000/viewentr'); // Adjust URL to your API endpoint
        setEntranceExams(response.data);
      } catch (error) {
        console.error('Error fetching entrance exams:', error);
      }
    };
    fetchEntranceExams();
  }, []);

  const calculateTotalAssignedMarks = () => {
    return questions.reduce((total, question) => total + parseInt(question.marks || 0, 10), 0);
  };

  const addQuestion = () => {
    if (questions.length >= numberOfQuestions) {
      setError(`You can only add ${numberOfQuestions} questions.`);
      return;
    }
    setQuestions([...questions, { questionText: '', marks: 1, options: [{ optionText: '', isCorrect: false }], steps: [''] }]);
    setError(''); // Clear error when a question is added
  };

  const addOption = (index) => {
    const newQuestions = [...questions];
    newQuestions[index].options.push({ optionText: '', isCorrect: false });
    setQuestions(newQuestions);
  };

  const validateForm = () => {
    let valid = true;

    if (!title || /^[^a-zA-Z]*$/.test(title)) {
      setTitleError('Title must contain letters and cannot consist of only numbers or special characters.');
      valid = false;
    } else {
      setTitleError('');
    }

    if (!description || /^[^a-zA-Z]*$/.test(description)) {
      setDescriptionError('Description must contain letters and cannot consist of only numbers or special characters.');
      valid = false;
    } else {
      setDescriptionError('');
    }

    if (duration < 1) {
      setDurationError('Duration must be at least 1 minute');
      valid = false;
    } else {
      setDurationError('');
    }

    if (totalMarks < 1) {
      setTotalMarksError('Total marks must be at least 1');
      valid = false;
    } else {
      setTotalMarksError('');
    }

    if (passingMarks < 1) {
      setPassingMarksError('Passing marks must be at least 1');
      valid = false;
    } else {
      setPassingMarksError('');
    }

    if (numberOfQuestions < 1) {
      setQuestionsError('Number of questions must be at least 1');
      valid = false;
    } else {
      setQuestionsError('');
    }

    if (!selectedEntranceExam) {
      setEntranceExamError('You must select an entrance exam');
      valid = false;
    } else {
      setEntranceExamError('');
    }

    return valid;
  };

  const hasDuplicateQuestions = () => {
    const questionTexts = questions.map((q) => q.questionText);
    const uniqueQuestions = new Set(questionTexts);
    return uniqueQuestions.size !== questionTexts.length;
  };

  const handleImageUpload = (e, questionIndex) => {
    const file = e.target.files[0];
    if (file) {
      setQuestionImages(prev => ({
        ...prev,
        [questionIndex]: file
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = localStorage.getItem('userEmail');

    if (!validateForm()) {
      return;
    }

    const totalAssignedMarks = calculateTotalAssignedMarks();

    if (totalAssignedMarks !== totalMarks) {
      setError(`The sum of the marks assigned to questions (${totalAssignedMarks}) does not match the total marks (${totalMarks}).`);
      return;
    }

    if (hasDuplicateQuestions()) {
      setError('Duplicate questions are not allowed.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('duration', duration);
      formData.append('totalMarks', totalMarks);
      formData.append('passingMarks', passingMarks);
      formData.append('numberOfQuestions', numberOfQuestions);
      formData.append('entranceExam', selectedEntranceExam);
      formData.append('email', email);
      formData.append('questions', JSON.stringify(questions));

      // Append any question images
      Object.entries(questionImages).forEach(([index, file]) => {
        formData.append('questionImages', file, `${index}-questionimage`);
      });

      const response = await axios.post(
        'http://localhost:5000/mocktest/teacheraddMockTest', 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setMessage('Mock test created successfully!');
      setError('');

      await Swal.fire({
        title: 'Success!',
        text: 'Mock test created successfully!',
        icon: 'success',
        confirmButtonText: 'OK'
      });

      navigate('/teacherhome');
    } catch (error) {
      console.error('Error creating mock test:', error);
      if (error.response && error.response.status === 400) {
        setError(error.response.data.message);
      } else {
        setMessage('Error creating mock test. Please try again.');
      }
    }
  };

  return (
    <div className='teachermocktest-container'>
      <form className="teachermocktest-form" onSubmit={handleSubmit}>
        <h2 className="teachermocktest-title">Create a Mock Test</h2>

        {/* Entrance Exam Selection */}
        <div className="teachermocktest-field">
          <label className="teachermocktest-label">Select Entrance Exam:</label>
          <select
            className="teachermocktest-input"
            value={selectedEntranceExam}
            onChange={(e) => {
              setSelectedEntranceExam(e.target.value);
              if (!e.target.value) {
                setEntranceExamError('You must select an entrance exam');
              } else {
                setEntranceExamError('');
              }
            }}
            required
          >
            <option value="" className='teachermocktest-select'>-- Select Entrance Exam --</option>
            {entranceExams.map((exam) => (
              <option key={exam._id} value={exam._id}>
                {exam.name}
              </option>
            ))}
          </select>
          {entranceExamError && <p className="teachermocktest-error">{entranceExamError}</p>}
        </div>

        {/* Title Field */}
        <div className="teachermocktest-field">
          <label className="teachermocktest-label">Title:</label>
          <input
            className="teachermocktest-input"
            type="text"
            value={title}
            onChange={(e) => {
              const value = e.target.value;
              setTitle(value);
              if (!value || /^[^a-zA-Z]*$/.test(value)) {
                setTitleError('Title must contain letters and cannot consist of only numbers or special characters.');
              } else {
                setTitleError('');
              }
            }}
            required
          />
          {titleError && <p className="teachermocktest-error">{titleError}</p>}
        </div>

        {/* Description Field */}
        <div className="teachermocktest-field">
          <label className="teachermocktest-label">Description:</label>
          <textarea
            className="teachermocktest-textarea"
            value={description}
            onChange={(e) => {
              const value = e.target.value;
              setDescription(value);
              if (!value || /^[^a-zA-Z]*$/.test(value)) {
                setDescriptionError('Description must contain letters and cannot consist of only numbers or special characters.');
              } else {
                setDescriptionError('');
              }
            }}
            required
          />
          {descriptionError && <p className="teachermocktest-error">{descriptionError}</p>}
        </div>

      <div className="teachermocktest-field">
        <label className="teachermocktest-label">Duration (minutes):</label>
        <input
          className="teachermocktest-input"
          type="number"
          value={duration}
          onChange={(e) => {
            const newValue = Math.max(1, e.target.value);
            setDuration(newValue);
            if (newValue < 1) {
              setDurationError('Duration must be at least 1 minute');
            } else {
              setDurationError('');
            }
          }}
          required
        />
        {durationError && <p className="teachermocktest-error">{durationError}</p>}
      </div>

      <div className="teachermocktest-field">
        <label className="teachermocktest-label">Total Marks:</label>
        <input
          className="teachermocktest-input"
          type="number"
          value={totalMarks}
          onChange={(e) => {
            const newValue = Math.max(1, e.target.value);
            setTotalMarks(newValue);
            if (newValue < 1) {
              setTotalMarksError('Total marks must be at least 1');
            } else {
              setTotalMarksError('');
            }
          }}
          required
        />
        {totalMarksError && <p className="teachermocktest-error">{totalMarksError}</p>}
      </div>

      <div className="teachermocktest-field">
        <label className="teachermocktest-label">Passing Marks:</label>
        <input
          className="teachermocktest-input"
          type="number"
          value={passingMarks}
          onChange={(e) => {
            const newValue = Math.max(1, e.target.value);
            setPassingMarks(newValue);
            if (newValue < 1) {
              setPassingMarksError('Passing marks must be at least 1');
            } else {
              setPassingMarksError('');
            }
          }}
          required
        />
        {passingMarksError && <p className="teachermocktest-error">{passingMarksError}</p>}
      </div>

      <div className="teachermocktest-field">
        <label className="teachermocktest-label">Number of Questions:</label>
        <input
          className="teachermocktest-input"
          type="number"
          value={numberOfQuestions}
          onChange={(e) => {
            const newValue = Math.max(1, e.target.value);
            setNumberOfQuestions(newValue);
            if (newValue < 1) {
              setQuestionsError('Number of questions must be at least 1');
            } else {
              setQuestionsError('');
            }
          }}
          required
        />
        {questionsError && <p className="teachermocktest-error">{questionsError}</p>}
      </div>

      <div className="teachermocktest-questions">
        <h3 className="teachermocktest-subtitle">Questions:</h3>
        {questions.map((question, index) => (
          <div key={index} className="teachermocktest-question">
            <label className="teachermocktest-label">Question {index + 1}:</label>
            <input
              className="teachermocktest-input"
              type="text"
              value={question.questionText}
              onChange={(e) => {
                const newQuestions = [...questions];
                newQuestions[index].questionText = e.target.value;
                setQuestions(newQuestions);
              }}
              required
            />

            <label className="teachermocktest-label">Marks:</label>
            <input
              className="teachermocktest-input"
              type="number"
              value={question.marks}
              onChange={(e) => {
                const newQuestions = [...questions];
                newQuestions[index].marks = Math.max(1, e.target.value);
                setQuestions(newQuestions);
              }}
              required
            />

            {/* Steps Section */}
            <h4>Steps to solve the question:</h4>
            {question.steps.map((step, stepIndex) => (
              <div key={stepIndex} className="teachermocktest-step">
                <label className="teachermocktest-label">Step {stepIndex + 1}:</label>
                <input
                  className="teachermocktest-input"
                  type="text"
                  value={step}
                  onChange={(e) => {
                    const newQuestions = [...questions];
                    newQuestions[index].steps[stepIndex] = e.target.value;
                    setQuestions(newQuestions);
                  }}
                  required
                />
              </div>
            ))}
            <button
              type="button"
              className="teachermocktest-add-step"
              onClick={() => {
                const newQuestions = [...questions];
                newQuestions[index].steps.push('');
                setQuestions(newQuestions);
              }}
            >
              Add Step
            </button>

            {/* Options Section */}
            <h4>Options:</h4>
            {question.options.map((option, optionIndex) => (
              <div key={optionIndex} className="teachermocktest-option">
                <input
                  className="teachermocktest-input"
                  type="text"
                  value={option.optionText}
                  onChange={(e) => {
                    const newQuestions = [...questions];
                    newQuestions[index].options[optionIndex].optionText = e.target.value;
                    setQuestions(newQuestions);
                  }}
                  required
                />
                <label className="teachermocktest-label">
                  Correct:
                  <input
                    className="teachermocktest-checkbox"
                    type="checkbox"
                    checked={option.isCorrect}
                    onChange={(e) => {
                      const newQuestions = [...questions];
                      newQuestions[index].options[optionIndex].isCorrect = e.target.checked;
                      setQuestions(newQuestions);
                    }}
                  />
                </label>
              </div>
            ))}
            <button type="button" className="teachermocktest-add-option" onClick={() => addOption(index)}>
              Add Option
            </button>

            {/* Add image upload input */}
            <div className="teachermocktest-field">
              <label className="teachermocktest-label">Question Image (Optional):</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, index)}
                className="teachermocktest-input"
              />
              {questionImages[index] && (
                <img 
                  src={URL.createObjectURL(questionImages[index])} 
                  alt="Question preview" 
                  style={{ maxWidth: '200px', marginTop: '10px' }}
                />
              )}
            </div>
          </div>
        ))}

        <button type="button" className="teachermocktest-add-question" onClick={addQuestion}>
          Add Question
        </button>
      </div>

      {error && <p className="teachermocktest-error">{error}</p>}
      {message && <p className="teachermocktest-success">{message}</p>}

      <button className="teachermocktest-submit" type="submit">Create Mock Test</button>
    </form>
    </div>
  );
};

export default TeacherMocktest;
