import './EmptyState.css';

interface EmptyStateProps {
  message: string;
  icon?: string;
}

const EmptyState = ({ message, icon = '📭' }: EmptyStateProps) => {
  return (
    <div className="empty-state-container">
      <div className="empty-icon">{icon}</div>
      <p className="empty-message">{message}</p>
    </div>
  );
};

export default EmptyState;
