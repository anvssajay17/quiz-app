import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import MainPage from './components/MainPage';
import QuestionPage from './components/QuestionPage';
import AuthFlipBox from './components/AuthFlipBox';
import AuthRedirect from './components/AuthRedirect';

const App = () => {
  const [question, setQuestion] = useState(null);
  const [categoryId, setCategoryId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchFromApi = async (id) => {
    const url = `http://localhost:3500/question?category=${id}`;
    try {
      setLoading(true);
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
      const result = await response.json();
      setQuestion(result);
    } catch (error) {
      console.error('Error fetching question:', error.message);
      setQuestion({ question: 'Error fetching question.' });
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestion = async (index) => {
    const id = index + 1;
    setCategoryId(id);
    await fetchFromApi(id);
  };

  const fetchNextQuestion = async () => {
    if (categoryId) {
      await fetchFromApi(categoryId);
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage fetchQuestion={fetchQuestion} />} />
        <Route path="/question" element={<QuestionPage question={question} fetchNextQuestion={fetchNextQuestion} loading={loading} />} />
        <Route path="/auth" element={<AuthFlipBox />} />
        <Route path="/auth-redirect" element={<AuthRedirect />} />
      </Routes>
    </Router>
  );
};

export default App;
