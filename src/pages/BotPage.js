import React, { useState } from 'react';
import Header from '../components/layout/Header';
import BotBuilder from '../components/bot/BotBuilder';
import BotControls from '../components/bot/BotControls';
import BotPerformance from '../components/bot/BotPerformance';
import BotTemplates from '../components/bot/BotTemplates';
import './BotPage.css';

const BotPage = () => {
  const [showTemplates, setShowTemplates] = useState(false);

  return (
    <div className="bot-page">
      <Header />
      <div className="bot-content">
        <div className="bot-main">
          <div className="bot-header">
            <h2>Bot Builder</h2>
            <button
              className="templates-button"
              onClick={() => setShowTemplates(!showTemplates)}
            >
              {showTemplates ? 'Hide Templates' : 'Show Templates'}
            </button>
          </div>

          {showTemplates && (
            <div className="templates-section fade-in">
              <BotTemplates onClose={() => setShowTemplates(false)} />
            </div>
          )}

          <div className="bot-grid">
            <div className="bot-workspace">
              <BotBuilder />
            </div>
            <div className="bot-sidebar">
              <BotControls />
              <BotPerformance />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BotPage;