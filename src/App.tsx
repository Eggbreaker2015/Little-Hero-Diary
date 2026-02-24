/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Gamepad2, CheckSquare, Store, Settings } from 'lucide-react';
import GameView from './components/GameView';
import TaskView from './components/TaskView';
import ShopView from './components/ShopView';
import ParentView from './components/ParentView';
import { useGameStore } from './store';
import { cn } from './lib/utils';
import { motion } from 'motion/react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'game' | 'tasks' | 'shop' | 'parent'>('game');
  const { attacks, diamonds } = useGameStore();
  const displayAttacks = attacks || 0;

  return (
    <div className="flex flex-col h-screen bg-sky-100 text-slate-900 font-sans max-w-md mx-auto shadow-2xl overflow-hidden relative border-x-4 border-sky-200">
      {/* Header */}
      <header className="flex justify-between items-center p-4 bg-white/80 backdrop-blur-md shadow-sm z-10 rounded-b-3xl mx-2 mt-2 border-b-4 border-sky-200">
        <div className="flex items-center gap-3">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: -5 }}
            className="bg-rose-100 text-rose-600 px-4 py-2 rounded-2xl font-black text-lg flex items-center gap-2 shadow-sm border-2 border-rose-200"
          >
            <span className="text-2xl">⚔️</span> {displayAttacks}
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="bg-cyan-100 text-cyan-600 px-4 py-2 rounded-2xl font-black text-lg flex items-center gap-2 shadow-sm border-2 border-cyan-200"
          >
            <span className="text-2xl">💎</span> {diamonds}
          </motion.div>
        </div>
        <div className="font-black text-lg text-indigo-800 bg-indigo-100 px-4 py-2 rounded-2xl border-2 border-indigo-200">
          小英雄日记
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative">
        {activeTab === 'game' && <GameView />}
        {activeTab === 'tasks' && <TaskView />}
        {activeTab === 'shop' && <ShopView />}
        {activeTab === 'parent' && <ParentView />}
      </main>

      {/* Bottom Navigation */}
      <nav className="flex justify-around items-center bg-white border-t-4 border-slate-100 pb-safe pt-4 px-2 z-10 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
        <NavItem 
          icon={<Gamepad2 size={28} />} 
          label="打怪兽" 
          isActive={activeTab === 'game'} 
          onClick={() => setActiveTab('game')} 
          color="text-rose-500"
          activeBg="bg-rose-100"
        />
        <NavItem 
          icon={<CheckSquare size={28} />} 
          label="做任务" 
          isActive={activeTab === 'tasks'} 
          onClick={() => setActiveTab('tasks')} 
          color="text-emerald-500"
          activeBg="bg-emerald-100"
        />
        <NavItem 
          icon={<Store size={28} />} 
          label="许愿池" 
          isActive={activeTab === 'shop'} 
          onClick={() => setActiveTab('shop')} 
          color="text-amber-500"
          activeBg="bg-amber-100"
        />
        <NavItem 
          icon={<Settings size={28} />} 
          label="家长" 
          isActive={activeTab === 'parent'} 
          onClick={() => setActiveTab('parent')} 
          color="text-slate-500"
          activeBg="bg-slate-100"
        />
      </nav>
    </div>
  );
}

function NavItem({ 
  icon, label, isActive, onClick, color, activeBg 
}: { 
  icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void,
  color: string, activeBg: string
}) {
  return (
    <motion.button 
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center w-20 h-20 rounded-3xl transition-all duration-300",
        isActive ? `${activeBg} ${color} shadow-inner border-b-4 border-white/50` : "text-slate-400 hover:bg-slate-50"
      )}
    >
      <div className={cn("mb-1", isActive && "animate-bounce")}>{icon}</div>
      <span className="text-xs font-black">{label}</span>
    </motion.button>
  );
}
