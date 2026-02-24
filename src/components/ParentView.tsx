import React, { useState, useEffect } from 'react';
import { useGameStore } from '../store';
import { cn } from '../lib/utils';
import { sfx } from '../lib/sounds';
import { Lock, Unlock, Plus, Trash2, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ParentView() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [question, setQuestion] = useState({ a: 0, b: 0, answer: 0 });
  const [inputAnswer, setInputAnswer] = useState('');
  const [activeTab, setActiveTab] = useState<'tasks' | 'rewards' | 'settings'>('tasks');

  const { 
    tasks, rewards, 
    approveTask, resetTask, addTask, removeTask,
    approveReward, addReward, removeReward,
    normalMonsterDiamondReward, bossMonsterDiamondReward,
    setNormalMonsterDiamondReward, setBossMonsterDiamondReward
  } = useGameStore();

  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskAttack, setNewTaskAttack] = useState('50');
  
  const [newRewardName, setNewRewardName] = useState('');
  const [newRewardDiamond, setNewRewardDiamond] = useState('10');
  const [newRewardIcon, setNewRewardIcon] = useState('🎁');

  const rewardIcons = ['🎁', '🎮', '🧸', '🍬', '🍦', '🚗', '📚', '🎨', '🎫', '🚲', '🍔', '🎡'];

  useEffect(() => {
    generateQuestion();
  }, []);

  const generateQuestion = () => {
    const a = Math.floor(Math.random() * 8) + 2; // 2-9
    const b = Math.floor(Math.random() * 8) + 2; // 2-9
    setQuestion({ a, b, answer: a * b });
    setInputAnswer('');
  };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (parseInt(inputAnswer) === question.answer) {
      setIsAuthenticated(true);
    } else {
      alert('密码错误，请重试');
      generateQuestion();
    }
  };

  const handleApproveReward = (id: string) => {
    approveReward(id);
    sfx.playSuccess();
  };

  const handleApproveTask = (id: string) => {
    approveTask(id);
    sfx.playSuccess();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.2 }
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="p-6 h-full flex flex-col items-center justify-center bg-indigo-900 text-white relative overflow-hidden">
        <div className="absolute top-10 left-10 text-6xl opacity-20 animate-pulse">🔒</div>
        <div className="absolute bottom-10 right-10 text-6xl opacity-20 animate-bounce">🛡️</div>
        
        <div className="bg-indigo-800 p-8 rounded-[2rem] w-full max-w-sm shadow-2xl text-center border-4 border-indigo-700 relative z-10">
          <div className="bg-indigo-900 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-indigo-700 shadow-inner">
            <Lock className="text-indigo-400" size={48} />
          </div>
          <h2 className="text-3xl font-black mb-2 tracking-tight">家长控制端</h2>
          <p className="text-indigo-300 font-bold text-sm mb-8">请回答以下问题以解锁</p>
          
          <form onSubmit={handleAuth} className="space-y-6">
            <div className="text-5xl font-black tracking-widest bg-indigo-900 py-6 rounded-3xl border-2 border-indigo-700 shadow-inner text-indigo-100">
              {question.a} × {question.b} = ?
            </div>
            <input
              type="number"
              value={inputAnswer}
              onChange={(e) => setInputAnswer(e.target.value)}
              className="w-full text-center text-4xl font-black py-4 rounded-2xl bg-indigo-700 text-white border-4 border-indigo-600 focus:border-indigo-400 focus:outline-none placeholder:text-indigo-500 transition-colors"
              placeholder="?"
              autoFocus
            />
            <button 
              type="submit"
              className="w-full py-5 rounded-2xl font-black text-xl bg-indigo-500 hover:bg-indigo-400 text-white transition-all transform hover:scale-105 active:scale-95 shadow-lg border-b-4 border-indigo-600"
            >
              解锁
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-indigo-50/50">
      <div className="p-5 bg-white border-b-4 border-indigo-100 flex justify-between items-center shadow-sm relative z-20">
        <h2 className="text-2xl font-black flex items-center gap-2 text-indigo-900">
          <Unlock size={24} className="text-indigo-500" /> 家长控制端
        </h2>
        <button 
          onClick={() => setIsAuthenticated(false)}
          className="text-sm font-black text-indigo-600 bg-indigo-100 px-4 py-2 rounded-xl hover:bg-indigo-200 transition-colors border-2 border-indigo-200"
        >
          锁定
        </button>
      </div>

      <div className="flex p-2 bg-slate-100 m-4 rounded-xl">
        <button
          onClick={() => setActiveTab('tasks')}
          className={cn(
            "flex-1 py-2 text-sm font-bold rounded-lg transition-all",
            activeTab === 'tasks' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500"
          )}
        >
          任务管理
        </button>
        <button
          onClick={() => setActiveTab('rewards')}
          className={cn(
            "flex-1 py-2 text-sm font-bold rounded-lg transition-all",
            activeTab === 'rewards' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500"
          )}
        >
          愿望管理
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={cn(
            "flex-1 py-2 text-sm font-bold rounded-lg transition-all",
            activeTab === 'settings' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500"
          )}
        >
          游戏设置
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-20">
        {activeTab === 'tasks' && (
          <div className="space-y-6">
            {/* Add Task */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-700 mb-3 text-sm">添加新任务</h3>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="任务名称 (如: 扫地)"
                  value={newTaskName}
                  onChange={(e) => setNewTaskName(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                />
                <input 
                  type="number" 
                  placeholder="攻击次数"
                  value={newTaskAttack}
                  onChange={(e) => setNewTaskAttack(e.target.value)}
                  className="w-24 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                />
                <button 
                  onClick={() => {
                    if (newTaskName && newTaskAttack) {
                      addTask({ name: newTaskName, attackReward: parseInt(newTaskAttack) });
                      setNewTaskName('');
                    }
                  }}
                  className="bg-indigo-500 text-white p-2 rounded-xl hover:bg-indigo-600"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>

            {/* Task List */}
            <div className="space-y-3">
              {tasks.map(task => (
                <div key={task.id} className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-700">{task.name}</div>
                    <div className="text-xs text-red-600 font-bold mt-1">⚔️ {task.attackReward ?? task.coinReward ?? 10} 次攻击</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!task.isCompleted ? (
                      <button 
                        onClick={() => handleApproveTask(task.id)}
                        className="bg-green-100 text-green-700 px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1 hover:bg-green-200"
                      >
                        <Check size={16} /> 确认完成
                      </button>
                    ) : (
                      <button 
                        onClick={() => resetTask(task.id)}
                        className="bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg text-sm font-bold hover:bg-slate-200"
                      >
                        重置
                      </button>
                    )}
                    <button 
                      onClick={() => removeTask(task.id)}
                      className="text-red-400 p-1.5 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'rewards' && (
          <div className="space-y-6">
            {/* Add Reward */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-700 mb-3 text-sm">添加新愿望</h3>
              <div className="flex flex-col gap-3">
                <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
                  {rewardIcons.map(icon => (
                    <button
                      key={icon}
                      onClick={() => setNewRewardIcon(icon)}
                      className={cn(
                        "text-2xl p-2 rounded-xl border-2 transition-all flex-shrink-0",
                        newRewardIcon === icon ? "border-indigo-500 bg-indigo-50 scale-110" : "border-transparent hover:bg-slate-50"
                      )}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="愿望名称 (如: 去游乐园)"
                    value={newRewardName}
                    onChange={(e) => setNewRewardName(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                  />
                  <input 
                    type="number" 
                    placeholder="钻石"
                    value={newRewardDiamond}
                    onChange={(e) => setNewRewardDiamond(e.target.value)}
                    className="w-20 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                  />
                  <button 
                    onClick={() => {
                      if (newRewardName && newRewardDiamond) {
                        addReward({ name: newRewardName, diamondCost: parseInt(newRewardDiamond), icon: newRewardIcon });
                        setNewRewardName('');
                      }
                    }}
                    className="bg-indigo-500 text-white p-2 rounded-xl hover:bg-indigo-600 flex-shrink-0"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Reward List */}
            <div className="space-y-3">
              {rewards.map(reward => (
                <div key={reward.id} className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
                  <div className="text-3xl mr-3">{reward.icon || '🎁'}</div>
                  <div className="flex-1 pr-2">
                    <div className="font-bold text-slate-700">{reward.name}</div>
                    <div className="text-xs text-blue-600 font-bold mt-1">💎 {reward.diamondCost} 钻石</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {reward.isPending ? (
                      <button 
                        onClick={() => handleApproveReward(reward.id)}
                        className="bg-orange-100 text-orange-700 px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1 hover:bg-orange-200 animate-pulse"
                      >
                        <Check size={16} /> 确认兑现
                      </button>
                    ) : reward.isRedeemed ? (
                      <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-md">已兑现</span>
                    ) : (
                      <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-md">未申请</span>
                    )}
                    <button 
                      onClick={() => removeReward(reward.id)}
                      className="text-red-400 p-1.5 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-700 mb-4">怪物掉落设置</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-2">普通怪物掉落钻石数量</label>
                  <input 
                    type="number" 
                    value={normalMonsterDiamondReward !== undefined ? normalMonsterDiamondReward : 1}
                    onChange={(e) => setNormalMonsterDiamondReward(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-2">Boss怪物掉落钻石数量</label>
                  <input 
                    type="number" 
                    value={bossMonsterDiamondReward !== undefined ? bossMonsterDiamondReward : 5}
                    onChange={(e) => setBossMonsterDiamondReward(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
