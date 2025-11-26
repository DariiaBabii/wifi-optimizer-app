import React from 'react';
import { Info } from 'lucide-react';
import './InfoTooltip.css';

interface InfoTooltipProps {
  text: string;
}

export const InfoTooltip = ({ text }: InfoTooltipProps) => {
  return (
    <div className="info-tooltip-container">
      <Info size={15} className="info-icon" />
      
      <div className="tooltip-bubble">
        {text}
      </div>
    </div>
  );
};