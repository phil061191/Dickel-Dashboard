import './LoadingSpinner.css';

interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner = ({ message = 'Laden...' }: LoadingSpinnerProps) => {
  return (
    <div className="loading-spinner-container">
      <div className="loading-spinner"></div>
      <p className="loading-message">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
