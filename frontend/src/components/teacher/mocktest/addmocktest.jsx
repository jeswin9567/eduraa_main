import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios'; // For making API requests
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './addmocktest.css';
import * as XLSX from 'xlsx';

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

  const [existingTitles, setExistingTitles] = useState([]);
  const [isManualTitle, setIsManualTitle] = useState(true);
  const teacherEmail = localStorage.getItem('userEmail');

  const [excelFile, setExcelFile] = useState(null);
  const [excelError, setExcelError] = useState('');

  useEffect(() => {
    const fetchEntranceExams = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/viewentr/teacher-assigned-entrances`,
          {
            headers: {
              email: teacherEmail
            }
          }
          ); 
          // 
          // // Adjust URL to your API endpoint
        setEntranceExams(response.data);
      } catch (error) {
        console.error('Error fetching entrance exams:', error);
      }
    };
    fetchEntranceExams();
  }, []);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const email = localStorage.getItem('userEmail');
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/mocktest/teacher-topics?email=${email}`);
        setExistingTitles(response.data);
      } catch (error) {
        console.error('Error fetching topics:', error);
      }
    };

    fetchTopics();
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

  const handleExcelUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file extension
    const fileExt = file.name.split('.').pop().toLowerCase();
    if (!['xlsx', 'xls'].includes(fileExt)) {
      setExcelError('Please upload only Excel files (.xlsx or .xls)');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        if (jsonData.length === 0) {
          setExcelError('Excel file is empty');
          return;
        }

        // Set test details from the first row
        const firstRow = jsonData[0];
        setTotalMarks(parseInt(firstRow.totalMarks) || 1);
        setPassingMarks(parseInt(firstRow.passingMarks) || 1);
        setDuration(parseInt(firstRow.duration) || 1);

        // Transform Excel data to match questions format
        const transformedQuestions = jsonData.map(row => ({
          questionText: row.questionText || '',
          marks: parseInt(row.marks) || 1,
          options: [
            { optionText: row.option1 || '', isCorrect: row.correctOption === 1 },
            { optionText: row.option2 || '', isCorrect: row.correctOption === 2 },
            { optionText: row.option3 || '', isCorrect: row.correctOption === 3 },
            { optionText: row.option4 || '', isCorrect: row.correctOption === 4 }
          ],
          steps: row.steps ? row.steps.split(';') : ['']
        }));

        setQuestions(transformedQuestions);
        setNumberOfQuestions(transformedQuestions.length);
        setExcelError('');
      } catch (error) {
        setExcelError('Error processing Excel file. Please check the format.');
        console.error('Excel processing error:', error);
      }
    };
    reader.readAsArrayBuffer(file);
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
        `${import.meta.env.VITE_API_URL}/mocktest/teacheraddMockTest`, 
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

  const downloadSampleExcel = () => {
    // Sample data
    const sampleData = [
      {
        totalMarks: 10,          // Total marks for the test
        passingMarks: 4,         // Passing marks for the test
        duration: 30,            // Duration in minutes
        questionText: "What is 2 + 2?",
        marks: 1,
        option1: "3",
        option2: "4",
        option3: "5",
        option4: "6",
        correctOption: 2,
        steps: "First identify the numbers;Add the numbers together;Verify the answer"
      },
      {
        totalMarks: 10,          // Same total marks for all rows
        passingMarks: 4,         // Same passing marks for all rows
        duration: 30,            // Same duration for all rows
        questionText: "What is the capital of France?",
        marks: 2,
        option1: "London",
        option2: "Paris",
        option3: "Berlin",
        option4: "Madrid",
        correctOption: 2,
        steps: "Look at the map of Europe;Find France;Identify its capital city"
      },
      {
        totalMarks: 10,          // Same total marks for all rows
        passingMarks: 4,         // Same passing marks for all rows
        duration: 30,            // Same duration for all rows
        questionText: "Which planet is known as the Red Planet?",
        marks: 1,
        option1: "Venus",
        option2: "Jupiter",
        option3: "Mars",
        option4: "Saturn",
        correctOption: 3,
        steps: "Think about planet colors;Remember Mars appears red;Identify the correct option"
      }
    ];

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(sampleData);

    // Add column widths
    ws['!cols'] = [
      { wch: 12 }, // totalMarks
      { wch: 12 }, // passingMarks
      { wch: 10 }, // duration
      { wch: 40 }, // questionText
      { wch: 8 },  // marks
      { wch: 20 }, // option1
      { wch: 20 }, // option2
      { wch: 20 }, // option3
      { wch: 20 }, // option4
      { wch: 15 }, // correctOption
      { wch: 50 }  // steps
    ];

    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sample Questions");

    // Save file
    XLSX.writeFile(wb, "mocktest_template.xlsx");
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
          <div className="title-input-container">
            <select
              className="teachermocktest-input"
              onChange={(e) => {
                if (e.target.value === "manual") {
                  setIsManualTitle(true);
                  setTitle('');
                } else {
                  setIsManualTitle(false);
                  setTitle(e.target.value);
                  setTitleError('');
                }
              }}
              value={isManualTitle ? "manual" : title}
              required
            >
              <option value="manual">Select Topic</option>
              {existingTitles.map((topic, index) => (
                <option key={index} value={topic}>
                  {topic}
                </option>
              ))}
            </select>
          </div>
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

      <div className="teachermocktest-field">
        <label className="teachermocktest-label">Or Upload Excel File:</label>
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleExcelUpload}
          className="teachermocktest-input"
        />
        {excelError && <p className="teachermocktest-error">{excelError}</p>}
        <div className="teachermocktest-field">
          <button
            type="button"
            onClick={downloadSampleExcel}
            className="teachermocktest-download-template"
            style={{
              backgroundColor: '#4CAF50',
              color: 'white',
              padding: '10px 15px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '10px'
            }}
          >
            Download Sample Excel Template
          </button>
          <div className="teachermocktest-template-info" style={{ marginTop: '10px', fontSize: '0.9em' }}>
            <p><strong>Excel Template Format:</strong></p>
            <ul style={{ paddingLeft: '20px' }}>
              <li>totalMarks: Total marks for the test</li>
              <li>passingMarks: Minimum marks required to pass</li>
              <li>duration: Test duration in minutes</li>
              <li>questionText: The question to be asked</li>
              <li>marks: Points for the question (number)</li>
              <li>option1, option2, option3, option4: Multiple choice options</li>
              <li>correctOption: Number (1-4) indicating the correct answer</li>
              <li>steps: Solution steps separated by semicolons (;)</li>
            </ul>
          </div>
        </div>
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
