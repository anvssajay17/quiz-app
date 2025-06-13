// import { useNavigate } from 'react-router-dom';
// import ButtonsGrid from './ButtonsGrid';

// const MainPage = ({ fetchQuestion }) => {
//   const navigate = useNavigate();

//   const handleClick = async (index) => {
//     navigate('/question');
//     await fetchQuestion(index);
   
//   };

//   return (
//     <div className="homepage">
//       <h1 className="title">Programming Quiz</h1>
//       <ButtonsGrid onClick={handleClick} />
//     </div>
//   );
// };

// export default MainPage;

import { useNavigate } from 'react-router-dom';
import ButtonsGrid from './ButtonsGrid';
import './MainPage.css'; // Add this if you want to style logout

const MainPage = ({ fetchQuestion }) => {
  const navigate = useNavigate();

  const handleClick = async (index) => {
    navigate('/question');
    await fetchQuestion(index);
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // or whatever key you used
    navigate('/auth');
  };

  return (
    <div className="homepage">
      <div className="logout-container">
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <h1 className="title">Programming Quiz</h1>
      <ButtonsGrid onClick={handleClick} />
    </div>
  );
};

export default MainPage;

