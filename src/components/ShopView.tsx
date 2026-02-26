import { useGameStore } from '../store';
import { cn } from '../lib/utils';
import { Gift, Clock, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export default function ShopView() {
  const { rewards, diamonds, requestReward } = useGameStore();

  return (
    <div className="p-4 h-full flex flex-col bg-amber-50/50">
      <div className="mb-6 bg-white p-6 rounded-3xl shadow-sm border-2 border-amber-100 relative overflow-hidden">
        <div className="absolute -right-4 -top-4 text-6xl opacity-20">🎁</div>
        <h2 className="text-3xl font-black text-amber-800 tracking-tight flex items-center gap-2">
          许愿池 <Sparkles className="text-amber-400 fill-amber-400" />
        </h2>
        <p className="text-amber-600 font-bold text-sm mt-2">用打败怪兽获得的钻石兑换奖励吧！</p>
      </div>

      <div className="flex-1 overflow-y-auto grid grid-cols-2 gap-4 pb-32 content-start px-2">
        {rewards.map((reward, index) => (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            key={reward.id}
            className={cn(
              "p-4 rounded-[2rem] border-4 flex flex-col items-center text-center transition-all relative overflow-hidden shadow-sm min-h-[180px]",
              reward.isRedeemed ? "bg-slate-50 border-slate-200 opacity-70 grayscale-[0.5]" :
              reward.isPending ? "bg-orange-50 border-orange-200" :
              "bg-white border-cyan-100 hover:border-cyan-300 hover:-translate-y-1 hover:shadow-md"
            )}
          >
            {/* Diamond Cost Badge */}
            {!reward.isRedeemed && (
              <div className="absolute top-3 right-3 bg-cyan-50 text-cyan-600 px-2 py-1 rounded-xl text-[10px] font-black border border-cyan-100 flex items-center gap-0.5 shadow-sm z-10">
                <span>💎</span>{reward.diamondCost}
              </div>
            )}

            <div className="text-5xl my-2 drop-shadow-sm">{reward.icon || '🎁'}</div>
            
            <div className="flex-1 flex flex-col justify-between w-full gap-2">
              <h3 className="font-black text-slate-700 text-sm leading-tight line-clamp-2 px-1">
                {reward.name}
              </h3>
              
              {reward.isRedeemed ? (
                <div className="w-full py-1.5 rounded-xl font-black text-[10px] bg-slate-200 text-slate-500 border-2 border-slate-300 uppercase tracking-wider">
                  已兑现
                </div>
              ) : reward.isPending ? (
                <div className="w-full py-1.5 rounded-xl font-black text-[10px] bg-orange-100 text-orange-600 flex items-center justify-center gap-1 border-2 border-orange-200 animate-pulse">
                  <Clock size={12} /> 待确认
                </div>
              ) : (
                <button
                  onClick={() => requestReward(reward.id)}
                  disabled={diamonds < reward.diamondCost}
                  className={cn(
                    "w-full py-2 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-1 border-2",
                    diamonds >= reward.diamondCost 
                      ? "bg-cyan-500 text-white border-cyan-600 shadow-[0_2px_0_rgb(8,145,178)] active:translate-y-[1px] active:shadow-none" 
                      : "bg-slate-100 text-slate-400 border-slate-200 opacity-60"
                  )}
                >
                  {diamonds >= reward.diamondCost ? "立即兑换" : `还差 ${reward.diamondCost - diamonds} 💎`}
                </button>
              )}
            </div>
          </motion.div>
        ))}

        {rewards.length === 0 && (
          <div className="col-span-2 text-center text-slate-400 mt-10 bg-white p-8 rounded-3xl border-2 border-dashed border-slate-300">
            <div className="text-6xl mb-4">🏪</div>
            <p className="font-bold text-lg">商店里还没有商品哦，请爸爸妈妈添加吧！</p>
          </div>
        )}
      </div>
    </div>
  );
}
