import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setContractType } from '../../redux/slices/tradeSlice';
import { CONTRACT_TYPES } from '../../constants/tradeTypes';
import './ContractTypes.css';

const ContractTypes = () => {
  const dispatch = useDispatch();
  const { selectedContractType } = useSelector((state) => state.trade);
  const [activeCategory, setActiveCategory] = useState('MATCH_DIFF');

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    const firstSubtype = CONTRACT_TYPES[category].subtypes[0];
    dispatch(setContractType(firstSubtype.id));
  };

  const handleSubtypeChange = (subtypeId) => {
    dispatch(setContractType(subtypeId));
  };

  return (
    <div className="contract-types">
      <label className="section-label">Contract Type</label>
      
      <div className="contract-categories">
        {Object.keys(CONTRACT_TYPES).map((key) => {
          const category = CONTRACT_TYPES[key];
          return (
            <button
              key={key}
              className={`category-button ${activeCategory === key ? 'active' : ''}`}
              onClick={() => handleCategoryChange(key)}
            >
              {category.name}
            </button>
          );
        })}
      </div>

      <div className="contract-subtypes">
        {CONTRACT_TYPES[activeCategory].subtypes.map((subtype) => (
          <button
            key={subtype.id}
            className={`subtype-button ${selectedContractType === subtype.id ? 'active' : ''}`}
            onClick={() => handleSubtypeChange(subtype.id)}
          >
            <div className="subtype-name">{subtype.name}</div>
            <div className="subtype-desc">{subtype.description}</div>
          </button>
        ))}
      </div>

      <div className="contract-description">
        <p>{CONTRACT_TYPES[activeCategory].description}</p>
      </div>
    </div>
  );
};

export default ContractTypes;