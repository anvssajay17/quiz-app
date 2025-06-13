
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ButtonsGrid from './ButtonsGrid';
import './MainPage.css';

const MainPage = ({ fetchQuestion }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [stats, setStats] = useState({ totalAttempts: 0, totalCorrect: 0 });

  useEffect(() => {
    const fetchEntry = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch('http://localhost:3500/entry', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        setUsername(data.username);
        setStats(data.stats);
      } catch (err) {
        console.error('Failed to fetch user info:', err);
      }
    };

    fetchEntry();
  }, []);

  const handleClick = async (index) => {
    navigate('/question');
    await fetchQuestion(index);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/auth');
  };

  const accuracy = stats.totalAttempts
    ? Math.round((stats.totalCorrect / stats.totalAttempts) * 100)
    : 0;

  return (
    <div className="main-container">
    
      <div className="hero-section">
        <div className="top-bar">
         
          <button onClick={handleLogout} className="nav-button">Logout</button>
        </div>
        <div className="hero-text">
          <h1 className="hello-text">Hello, {username} 👋</h1>
          <h2 className="main-heading">
            Improve your coding knowledge with our <span>CodingQuiz !</span>
          </h2>
        </div>
      </div>

      <div className="stats-section">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <h3>Questions Attempted</h3>
          <p>{stats.totalAttempts}</p>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <h3>Correct Answers</h3>
          <p>{stats.totalCorrect}</p>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <h3>Accuracy</h3>
          <p>{accuracy}%</p>
        </div>
      </div>

      
      <div className="grid-section">
        <ButtonsGrid onClick={handleClick} />
      </div>

    
      <footer className="footer">
        <p>© {new Date().getFullYear()} CodingQuiz | Crafted with ❤️ for developers.</p>
      </footer>
    </div>
  );
};

export default MainPage;




