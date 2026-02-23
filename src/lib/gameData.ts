export const STAGES = [
  {
    id: 0,
    name: '卫生大作战',
    bg: 'bg-blue-100',
    monsters: [
      { name: '牙菌斑小兵', emoji: '🦠', hpBase: 10 },
      { name: '不洗手泥怪', emoji: '💩', hpBase: 10 },
      { name: '臭袜子精', emoji: '🧦', hpBase: 10 },
      { name: '灰尘团子', emoji: '💨', hpBase: 10 },
      { name: '脏衣服怪', emoji: '👕', hpBase: 10 },
    ],
    boss: { name: '蛀牙大魔王', emoji: '🦷', hpBase: 30, isBoss: true }
  },
  {
    id: 1,
    name: '饮食大保卫',
    bg: 'bg-green-100',
    monsters: [
      { name: '挑食小鬼', emoji: '🥦', hpBase: 10 },
      { name: '可乐水母', emoji: '🥤', hpBase: 10 },
      { name: '剩饭怪', emoji: '🍚', hpBase: 10 },
      { name: '糖果小偷', emoji: '🍬', hpBase: 10 },
      { name: '炸鸡恶魔', emoji: '🍗', hpBase: 10 },
    ],
    boss: { name: '零食贪吃龙', emoji: '🐲', hpBase: 30, isBoss: true }
  },
  {
    id: 2,
    name: '作息大挑战',
    bg: 'bg-indigo-100',
    monsters: [
      { name: '赖床小猪', emoji: '🐷', hpBase: 10 },
      { name: '手机恶魔', emoji: '📱', hpBase: 10 },
      { name: '不睡觉夜猫', emoji: '🐱', hpBase: 10 },
      { name: '电视迷', emoji: '📺', hpBase: 10 },
      { name: '游戏机怪', emoji: '🎮', hpBase: 10 },
    ],
    boss: { name: '拖拉大王', emoji: '🦥', hpBase: 30, isBoss: true }
  },
  {
    id: 3,
    name: '礼貌与秩序',
    bg: 'bg-orange-100',
    monsters: [
      { name: '抢玩具大盗', emoji: '🦝', hpBase: 10 },
      { name: '尖叫小怪', emoji: '😱', hpBase: 10 },
      { name: '乱丢怪', emoji: '🗑️', hpBase: 10 },
      { name: '打断精', emoji: '🗣️', hpBase: 10 },
      { name: '推人恶霸', emoji: '🦏', hpBase: 10 },
    ],
    boss: { name: '破坏大猩猩', emoji: '🦍', hpBase: 30, isBoss: true }
  },
  {
    id: 4,
    name: '学习大冒险',
    bg: 'bg-yellow-100',
    monsters: [
      { name: '走神小鸟', emoji: '🐦', hpBase: 10 },
      { name: '粗心大意怪', emoji: '🤷', hpBase: 10 },
      { name: '橡皮擦小偷', emoji: '🧽', hpBase: 10 },
      { name: '涂鸦恶魔', emoji: '🖍️', hpBase: 10 },
      { name: '作业拖延兽', emoji: '🐌', hpBase: 10 },
    ],
    boss: { name: '厌学大魔王', emoji: '👿', hpBase: 30, isBoss: true }
  },
  {
    id: 5,
    name: '运动大闯关',
    bg: 'bg-red-100',
    monsters: [
      { name: '沙发土豆', emoji: '🥔', hpBase: 10 },
      { name: '怕累小鬼', emoji: '🥵', hpBase: 10 },
      { name: '宅家蜗牛', emoji: '🐌', hpBase: 10 },
      { name: '不爱走路怪', emoji: '🚶‍♂️', hpBase: 10 },
      { name: '懒惰树懒', emoji: '🦥', hpBase: 10 },
    ],
    boss: { name: '肥胖大怪兽', emoji: '🐘', hpBase: 30, isBoss: true }
  }
];
