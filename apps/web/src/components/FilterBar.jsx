
import React from 'react';
import { motion } from 'framer-motion';

const FilterBar = ({ categories, activeFilter, onFilterChange, translations }) => {
  return (
    <div className="flex flex-wrap gap-3 justify-center mb-12">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onFilterChange('all')}
        className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
          activeFilter === 'all'
            ? 'bg-gold text-white shadow-md shadow-gold/20'
            : 'bg-card border border-border text-foreground hover:border-gold/50 hover:text-gold'
        }`}
      >
        {translations.filterAll}
      </motion.button>
      
      {Object.entries(categories).map(([key, label]) => (
        <motion.button
          key={key}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onFilterChange(key)}
          className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
            activeFilter === key
              ? 'bg-gold text-white shadow-md shadow-gold/20'
              : 'bg-card border border-border text-foreground hover:border-gold/50 hover:text-gold'
          }`}
        >
          {label}
        </motion.button>
      ))}
    </div>
  );
};

export default FilterBar;
