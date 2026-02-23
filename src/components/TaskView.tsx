import { useGameStore } from '../store';
import { cn } from '../lib/utils';
import { CheckCircle2, Circle, Star } from 'lucide-react';
import { motion } from 'motion/react';

export default function TaskView() {
  const { tasks } = useGameStore();

  return (
    <div className="p-4 h-full flex flex-col bg-emerald-50/50">
      <div className="mb-6 bg-white p-6 rounded-3xl shadow-sm border-2 border-emerald-100 relative overflow-hidden">
        <div className="absolute -right-4 -top-4 text-6xl opacity-20">📝</div>
        <h2 className="text-3xl font-black text-emerald-800 tracking-tight flex items-center gap-2">
          今日任务 <Star className="text-amber-400 fill-amber-400" />
        </h2>
        <p className="text-emerald-600 font-bold text-sm mt-2">完成任务，找爸爸妈妈换取攻击次数！</p>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pb-20 px-2">
        {tasks.map((task, index) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            key={task.id}
            className={cn(
              "p-5 rounded-3xl border-4 transition-all flex items-center justify-between shadow-sm",
              task.isCompleted 
                ? "bg-slate-100 border-slate-200 opacity-70 grayscale-[0.5]" 
                : "bg-white border-emerald-200 hover:border-emerald-300 hover:-translate-y-1 hover:shadow-md"
            )}
          >
            <div className="flex items-center gap-4">
              {task.isCompleted ? (
                <CheckCircle2 className="text-emerald-500" size={36} />
              ) : (
                <Circle className="text-slate-300" size={36} />
              )}
              <div>
                <h3 className={cn(
                  "font-black text-xl mb-1",
                  task.isCompleted ? "text-slate-500 line-through" : "text-slate-800"
                )}>
                  {task.name}
                </h3>
                <div className="bg-rose-100 text-rose-600 font-black text-sm inline-flex items-center gap-1 px-3 py-1 rounded-full border-2 border-rose-200">
                  <span>⚔️</span> +{task.attackReward ?? task.coinReward ?? 10} 攻击
                </div>
              </div>
            </div>
            
            {!task.isCompleted && (
              <div className="text-sm font-black text-amber-600 bg-amber-100 px-4 py-2 rounded-2xl border-2 border-amber-200 animate-pulse">
                待确认
              </div>
            )}
            {task.isCompleted && (
              <div className="text-sm font-black text-emerald-600 bg-emerald-100 px-4 py-2 rounded-2xl border-2 border-emerald-200">
                已完成
              </div>
            )}
          </motion.div>
        ))}
        
        {tasks.length === 0 && (
          <div className="text-center text-slate-400 mt-10 bg-white p-8 rounded-3xl border-2 border-dashed border-slate-300">
            <div className="text-6xl mb-4">🤷‍♂️</div>
            <p className="font-bold text-lg">还没有任务哦，请爸爸妈妈添加吧！</p>
          </div>
        )}
      </div>
    </div>
  );
}
