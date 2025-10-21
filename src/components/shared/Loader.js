import React from 'react';
import { Loader2 } from 'lucide-react';
import './Loader.css';

const Loader = ({ size = 'large', text = 'Loading...' }) => {
  return (
    <div className={`loader-container ${size}`}>
      <div className="loader-content">
        <Loader2 className="loader-spinner spin" />
        {text && <p className="loader-text">{text}</p>}
      </div>
    </div>
  );
};

export default Loader;