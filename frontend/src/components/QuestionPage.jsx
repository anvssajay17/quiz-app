import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './QuestionPage.css';

const QuestionPage = ({ question, fetchNextQuestion, loading }) => {
  const navigate = useNavigate();

  const [selectedOption, setSelectedOption] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(question);
  const [isCorrect, setIsCorrect] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [stats, setStats] = useState({
    total_attempts: 0,
    correct_answers: 0,
    accuracy: 0,
  });

  // ✅ Fetch stats for a given category
  const fetchStats = async (category_id) => {
    try {
      const res = await fetch(`http://localhost:3500/stats/${category_id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await res.json();
      setStats({
        total_attempts: data.total_attempts || 0,
        correct_answers: data.correct_answers || 0,
        accuracy: data.accuracy || 0,
      });
    } catch (err) {
      console.error('❌ Failed to fetch stats:', err.message);
    }
  };

  // ✅ On question prop change
  useEffect(() => {
    if (question) {
      setCurrentQuestion(question);
      setSelectedOption(null);
      setIsCorrect(null);
      setShowExplanation(false);
      setHasSubmitted(false);
      fetchStats(question.category_id);
    } else if (!loading) {
      const saved = localStorage.getItem('lastQuestion');
      if (saved) {
        const parsed = JSON.parse(saved);
        setCurrentQuestion(parsed);
        fetchStats(parsed.category_id);
      } else {
        fetchNextQuestion();
      }
    }
  }, [question]);

  // ✅ Save current question locally
  useEffect(() => {
    if (currentQuestion) {
      localStorage.setItem('lastQuestion', JSON.stringify(currentQuestion));
    }
  }, [currentQuestion]);

  // ✅ Fetch stats once on mount
  useEffect(() => {
    const tryFetchStats = async () => {
      if (question?.category_id) {
        await fetchStats(question.category_id);
      } else {
        const saved = localStorage.getItem('lastQuestion');
        if (saved) {
          const parsed = JSON.parse(saved);
          await fetchStats(parsed.category_id);
        }
      }
    };
    tryFetchStats();
  }, []);

  const handleOptionClick = async (optionKey) => {
    if (hasSubmitted || !currentQuestion) return;

    setSelectedOption(optionKey);
    setHasSubmitted(true);

    const selectedLetter = optionKey.split('_')[1].toUpperCase();
    const correctLetter = currentQuestion.correct_option;
    const isAnswerCorrect = selectedLetter === correctLetter;

    setIsCorrect(isAnswerCorrect);
    setShowExplanation(!isAnswerCorrect);

    try {
      await fetch('http://localhost:3500/attempt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          question_id: currentQuestion.id,
          category_id: currentQuestion.category_id,
          user_answer: selectedLetter,
          score: isAnswerCorrect,
        }),
      });

      // ✅ Refetch stats after answer
      fetchStats(currentQuestion.category_id);
    } catch (err) {
      console.error('❌ Failed to record attempt:', err.message);
    }
  };

  const handleNext = () => {
    fetchNextQuestion();
  };

  return (
    <div className="question-page">
      <div className="stats-box">
        <p><strong>📊 Your Stats for this Category:</strong></p>
        <p>Total Attempts: {stats.total_attempts}</p>
        <p>Correct Answers: {stats.correct_answers}</p>
        <p>Accuracy: {stats.accuracy}%</p>
      </div>

      <h2 className="question-title">Question</h2>

      {loading ? (
        <div className="splash-screen">
          <div className="spinner"></div>
          <p className="loading-text">Loading question...</p>
        </div>
      ) : currentQuestion ? (
        <>
          <p className="question-text">{currentQuestion.question}</p>

          <ul className="option-list">
            {['option_a', 'option_b', 'option_c', 'option_d'].map((key) => (
              <li
                key={key}
                className={`option-item ${selectedOption === key ? 'selected' : ''}`}
                onClick={() => !hasSubmitted && handleOptionClick(key)}
              >
                <strong>{key.split('_')[1].toUpperCase()}:</strong> {currentQuestion[key]}
              </li>
            ))}
          </ul>

          {selectedOption && (
            <div className="result-section">
              <p className={`result-text ${isCorrect ? 'correct' : 'wrong'}`}>
                {isCorrect
                  ? '✅ Correct!'
                  : `❌ Incorrect. Correct answer is: ${currentQuestion.correct_option}`}
              </p>

              {!isCorrect && showExplanation && (
                <p className="explanation-text">
                  Explanation: {currentQuestion.explanation || 'No explanation provided.'}
                </p>
              )}
            </div>
          )}
        </>
      ) : (
        <p className="no-question">No question available</p>
      )}

      <div className="button-group">
        <button className="next-btn" onClick={handleNext}>Next</button>
        <button className="back-btn" onClick={() => navigate('/')}>Back</button>
      </div>
    </div>
  );
};

export default QuestionPage;


