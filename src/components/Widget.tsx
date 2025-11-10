import React from 'react';
import './Widget.css';

type WidgetProps = {
  children: React.ReactNode;
  className?: string; 
};

export const Widget = ({ children, className = '' }: WidgetProps) => {
  const combinedClassName = `widget-container ${className}`;

  return (
    <div className={combinedClassName}>
      {children}
    </div>
  );
};