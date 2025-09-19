import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';

interface OptionType {
  optionText: string;
  isCorrect: boolean;
  _id: string;
}

interface QuestionType {
  _id: string;
  question: string;
  options: OptionType[];
  correctAnswer: string;
}

interface CategoryType {
  name: string;
  questions: QuestionType[];
}

const Quiz: React.FC = () => {
  const [categories] = useState<CategoryType[]>([
    {
      name: 'Biology',
      questions: [
        {
          _id: '1',
          question: 'What is the powerhouse of the cell?',
          options: [
            { optionText: 'Nucleus', isCorrect: false, _id: '1a' },
            { optionText: 'Mitochondria', isCorrect: true, _id: '1b' },
            { optionText: 'Ribosome', isCorrect: false, _id: '1c' },
            { optionText: 'Cell Membrane', isCorrect: false, _id: '1d' },
          ],
          correctAnswer: 'Mitochondria',
        },
        {
          _id: '2',
          question: 'What is the main component of plant cell walls?',
          options: [
            { optionText: 'Chlorophyll', isCorrect: false, _id: '2a' },
            { optionText: 'Cellulose', isCorrect: true, _id: '2b' },
            { optionText: 'Protein', isCorrect: false, _id: '2c' },
            { optionText: 'Lipid', isCorrect: false, _id: '2d' },
          ],
          correctAnswer: 'Cellulose',
        },
        {
          _id: '3',
          question: 'What is the pigment that gives plants their green color?',
          options: [
            { optionText: 'Chlorophyll', isCorrect: true, _id: '3a' },
            { optionText: 'Carotene', isCorrect: false, _id: '3b' },
            { optionText: 'Xanthophyll', isCorrect: false, _id: '3c' },
            { optionText: 'Anthocyanin', isCorrect: false, _id: '3d' },
          ],
          correctAnswer: 'Chlorophyll',
        },
        {
          _id: '4',
          question: 'What is the process by which plants make food?',
          options: [
            { optionText: 'Respiration', isCorrect: false, _id: '4a' },
            { optionText: 'Photosynthesis', isCorrect: true, _id: '4b' },
            { optionText: 'Transpiration', isCorrect: false, _id: '4c' },
            { optionText: 'Digestion', isCorrect: false, _id: '4d' },
          ],
          correctAnswer: 'Photosynthesis',
        }
      ],
    },
    {
      name: 'Physics',
      questions: [
        {
          _id: '5',
          question: 'What is the unit of force?',
          options: [
            { optionText: 'Pascal', isCorrect: false, _id: '5a' },
            { optionText: 'Newton', isCorrect: true, _id: '5b' },
            { optionText: 'Joule', isCorrect: false, _id: '5c' },
            { optionText: 'Watt', isCorrect: false, _id: '5d' },
          ],
          correctAnswer: 'Newton',
        },
        {
          _id: '6',
          question: 'What type of energy does a moving object possess?',
          options: [
            { optionText: 'Potential Energy', isCorrect: false, _id: '6a' },
            { optionText: 'Kinetic Energy', isCorrect: true, _id: '6b' },
            { optionText: 'Thermal Energy', isCorrect: false, _id: '6c' },
            { optionText: 'Chemical Energy', isCorrect: false, _id: '6d' },
          ],
          correctAnswer: 'Kinetic Energy',
        },
        {
          _id: '7',
          question: 'What is the speed of light in vacuum?',
          options: [
            { optionText: '3.0 x 10^8 m/s', isCorrect: true, _id: '7a' },
            { optionText: '2.0 x 10^8 m/s', isCorrect: false, _id: '7b' },
            { optionText: '1.5 x 10^8 m/s', isCorrect: false, _id: '7c' },
            { optionText: '4.0 x 10^8 m/s', isCorrect: false, _id: '7d' },
          ],
          correctAnswer: '3.0 x 10^8 m/s',
        },
        {
          _id: '8',
          question: 'What law explains why a rocket can travel in space?',
          options: [
            { optionText: 'Newton’s First Law', isCorrect: false, _id: '8a' },
            { optionText: 'Newton’s Third Law', isCorrect: true, _id: '8b' },
            { optionText: 'Law of Conservation of Mass', isCorrect: false, _id: '8c' },
            { optionText: 'Boyle’s Law', isCorrect: false, _id: '8d' },
          ],
          correctAnswer: 'Newton’s Third Law',
        }
      ],
    },
    {
      name: 'Chemistry',
      questions: [
        {
          _id: '9',
          question: 'What is the chemical symbol for water?',
          options: [
            { optionText: 'O2', isCorrect: false, _id: '9a' },
            { optionText: 'H2O', isCorrect: true, _id: '9b' },
            { optionText: 'CO2', isCorrect: false, _id: '9c' },
            { optionText: 'HO', isCorrect: false, _id: '9d' },
          ],
          correctAnswer: 'H2O',
        },
        {
          _id: '10',
          question: 'Which gas is essential for photosynthesis?',
          options: [
            { optionText: 'Oxygen', isCorrect: false, _id: '10a' },
            { optionText: 'Nitrogen', isCorrect: false, _id: '10b' },
            { optionText: 'Carbon Dioxide', isCorrect: true, _id: '10c' },
            { optionText: 'Hydrogen', isCorrect: false, _id: '10d' },
          ],
          correctAnswer: 'Carbon Dioxide',
        },
        {
          _id: '11',
          question: 'What is the pH level of pure water?',
          options: [
            { optionText: '5', isCorrect: false, _id: '11a' },
            { optionText: '7', isCorrect: true, _id: '11b' },
            { optionText: '9', isCorrect: false, _id: '11c' },
            { optionText: '3', isCorrect: false, _id: '11d' },
          ],
          correctAnswer: '7',
        },
        {
          _id: '12',
          question: 'What element does “O” represent on the periodic table?',
          options: [
            { optionText: 'Osmium', isCorrect: false, _id: '12a' },
            { optionText: 'Oxygen', isCorrect: true, _id: '12b' },
            { optionText: 'Oganesson', isCorrect: false, _id: '12c' },
            { optionText: 'Osmiridium', isCorrect: false, _id: '12d' },
          ],
          correctAnswer: 'Oxygen',
        }
      ],
    },
    {
      name: 'Mathematics',
      questions: [
        {
          _id: '13',
          question: 'What is the value of π?',
          options: [
            { optionText: '3.14', isCorrect: true, _id: '13a' },
            { optionText: '2.71', isCorrect: false, _id: '13b' },
            { optionText: '1.41', isCorrect: false, _id: '13c' },
            { optionText: '1.61', isCorrect: false, _id: '13d' },
          ],
          correctAnswer: '3.14',
        },
        {
          _id: '14',
          question: 'What is the sum of angles in a triangle?',
          options: [
            { optionText: '90°', isCorrect: false, _id: '14a' },
            { optionText: '180°', isCorrect: true, _id: '14b' },
            { optionText: '270°', isCorrect: false, _id: '14c' },
            { optionText: '360°', isCorrect: false, _id: '14d' },
          ],
          correctAnswer: '180°',
        },
        {
          _id: '15',
          question: 'What is the square root of 64?',
          options: [
            { optionText: '6', isCorrect: false, _id: '15a' },
            { optionText: '8', isCorrect: true, _id: '15b' },
            { optionText: '10', isCorrect: false, _id: '15c' },
            { optionText: '12', isCorrect: false, _id: '15d' },
          ],
          correctAnswer: '8',
        },
        {
          _id: '16',
          question: 'What is the value of 5 factorial (5!)?',
          options: [
            { optionText: '20', isCorrect: false, _id: '16a' },
            { optionText: '60', isCorrect: false, _id: '16b' },
            { optionText: '120', isCorrect: true, _id: '16c' },
            { optionText: '150', isCorrect: false, _id: '16d' },
          ],
          correctAnswer: '120',
        }
      ],
    },
    {
      name: 'History',
      questions: [
        {
          _id: '17',
          question: 'Who was the first President of the United States?',
          options: [
            { optionText: 'Abraham Lincoln', isCorrect: false, _id: '17a' },
            { optionText: 'George Washington', isCorrect: true, _id: '17b' },
            { optionText: 'Thomas Jefferson', isCorrect: false, _id: '17c' },
            { optionText: 'Theodore Roosevelt', isCorrect: false, _id: '17d' },
          ],
          correctAnswer: 'George Washington',
        },
        {
          _id: '18',
          question: 'What year did World War II end?',
          options: [
            { optionText: '1941', isCorrect: false, _id: '18a' },
            { optionText: '1945', isCorrect: true, _id: '18b' },
            { optionText: '1939', isCorrect: false, _id: '18c' },
            { optionText: '1950', isCorrect: false, _id: '18d' },
          ],
          correctAnswer: '1945',
        },
        {
          _id: '19',
          question: 'Who was known as the "Father of the Constitution"?',
          options: [
            { optionText: 'George Washington', isCorrect: false, _id: '19a' },
            { optionText: 'Benjamin Franklin', isCorrect: false, _id: '19b' },
            { optionText: 'James Madison', isCorrect: true, _id: '19c' },
            { optionText: 'Thomas Jefferson', isCorrect: false, _id: '19d' },
          ],
          correctAnswer: 'James Madison',
        },
        {
          _id: '20',
          question: 'Which empire was known for building extensive road systems in ancient South America?',
          options: [
            { optionText: 'Aztec', isCorrect: false, _id: '20a' },
            { optionText: 'Inca', isCorrect: true, _id: '20b' },
            { optionText: 'Maya', isCorrect: false, _id: '20c' },
            { optionText: 'Olmec', isCorrect: false, _id: '20d' },
          ],
          correctAnswer: 'Inca',
        }
      ],
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const { user } = useContext(UserContext);
  const history = useHistory();

  const startQuiz = (category: CategoryType) => {
    setSelectedCategory(category);
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
    setSelectedAnswer(null);
  };

  const handleAnswerOptionClick = (option: OptionType) => {
    setSelectedAnswer(option.optionText);
  };

  const handleNextQuestion = () => {
    const question = selectedCategory!.questions[currentQuestion];
    const isCorrect = question.options.find((opt) => opt.optionText === selectedAnswer)?.isCorrect || false;

    if (isCorrect) setScore(score + 1);

    if (currentQuestion < selectedCategory!.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      setShowScore(true);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(null);
    }
  };

  const goToCategorySelection = () => {
    setSelectedCategory(null);
  };

  return (
    <div className="container mt-5 text-white bg-dark p-5 rounded">
      <div className="text-center mb-4">
        <h2>Welcome, {user?.name}</h2>
      </div>

      {!selectedCategory ? (
        <div className="text-center">
          <h3>Select a Category</h3>
          {categories.map((category, index) => (
            <button
              key={index}
              className="btn btn-primary my-2 mx-2"
              onClick={() => startQuiz(category)}
            >
              {category.name}
            </button>
          ))}
          <button className="btn btn-secondary mt-3" onClick={() => history.push('/student')}>
            Go Back to Home
          </button>
        </div>
      ) : showScore ? (
        <div className="alert alert-success text-center">
          <h3><i className="fas fa-trophy"></i> Quiz Completed!</h3>
          <p>Your Score: {score} out of {selectedCategory.questions.length}</p>
          <button className="btn btn-secondary mt-3" onClick={goToCategorySelection}>Back to Categories</button>
        </div>
      ) : (
        <div className="card bg-dark text-white">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              <i className="fas fa-question-circle"></i> Question {currentQuestion + 1} of {selectedCategory.questions.length}
            </h5>
            <button className="btn btn-outline-danger" onClick={goToCategorySelection}>
              Close Quiz
            </button>
          </div>
          <div className="card-body">
            <h5>{selectedCategory.questions[currentQuestion].question}</h5>
            <div className="list-group mt-3">
              {selectedCategory.questions[currentQuestion].options.map((option) => (
                <button
                  key={option._id}
                  className={`list-group-item list-group-item-action ${
                    selectedAnswer === option.optionText ? 'bg-primary text-white' : 'bg-secondary text-white'
                  }`}
                  onClick={() => handleAnswerOptionClick(option)}
                >
                  {option.optionText}
                </button>
              ))}
            </div>
            <div className="d-flex justify-content-between mt-4">
              <button
                className="btn btn-outline-info"
                onClick={handlePreviousQuestion}
                disabled={currentQuestion === 0}
              >
                Previous
              </button>
              <button
                className="btn btn-outline-success"
                onClick={handleNextQuestion}
              >
                {currentQuestion === selectedCategory.questions.length - 1 ? 'Submit' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quiz;
