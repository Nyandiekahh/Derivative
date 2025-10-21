import React from 'react';
import BlocklyWorkspace from './BlocklyWorkspace';
import './BotBuilder.css';

const BotBuilder = () => {
  return (
    <div className="bot-builder">
      <div className="builder-header">
        <h3>Strategy Workspace</h3>
        <p>Drag and drop blocks to create your trading strategy</p>
      </div>
      <div className="builder-content">
        <BlocklyWorkspace />
      </div>
    </div>
  );
};

export default BotBuilder;