import React from 'react';
import { QUICK_ACTIONS, type QuickAction } from '../quickActionsConfig';
import styles from './QuickActions.module.css'; 

interface QuickActionsProps {
  onActionClick: (action: QuickAction) => void;
  disabled?: boolean;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onActionClick, disabled }) => {
  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {QUICK_ACTIONS.map((action) => (
          <button
            key={action.id}
            className={styles.actionButton}
            onClick={() => onActionClick(action)}
            disabled={disabled}
          >
            <span className={styles.iconWrapper}>{action.icon}</span>
            <span className={styles.label}>{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};