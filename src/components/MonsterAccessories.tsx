import React from 'react';
import { motion } from 'motion/react';

interface Props {
  seed: number;
}

export default function MonsterAccessories({ seed }: Props) {
  const random = (offset: number) => {
    const x = Math.sin(seed + offset) * 10000;
    return x - Math.floor(x);
  };

  const hasCrown = random(1) > 0.6; // 40% chance
  const wingType = random(2) > 0.8 ? 'angel' : (random(2) > 0.6 ? 'demon' : 'none'); // 20% angel, 20% demon
  const hasEyes = random(3) > 0.2; // 80% chance for eyes

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
      {/* Wings go behind */}
      {wingType === 'demon' && (
        <svg width="240" height="120" viewBox="0 0 240 120" className="absolute -z-10" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
          {/* Left Wing */}
          <motion.g animate={{ rotate: [0, 20, 0], transformOrigin: '120px 60px' }} transition={{ repeat: Infinity, duration: 0.4, ease: "easeInOut" }}>
            <path d="M 110 60 Q 70 10 20 20 Q 50 50 20 90 Q 70 80 110 60" fill="#7f1d1d" stroke="#450a0a" strokeWidth="4" strokeLinejoin="round" />
            <path d="M 110 60 Q 70 40 40 50" fill="none" stroke="#450a0a" strokeWidth="3" />
          </motion.g>
          {/* Right Wing */}
          <motion.g animate={{ rotate: [0, -20, 0], transformOrigin: '120px 60px' }} transition={{ repeat: Infinity, duration: 0.4, ease: "easeInOut" }}>
            <path d="M 130 60 Q 170 10 220 20 Q 190 50 220 90 Q 170 80 130 60" fill="#7f1d1d" stroke="#450a0a" strokeWidth="4" strokeLinejoin="round" />
            <path d="M 130 60 Q 170 40 200 50" fill="none" stroke="#450a0a" strokeWidth="3" />
          </motion.g>
        </svg>
      )}

      {wingType === 'angel' && (
        <svg width="260" height="140" viewBox="0 0 260 140" className="absolute -z-10" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
          {/* Left Wing */}
          <motion.g animate={{ rotate: [0, 15, 0], transformOrigin: '130px 70px' }} transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}>
            <path d="M 120 70 C 80 20 20 30 10 60 C 30 70 40 90 70 110 C 90 90 100 80 120 70" fill="#ffffff" stroke="#cbd5e1" strokeWidth="4" strokeLinejoin="round" />
            <path d="M 100 65 C 70 40 40 50 30 65" fill="none" stroke="#cbd5e1" strokeWidth="3" strokeLinecap="round" />
            <path d="M 90 75 C 70 60 50 70 40 85" fill="none" stroke="#cbd5e1" strokeWidth="3" strokeLinecap="round" />
          </motion.g>
          {/* Right Wing */}
          <motion.g animate={{ rotate: [0, -15, 0], transformOrigin: '130px 70px' }} transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}>
            <path d="M 140 70 C 180 20 240 30 250 60 C 230 70 220 90 190 110 C 170 90 160 80 140 70" fill="#ffffff" stroke="#cbd5e1" strokeWidth="4" strokeLinejoin="round" />
            <path d="M 160 65 C 190 40 220 50 230 65" fill="none" stroke="#cbd5e1" strokeWidth="3" strokeLinecap="round" />
            <path d="M 170 75 C 190 60 210 70 220 85" fill="none" stroke="#cbd5e1" strokeWidth="3" strokeLinecap="round" />
          </motion.g>
        </svg>
      )}

      {/* Crown goes on top */}
      {hasCrown && (
        <svg width="80" height="60" viewBox="0 0 80 60" className="absolute z-20" style={{ top: '0%', left: '50%', transform: 'translate(-50%, -50%)' }}>
          <motion.g animate={{ y: [0, -4, 0], rotate: [0, 2, -2, 0] }} transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}>
            <path d="M 15 50 L 10 20 L 30 35 L 40 10 L 50 35 L 70 20 L 65 50 Z" fill="#fbbf24" stroke="#b45309" strokeWidth="3" strokeLinejoin="round" />
            <circle cx="10" cy="20" r="4" fill="#ef4444" />
            <circle cx="40" cy="10" r="5" fill="#3b82f6" />
            <circle cx="70" cy="20" r="4" fill="#ef4444" />
            <ellipse cx="40" cy="45" rx="20" ry="3" fill="#f59e0b" opacity="0.5" />
          </motion.g>
        </svg>
      )}

      {/* Eyes go in front */}
      {hasEyes && (
        <svg width="100" height="40" viewBox="0 0 100 40" className="absolute z-20" style={{ top: '45%', left: '50%', transform: 'translate(-50%, -50%)' }}>
          <motion.g animate={{ scaleY: [1, 0.1, 1] }} transition={{ repeat: Infinity, duration: 4, times: [0, 0.05, 0.1], ease: "easeInOut" }}>
            {/* Left Eye */}
            <ellipse cx="30" cy="20" rx="8" ry="12" fill="#1e293b" />
            <circle cx="27" cy="16" r="3" fill="#ffffff" />
            <circle cx="32" cy="24" r="1.5" fill="#ffffff" opacity="0.8" />
            {/* Right Eye */}
            <ellipse cx="70" cy="20" rx="8" ry="12" fill="#1e293b" />
            <circle cx="67" cy="16" r="3" fill="#ffffff" />
            <circle cx="72" cy="24" r="1.5" fill="#ffffff" opacity="0.8" />
          </motion.g>
        </svg>
      )}
    </div>
  );
}
