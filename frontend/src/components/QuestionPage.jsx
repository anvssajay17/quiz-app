import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './QuestionPage.css';

const QuestionPage = ({ question, fetchNextQuestion, loading }) => {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(question);

  // Restore question from localStorage if refreshed
  useEffect(() => {
    if (!question && !loading) {
      const saved = localStorage.getItem('lastQuestion');
      if (saved) {
        setCurrentQuestion(JSON.parse(saved));
      } else {
        fetchNextQuestion();
      }
    } else if (question) {
      setCurrentQuestion(question);
    }
  }, [question]);

  // Store to localStorage whenever it changes
  useEffect(() => {
    if (currentQuestion) {
      localStorage.setItem('lastQuestion', JSON.stringify(currentQuestion));
    }
  }, [currentQuestion]);

  const handleOptionClick = (optionKey) => {
    setSelectedOption(optionKey);
  };

  return (
    <div className="question-page">
      <h2 className="question-title">Question</h2>

      {loading ? (
        <p className="loading-text">Loading question...</p>
      ) : currentQuestion ? (
        <>
          <p className="question-text">{currentQuestion.question}</p>
          <ul className="option-list">
            {['option_a', 'option_b', 'option_c', 'option_d'].map((key) => (
              <li
                key={key}
                className={`option-item ${selectedOption === key ? 'selected' : ''}`}
                onClick={() => handleOptionClick(key)}
              >
                {currentQuestion[key]}
              </li>
            ))}
          </ul>

          {selectedOption && (
            <p className="selected-info">
              You selected: <strong>{currentQuestion[selectedOption]}</strong>
            </p>
          )}
        </>
      ) : (
        <p className="no-question">No question available</p>
      )}

      <div className="button-group">
        <button
          className="next-btn"
          onClick={() => {
            setSelectedOption(null);
            fetchNextQuestion();
          }}
        >
          Next
        </button>
        <button className="back-btn" onClick={() => navigate('/')}>
          Back
        </button>
      </div>
    </div>
  );
};

export default QuestionPage;
 
