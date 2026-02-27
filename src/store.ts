import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Task = {
  id: string;
  name: string;
  attackReward?: number;
  coinReward?: number;
  isCompleted: boolean;
  icon?: string;
};

export type Reward = {
  id: string;
  name: string;
  diamondCost: number;
  isRedeemed: boolean;
  isPending: boolean;
  icon?: string;
};

export type GameState = {
  attacks: number;
  diamonds: number;
  currentStage: number;
  currentMonsterIndex: number;
  currentMonsterHp: number | null;
  tasks: Task[];
  rewards: Reward[];
  normalMonsterDiamondReward: number;
  bossMonsterDiamondReward: number;
  showMonsterEyes: boolean;
  
  // Actions
  addAttacks: (amount: number) => void;
  useAttack: () => boolean;
  addDiamonds: (amount: number) => void;
  spendDiamonds: (amount: number) => boolean;
  nextMonster: () => void;
  setMonsterHp: (hp: number) => void;
  setNormalMonsterDiamondReward: (amount: number) => void;
  setBossMonsterDiamondReward: (amount: number) => void;
  setShowMonsterEyes: (show: boolean) => void;
  
  // Parent Actions
  addTask: (task: Omit<Task, 'id' | 'isCompleted'>) => void;
  removeTask: (id: string) => void;
  updateTask: (id: string, updates: Partial<Omit<Task, 'id' | 'isCompleted'>>) => void;
  approveTask: (id: string) => void;
  resetTask: (id: string) => void;
  
  addReward: (reward: Omit<Reward, 'id' | 'isRedeemed' | 'isPending'>) => void;
  removeReward: (id: string) => void;
  updateReward: (id: string, updates: Partial<Omit<Reward, 'id' | 'isRedeemed' | 'isPending'>>) => void;
  requestReward: (id: string) => void;
  approveReward: (id: string) => void;
};

const INITIAL_TASKS: Task[] = [
  { id: '1', name: '按时刷牙', attackReward: 50, isCompleted: false, icon: '🦷' },
  { id: '2', name: '自己穿衣', attackReward: 30, isCompleted: false, icon: '👕' },
  { id: '3', name: '收拾玩具', attackReward: 40, isCompleted: false, icon: '🧸' },
  { id: '4', name: '光盘行动', attackReward: 50, isCompleted: false, icon: '🍽️' },
];

const INITIAL_REWARDS: Reward[] = [
  { id: '1', name: '看动画片15分钟', diamondCost: 10, isRedeemed: false, isPending: false },
  { id: '2', name: '买一个冰淇淋', diamondCost: 30, isRedeemed: false, isPending: false },
  { id: '3', name: '周末去动物园', diamondCost: 100, isRedeemed: false, isPending: false },
];

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      attacks: 0,
      diamonds: 0,
      currentStage: 0,
      currentMonsterIndex: 0,
      currentMonsterHp: null,
      tasks: INITIAL_TASKS,
      rewards: INITIAL_REWARDS,
      normalMonsterDiamondReward: 1,
      bossMonsterDiamondReward: 5,
      showMonsterEyes: true,

      addAttacks: (amount) => set((state) => ({ attacks: (state.attacks || 0) + amount })),
      
      useAttack: () => {
        const attacks = get().attacks || 0;
        if (attacks > 0) {
          set({ attacks: attacks - 1 });
          return true;
        }
        return false;
      },

      addDiamonds: (amount) => set((state) => ({ diamonds: state.diamonds + amount })),
      
      spendDiamonds: (amount) => {
        const { diamonds } = get();
        if (diamonds >= amount) {
          set({ diamonds: diamonds - amount });
          return true;
        }
        return false;
      },

      setMonsterHp: (hp) => set({ currentMonsterHp: hp }),
      
      setNormalMonsterDiamondReward: (amount) => set({ normalMonsterDiamondReward: amount }),
      setBossMonsterDiamondReward: (amount) => set({ bossMonsterDiamondReward: amount }),
      setShowMonsterEyes: (show) => set({ showMonsterEyes: show }),

      nextMonster: () => set((state) => {
        let nextIndex = state.currentMonsterIndex + 1;
        let nextStage = state.currentStage;
        
        if (nextIndex > 5) { // 0-4 normal, 5 boss
          nextIndex = 0;
          nextStage = state.currentStage + 1;
        }
        
        return { currentMonsterIndex: nextIndex, currentStage: nextStage, currentMonsterHp: null };
      }),

      addTask: (task) => set((state) => ({
        tasks: [...state.tasks, { ...task, id: Date.now().toString(), isCompleted: false }]
      })),
      
      removeTask: (id) => set((state) => ({
        tasks: state.tasks.filter(t => t.id !== id)
      })),

      updateTask: (id, updates) => set((state) => ({
        tasks: state.tasks.map(t => t.id === id ? { ...t, ...updates } : t)
      })),

      approveTask: (id) => set((state) => {
        const task = state.tasks.find(t => t.id === id);
        if (task && !task.isCompleted) {
          const reward = task.attackReward ?? task.coinReward ?? 10;
          return {
            tasks: state.tasks.map(t => t.id === id ? { ...t, isCompleted: true } : t),
            attacks: (state.attacks || 0) + reward
          };
        }
        return state;
      }),

      resetTask: (id) => set((state) => ({
        tasks: state.tasks.map(t => t.id === id ? { ...t, isCompleted: false } : t)
      })),

      addReward: (reward) => set((state) => ({
        rewards: [...state.rewards, { ...reward, id: Date.now().toString(), isRedeemed: false, isPending: false }]
      })),

      removeReward: (id) => set((state) => ({
        rewards: state.rewards.filter(r => r.id !== id)
      })),

      updateReward: (id, updates) => set((state) => ({
        rewards: state.rewards.map(r => r.id === id ? { ...r, ...updates } : r)
      })),

      requestReward: (id) => {
        const state = get();
        const reward = state.rewards.find(r => r.id === id);
        if (reward && !reward.isPending && !reward.isRedeemed && state.spendDiamonds(reward.diamondCost)) {
          set({
            rewards: state.rewards.map(r => r.id === id ? { ...r, isPending: true } : r)
          });
        }
      },

      approveReward: (id) => set((state) => ({
        rewards: state.rewards.map(r => r.id === id ? { ...r, isPending: false, isRedeemed: true } : r)
      })),
    }),
    {
      name: 'habit-hero-storage',
    }
  )
);
