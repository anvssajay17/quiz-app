import './ButtonGrid.css';

const categories = [
  'Python', 'JavaScript', 'React', 'SQL', 'Java',
  'C++', 'TypeScript', 'PHP', 'Go', 'HTML'
];

const ButtonsGrid = ({ onClick }) => {
  return (
    <div className="button-grid">
      {categories.map((name, index) => (
        <button className="button" key={name} onClick={() => onClick(index)}>
          {name}
        </button>
      ))}
    </div>
  );
};

export default ButtonsGrid;
