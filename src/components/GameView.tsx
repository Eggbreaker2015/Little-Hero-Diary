import React, { useState, useEffect, useRef } from 'react';
import { useGameStore } from '../store';
import { STAGES } from '../lib/gameData';
import { cn } from '../lib/utils';
import { sfx } from '../lib/sounds';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'motion/react';

export default function GameView() {
  const { 
    attacks, diamonds, currentStage, currentMonsterIndex, 
    currentMonsterHp, nextMonster, addDiamonds, useAttack, setMonsterHp,
    normalMonsterDiamondReward, bossMonsterDiamondReward
  } = useGameStore();

  const stage = STAGES[currentStage % STAGES.length];
  const monsterData = currentMonsterIndex === 5 ? stage.boss : stage.monsters[currentMonsterIndex];
  const isBoss = currentMonsterIndex === 5;

  // Calculate scaled HP based on stage loops
  const stageLoop = Math.floor(currentStage / STAGES.length);
  const hpMultiplier = Math.pow(1.5, stageLoop);
  const maxHp = Math.floor(monsterData.hpBase * hpMultiplier);

  // Ensure currentMonsterHp doesn't exceed maxHp (happens when we lower base HP in code but state is persisted)
  const initialHp = currentMonsterHp !== null ? Math.min(currentMonsterHp, maxHp) : maxHp;
  const [hp, setHp] = useState(initialHp);
  const [isDefeated, setIsDefeated] = useState(false);
  const [isHit, setIsHit] = useState(false);
  const [damageNumbers, setDamageNumbers] = useState<{id: number, x: number, y: number, dmg: number}[]>([]);
  const [droppedDiamonds, setDroppedDiamonds] = useState<{id: number, x: number, y: number}[]>([]);
  const clickIdRef = useRef(0);

  // Reset monster when index changes
  useEffect(() => {
    if (currentMonsterHp === null) {
      setHp(maxHp);
      setIsDefeated(false);
      setDroppedDiamonds([]);
    } else {
      setHp(Math.min(currentMonsterHp, maxHp));
    }
  }, [currentMonsterIndex, currentStage, maxHp, currentMonsterHp]);

  // Handle HP reaching 0
  useEffect(() => {
    if (hp === 0 && !isDefeated) {
      handleDefeat();
    }
  }, [hp, isDefeated]);

  const handleDefeat = () => {
    setIsDefeated(true);
    setMonsterHp(0);
    sfx.playDefeat();
    
    // Spawn diamonds
    const numDiamonds = isBoss ? (bossMonsterDiamondReward !== undefined ? bossMonsterDiamondReward : 5) : (normalMonsterDiamondReward !== undefined ? normalMonsterDiamondReward : 1);
    
    if (numDiamonds > 0) {
      const newDiamonds = Array.from({ length: numDiamonds }).map((_, i) => ({
        id: Date.now() + i,
        x: (Math.random() - 0.5) * 200, // Random spread
        y: (Math.random() - 0.5) * 200
      }));
      setDroppedDiamonds(newDiamonds);
    } else {
      // If no diamonds to drop, go to next monster immediately
      setTimeout(() => {
        nextMonster();
      }, 1500);
    }

    if (isBoss) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const collectDiamond = (id: number) => {
    setDroppedDiamonds(prev => prev.filter(d => d.id !== id));
    addDiamonds(1);
    sfx.playCollect();
    
    // If all diamonds collected, go to next monster
    if (droppedDiamonds.length === 1) {
      setTimeout(() => {
        nextMonster();
      }, 500);
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDefeated) return;
    if (attacks <= 0) return; // No attacks left

    if (useAttack()) {
      sfx.playHit();
      // Add damage number
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const id = clickIdRef.current++;
      setDamageNumbers(prev => [...prev, { id, x, y, dmg: 1 }]);
      
      // Trigger hit animation
      setIsHit(true);
      setTimeout(() => setIsHit(false), 100);
      
      // Remove damage number after animation
      setTimeout(() => {
        setDamageNumbers(prev => prev.filter(n => n.id !== id));
      }, 1000);

      const newHp = Math.max(0, hp - 1);
      setHp(newHp);
      setMonsterHp(newHp);
    }
  };

  return (
    <div className={cn("flex flex-col h-full", stage.bg)}>
      {/* Stage Info */}
      <div className="p-6 text-center bg-white/40 backdrop-blur-sm border-b-4 border-white/50">
        <h2 className="text-2xl font-black text-slate-800 drop-shadow-sm">
          {stage.name} {stageLoop > 0 ? `+${stageLoop}` : ''}
        </h2>
        <div className="flex justify-center gap-2 mt-3">
          {[0, 1, 2, 3, 4].map((i) => (
            <div 
              key={i} 
              className={cn(
                "w-4 h-4 rounded-full border-2 border-white shadow-sm transition-all",
                i < currentMonsterIndex ? "bg-emerald-400 scale-110" : 
                i === currentMonsterIndex ? "bg-amber-400 animate-bounce scale-125" : "bg-slate-300/50"
              )}
            />
          ))}
          <div className={cn(
            "w-5 h-5 rounded-full ml-2 border-2 border-white shadow-sm transition-all flex items-center justify-center text-[10px]",
            currentMonsterIndex === 5 ? "bg-rose-500 animate-bounce scale-125" : "bg-slate-300/50"
          )}>
            {currentMonsterIndex > 5 ? '💀' : ''}
          </div>
        </div>
      </div>

      {/* Combat Area */}
      <div 
        className="flex-1 relative flex flex-col items-center justify-center cursor-crosshair overflow-hidden"
        onClick={handleClick}
      >
        {isBoss && !isDefeated && (
          <div className="absolute top-4 w-full text-center animate-bounce">
            <span className="bg-red-500 text-white px-4 py-1 rounded-full font-black tracking-widest text-sm shadow-lg">
              WARNING: BOSS
            </span>
          </div>
        )}

        {/* Monster */}
        <AnimatePresence mode="wait">
          {!isDefeated && (
            <motion.div
              key={currentMonsterIndex}
              initial={{ scale: 0, opacity: 0, y: 50 }}
              animate={{ 
                scale: isHit ? 0.8 : 1, 
                opacity: 1,
                y: isHit ? 10 : 0,
                rotate: isHit ? (Math.random() - 0.5) * 30 : 0,
                filter: isHit ? 'brightness(1.5) contrast(1.2)' : 'brightness(1) contrast(1)'
              }}
              transition={{ type: "spring", stiffness: 500, damping: 15 }}
              exit={{ scale: 0, opacity: 0, rotate: 180, y: -50 }}
              whileTap={{ scale: 0.9 }}
              className="relative"
            >
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className={cn(
                  "flex items-center justify-center drop-shadow-2xl select-none",
                  isBoss ? "text-[150px]" : "text-[120px]"
                )}
              >
                {monsterData.emoji}
              </motion.div>
              <motion.div 
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut", delay: 0.5 }}
                className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap font-black text-slate-800 bg-white/90 px-4 py-2 rounded-2xl shadow-sm border-2 border-slate-200"
              >
                {monsterData.name}
              </motion.div>
            </motion.div>
          )}
          
          {isDefeated && droppedDiamonds.length === 0 && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1.5, rotate: 0 }}
              exit={{ scale: 0, opacity: 0 }}
              className="text-8xl drop-shadow-xl"
            >
              💥
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dropped Diamonds */}
        <AnimatePresence>
          {droppedDiamonds.map(diamond => (
            <motion.div
              key={diamond.id}
              initial={{ scale: 0, x: 0, y: 0 }}
              animate={{ scale: 1, x: diamond.x, y: diamond.y }}
              exit={{ scale: 0, y: -200, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="absolute text-4xl cursor-pointer drop-shadow-lg z-20"
              onClick={(e) => {
                e.stopPropagation();
                collectDiamond(diamond.id);
              }}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.8 }}
            >
              💎
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Damage Numbers */}
        {damageNumbers.map(dn => (
          <motion.div
            key={dn.id}
            initial={{ opacity: 1, y: dn.y, x: dn.x, scale: 0.5 }}
            animate={{ opacity: 0, y: dn.y - 100, scale: 1.5 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="absolute text-red-500 font-black text-2xl pointer-events-none drop-shadow-md z-10"
            style={{ left: 0, top: 0 }}
          >
            -{dn.dmg}
          </motion.div>
        ))}

        {/* HP Bar */}
        {!isDefeated && (
          <div className="absolute top-6 w-3/4 max-w-xs h-6 bg-slate-200 rounded-full overflow-hidden shadow-inner border-2 border-white">
            <motion.div 
              className={cn(
                "h-full transition-all duration-200",
                hp / maxHp > 0.5 ? "bg-green-500" : hp / maxHp > 0.2 ? "bg-yellow-500" : "bg-red-500"
              )}
              style={{ width: `${(hp / maxHp) * 100}%` }}
            />
            <div className="absolute inset-0 flex items-center justify-center text-xs font-black text-white drop-shadow-md">
              {hp} / {maxHp}
            </div>
          </div>
        )}

      </div>

      {/* No Attacks Hint - Moved to bottom above nav bar */}
      {attacks <= 0 && !isDefeated && (
        <div className="px-6 pb-4 z-30">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/95 backdrop-blur-sm py-3 px-5 rounded-3xl border-4 border-rose-100 shadow-xl flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="bg-rose-100 p-2 rounded-2xl">
                <span className="text-2xl">⚔️</span>
              </div>
              <div className="flex flex-col">
                <span className="text-rose-600 font-black text-base leading-tight">没力气啦！</span>
                <span className="text-emerald-600 font-bold text-xs leading-tight">快去完成任务获取攻击次数吧</span>
              </div>
            </div>
            <motion.div 
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="bg-rose-500 text-white font-black text-sm px-4 py-2 rounded-2xl shadow-sm"
            >
              0
            </motion.div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
