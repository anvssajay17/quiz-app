import { useNavigate } from 'react-router-dom';
import ButtonsGrid from './ButtonsGrid';

const MainPage = ({ fetchQuestion }) => {
  const navigate = useNavigate();

  const handleClick = async (index) => {
    navigate('/question');
    await fetchQuestion(index);
   
  };

  return (
    <div className="homepage">
      <h1 className="title">Programming Quiz</h1>
      <ButtonsGrid onClick={handleClick} />
    </div>
  );
};

export default MainPage;
