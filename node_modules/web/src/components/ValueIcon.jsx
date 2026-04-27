
import React from 'react';
import { motion } from 'framer-motion';
import { Award, Clock, Users, Shield } from 'lucide-react';

const iconMap = {
  quality: Award,
  experience: Shield,
  delivery: Clock,
  trust: Users
};

const ValueIcon = ({ type, title, description, index }) => {
  const Icon = iconMap[type] || Award;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group text-center bg-card p-8 rounded-2xl border border-border shadow-sm hover:shadow-md transition-all duration-300"
    >
      <div className="mb-6 flex justify-center">
        <div className="w-20 h-20 rounded-2xl bg-gold/10 flex items-center justify-center group-hover:bg-gold/20 transition-colors duration-300">
          <Icon className="w-10 h-10 text-gold" />
        </div>
      </div>
      
      <h3 className="text-xl font-semibold mb-3 text-foreground group-hover:text-gold transition-colors duration-300">
        {title}
      </h3>
      <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">
        {description}
      </p>
    </motion.div>
  );
};

export default ValueIcon;
