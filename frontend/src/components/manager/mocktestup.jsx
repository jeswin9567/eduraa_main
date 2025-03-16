import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './UpdateMockTest.css'; // Import CSS for styling

const MockTestUpdate = () => {
  const { mockTestId } = useParams(); // Get the mock test ID from the URL
  const [mockTest, setMockTest] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [validationError, setValidationError] = useState(''); // State for validation error
  const navigate = useNavigate();

  // Fetch the mock test details
  useEffect(() => {
    const fetchMockTest = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/mocktest/mockTest/${mockTestId}`);
        setMockTest(response.data);
        setLoading(false);
      } catch (error) {
        setError('Error fetching mock test details');
        setLoading(false);
      }
    };
    fetchMockTest();
  }, [mockTestId]);

  // Calculate total marks from questions
  const calculateTotalMarks = () => {
    return mockTest.questions.reduce((acc, question) => acc + (parseInt(question.marks) || 0), 0);
  };

  // Check if total marks match the sum of each question's marks
  useEffect(() => {
    if (mockTest) {
      const totalQuestionMarks = calculateTotalMarks();
      if (totalQuestionMarks !== parseInt(mockTest.totalMarks)) {
        setValidationError(`Total marks should be equal to the sum of each question's marks (currently ${totalQuestionMarks}).`);
      } else {
        setValidationError('');
      }
    }
  }, [mockTest?.questions, mockTest?.totalMarks]);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMockTest({ ...mockTest, [name]: value });
  };

  // Handle question change
  const handleQuestionChange = (index, e) => {
    const { name, value } = e.target;
    const updatedQuestions = [...mockTest.questions];
    updatedQuestions[index] = { ...updatedQuestions[index], [name]: value };
    setMockTest({ ...mockTest, questions: updatedQuestions });
  };

  // Handle step change
  const handleStepChange = (questionIndex, stepIndex, e) => {
    const { value } = e.target;
    const updatedQuestions = [...mockTest.questions];
    updatedQuestions[questionIndex].steps[stepIndex] = value;
    setMockTest({ ...mockTest, questions: updatedQuestions });
  };

  // Handle option change
  const handleOptionChange = (questionIndex, optionIndex, e) => {
    const { name, type, checked, value } = e.target; // Destructure to get type and checked
    const updatedQuestions = [...mockTest.questions];

    if (name === 'isCorrect') {
      // Convert the checkbox value to boolean
      updatedQuestions[questionIndex].options[optionIndex][name] = checked;
    } else {
      updatedQuestions[questionIndex].options[optionIndex][name] = value;
    }

    setMockTest({ ...mockTest, questions: updatedQuestions });
  };

  // Add a new question
  const addQuestion = () => {
    if (mockTest.questions.length >= mockTest.numberOfQuestions) {
      alert(`Cannot add more than ${mockTest.numberOfQuestions} questions.`);
      return;
    }

    const newQuestion = {
      questionText: '',
      options: [{ optionText: '', isCorrect: false }],
      steps: [''],
      marks: 1,
    };
    setMockTest({ ...mockTest, questions: [...mockTest.questions, newQuestion] });
  };

  // Remove a question
  const removeQuestion = (index) => {
    const updatedQuestions = mockTest.questions.filter((_, i) => i !== index);
    setMockTest({ ...mockTest, questions: updatedQuestions });
    setValidationError(''); // Clear validation error when removing a question
  };

  // Add an option to a question
  const addOption = (questionIndex) => {
    const updatedQuestions = [...mockTest.questions];
    updatedQuestions[questionIndex].options.push({ optionText: '', isCorrect: false });
    setMockTest({ ...mockTest, questions: updatedQuestions });
  };

  // Remove an option from a question
  const removeOption = (questionIndex, optionIndex) => {
    const updatedQuestions = [...mockTest.questions];
    updatedQuestions[questionIndex].options = updatedQuestions[questionIndex].options.filter((_, i) => i !== optionIndex);
    setMockTest({ ...mockTest, questions: updatedQuestions });
  };

  // Add a new step
  const addStep = (questionIndex) => {
    const updatedQuestions = [...mockTest.questions];
    updatedQuestions[questionIndex].steps.push('');
    setMockTest({ ...mockTest, questions: updatedQuestions });
  };

  // Remove a step from a question
  const removeStep = (questionIndex, stepIndex) => {
    const updatedQuestions = [...mockTest.questions];
    updatedQuestions[questionIndex].steps = updatedQuestions[questionIndex].steps.filter((_, i) => i !== stepIndex);
    setMockTest({ ...mockTest, questions: updatedQuestions });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validationError) {
      alert(validationError); // Prevent submission if validation fails
      return;
    }
    try {
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/mocktest/upmockTest/${mockTestId}`, mockTest);
      const examId = response.data.examId;
      navigate(`/manager/viewmocktest/${examId}`);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert('A mock test with the same title already exists');
      } else {
        setError('Error updating mock test');
      }
    }
  };

  if (loading) return <p>Loading mock test details...</p>;

  if (error) return <p className="mocktest-error-message">{error}</p>;

  return (
    <div className="mocktest">
      <h2>Update Mock Test</h2>
      <form onSubmit={handleSubmit}>
        <div className="mocktest-form-group">
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={mockTest.title || ''}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="mocktest-form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={mockTest.description || ''}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="mocktest-form-group">
          <label>Duration (in minutes)</label>
          <input

            type="number"
            name="duration"
            value={mockTest.duration || ''}
            onChange={handleInputChange}
            required
            min = "0"
          />
        </div>

        <div className="mocktest-form-group">
          <label>Total Marks</label>
          <input
            type="number"
            name="totalMarks"
            value={mockTest.totalMarks || ''}
            onChange={handleInputChange}
            required
            min="0"
          />
        </div>

        <div className="mocktest-form-group">
          <label>Number of Questions</label>
          <input
            type="number"
            name="numberOfQuestions"
            value={mockTest.numberOfQuestions || ''}
            onChange={handleInputChange}
            required
            min="0"
          />
        </div>

        <div className="mocktest-form-group">
          <label>Passing Marks</label>
          <input
            type="number"
            name="passingMarks"
            value={mockTest.passingMarks || ''}
            onChange={handleInputChange}
            required
            min="0"
          />
        </div>

        {/* Display validation error message if any */}
        {validationError && <p className="mocktest-validation-error">{validationError}</p>}

        {/* Questions Section */}
        <h3>Questions</h3>
        {mockTest.questions.map((question, questionIndex) => (
          <div key={questionIndex} className="mocktest-question">
            <div className="mocktest-form-group">
              <label>Question Text</label>
              <input
                type="text"
                name="questionText"
                value={question.questionText}
                onChange={(e) => handleQuestionChange(questionIndex, e)}
                required
              />
            </div>

            <div className="mocktest-form-group">
              <label>Marks</label>
              <input
                type="number"
                name="marks"
                value={question.marks}
                onChange={(e) => handleQuestionChange(questionIndex, e)}
                required
                min="0"
              />
            </div>

            {/* Options Section */}
            <h4>Options</h4>
            {question.options.map((option, optionIndex) => (
              <div key={optionIndex} className="mocktest-option">
                <input
                  type="text"
                  name="optionText"
                  value={option.optionText}
                  onChange={(e) => handleOptionChange(questionIndex, optionIndex, e)}
                  required
                />
                <label>
                  <input
                    type="checkbox"
                    name="isCorrect"
                    checked={option.isCorrect}
                    onChange={(e) => handleOptionChange(questionIndex, optionIndex, e)}
                  />
                  Correct
                </label>
                <button type="button" className="mocktest-button mocktest-remove-option" onClick={() => removeOption(questionIndex, optionIndex)}>Remove Option</button>
              </div>
            ))}
            <button type="button" className="mocktest-button mocktest-add-option" onClick={() => addOption(questionIndex)}>Add Option</button>

            {/* Steps Section */}
            <h4>Steps (if applicable)</h4>
            {question.steps.map((step, stepIndex) => (
              <div key={stepIndex} className="mocktest-step">
                <input
                  type="text"
                  value={step}
                  onChange={(e) => handleStepChange(questionIndex, stepIndex, e)}
                />
                <button type="button" className="mocktest-button mocktest-remove-step" onClick={() => removeStep(questionIndex, stepIndex)}>Remove Step</button>
              </div>
            ))}
            <button type="button" className="mocktest-button mocktest-add-step" onClick={() => addStep(questionIndex)}>Add Step</button>

            <button type="button" className="mocktest-button mocktest-remove-question" onClick={() => removeQuestion(questionIndex)}>Remove Question</button>
          </div>
        ))}
        <button type="button" className="mocktest-button mocktest-add-question" onClick={addQuestion}>Add Question</button>

        <button type="submit" className="mocktest-button mocktest-submit">Update Mock Test</button>
      </form>
    </div>
  );
};

export default MockTestUpdate;
