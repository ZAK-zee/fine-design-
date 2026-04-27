
import React from 'react';
import { motion } from 'framer-motion';

const TeamMember = ({ name, role, bio, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group bg-card p-6 rounded-2xl border border-border shadow-sm hover:shadow-md transition-all duration-300"
    >
      <div className="relative mb-6 overflow-hidden rounded-2xl aspect-square bg-secondary">
        <div className="absolute inset-0 bg-gradient-to-br from-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-32 h-32 rounded-xl bg-gold/10 flex items-center justify-center">
            <span className="text-5xl font-bold text-gold">
              {name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
        </div>
      </div>
      
      <h3 className="text-xl font-semibold mb-2 text-foreground group-hover:text-gold transition-colors duration-300">
        {name}
      </h3>
      <p className="text-gold text-sm font-medium mb-3">{role}</p>
      <p className="text-muted-foreground text-sm leading-relaxed">{bio}</p>
    </motion.div>
  );
};

export default TeamMember;
