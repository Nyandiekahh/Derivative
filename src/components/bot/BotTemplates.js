import React from 'react';
import { useDispatch } from 'react-redux';
import { Zap, TrendingUp, BarChart3, X } from 'lucide-react';
import { setSelectedTemplate } from '../../redux/slices/botSlice';
import toast from 'react-hot-toast';
import './BotTemplates.css';

const templates = [
  {
    id: 'martingale',
    name: 'Martingale Strategy',
    icon: Zap,
    description: 'Double your stake after each loss until you win',
    difficulty: 'Advanced',
    category: 'Classic',
  },
  {
    id: 'anti-martingale',
    name: 'Anti-Martingale',
    icon: TrendingUp,
    description: 'Increase stake after wins, decrease after losses',
    difficulty: 'Intermediate',
    category: 'Classic',
  },
  {
    id: 'dalembert',
    name: "D'Alembert Strategy",
    icon: BarChart3,
    description: 'Gradually increase/decrease stake based on wins/losses',
    difficulty: 'Beginner',
    category: 'Classic',
  },
  {
    id: 'simple-rise-fall',
    name: 'Simple Rise/Fall',
    icon: TrendingUp,
    description: 'Basic strategy that alternates between rise and fall',
    difficulty: 'Beginner',
    category: 'Simple',
  },
];

const BotTemplates = ({ onClose }) => {
  const dispatch = useDispatch();

  const handleSelectTemplate = (template) => {
    dispatch(setSelectedTemplate(template));
    toast.success(`Template "${template.name}" loaded!`);
    
    // In production, this would load the actual Blockly blocks for the template
    // For now, we just set the template in state
  };

  return (
    <div className="bot-templates">
      <div className="templates-header">
        <h3>Strategy Templates</h3>
        <button className="close-templates" onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      <div className="templates-grid">
        {templates.map((template) => {
          const Icon = template.icon;
          return (
            <div key={template.id} className="template-card">
              <div className="template-icon">
                <Icon size={32} />
              </div>
              <div className="template-content">
                <div className="template-header">
                  <h4>{template.name}</h4>
                  <span className={`difficulty ${template.difficulty.toLowerCase()}`}>
                    {template.difficulty}
                  </span>
                </div>
                <p className="template-description">{template.description}</p>
                <div className="template-footer">
                  <span className="template-category">{template.category}</span>
                  <button
                    className="use-template-btn"
                    onClick={() => handleSelectTemplate(template)}
                  >
                    Use Template
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BotTemplates;