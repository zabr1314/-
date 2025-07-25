/**
 * 六爻起卦算法实现
 * 基于传统六爻占卜理论，实现卦象生成和分析
 */

// 八卦基本信息
const TRIGRAMS = {
  '乾': { binary: '111', element: '金', nature: '天', symbol: '☰' },
  '坤': { binary: '000', element: '土', nature: '地', symbol: '☷' },
  '震': { binary: '001', element: '木', nature: '雷', symbol: '☳' },
  '巽': { binary: '110', element: '木', nature: '风', symbol: '☴' },
  '坎': { binary: '010', element: '水', nature: '水', symbol: '☵' },
  '离': { binary: '101', element: '火', nature: '火', symbol: '☲' },
  '艮': { binary: '100', element: '土', nature: '山', symbol: '☶' },
  '兑': { binary: '011', element: '金', nature: '泽', symbol: '☱' }
};

// 六十四卦名称对照表
const HEXAGRAM_NAMES = [
  '乾为天', '坤为地', '水雷屯', '山水蒙', '水天需', '天水讼', '地水师', '水地比',
  '风天小畜', '天泽履', '地天泰', '天地否', '天火同人', '火天大有', '地山谦', '雷地豫',
  '泽雷随', '山风蛊', '地泽临', '风地观', '火雷噬嗑', '山火贲', '山地剥', '地雷复',
  '天雷无妄', '山天大畜', '山雷颐', '泽风大过', '坎为水', '离为火', '泽山咸', '雷风恒',
  '天山遁', '雷天大壮', '火地晋', '地火明夷', '风火家人', '火泽睽', '水山蹇', '雷水解',
  '山泽损', '风雷益', '泽天夬', '天风姤', '泽地萃', '地风升', '泽水困', '水风井',
  '泽火革', '火风鼎', '震为雷', '艮为山', '风山渐', '雷泽归妹', '雷火丰', '火山旅',
  '巽为风', '兑为泽', '风水涣', '水泽节', '风泽中孚', '雷山小过', '水火既济', '火水未济'
];

// 卦象含义数据库
const HEXAGRAM_MEANINGS = {
  '乾为天': {
    meaning: '刚健中正，自强不息',
    nature: '大吉',
    advice: '君子以自强不息，积极进取',
    timing: '时机正好，宜主动出击'
  },
  '坤为地': {
    meaning: '厚德载物，顺势而为',
    nature: '中吉',
    advice: '以柔克刚，包容万物',
    timing: '宜守不宜攻，顺势而为'
  },
  '地火明夷': {
    meaning: '光明被掩，暂时困顿',
    nature: '凶',
    advice: '韬光养晦，等待时机',
    timing: '暂时不利，需要耐心等待'
  },
  '地水师': {
    meaning: '统帅之道，团队协作',
    nature: '中吉',
    advice: '需要团队配合，制定策略',
    timing: '宜团结众人，统一行动'
  },
  '水雷屯': {
    meaning: '万物始生，艰难创业',
    nature: '小吉',
    advice: '创业维艰，需要坚持',
    timing: '初期困难，但前景可期'
  },
  '山水蒙': {
    meaning: '启蒙教育，去除蒙昧',
    nature: '平',
    advice: '多学习，求师问道',
    timing: '需要学习提升，不宜冒进'
  }
  // 可以继续添加更多卦象含义
};

export interface LiuyaoInput {
  question?: string;
  category: string;
  method?: 'time' | 'manual' | 'random';
  userId?: string; // 用户ID，增加个性化因素
}

export interface LiuyaoResult {
  hexagram: string;
  hexagramNumber: number;
  upperTrigram: string;
  lowerTrigram: string;
  changingLines: number[];
  finalHexagram?: string;
  finalHexagramNumber?: number;
  meaning: string;
  nature: string;
  advice: string;
  timing: string;
  analysis: {
    worldLine: number;
    responseLine: number;
    bodyLine: number;
    useLine: number;
  };
}

/**
 * 改进的时间起卦法 - 增加随机性和个性化因素
 */
function timeBasedDivination(question?: string, userId?: string): { lines: number[], changingLines: number[] } {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const second = now.getSeconds();
  const millisecond = now.getMilliseconds();
  
  // 创建更复杂的种子值
  let baseSeed = year * 10000 + month * 1000 + day * 100 + hour * 60 + minute;
  
  // 加入问题的哈希值（如果有的话）
  if (question) {
    const questionHash = simpleHash(question);
    baseSeed = baseSeed ^ questionHash;
  }
  
  // 加入用户ID的哈希值（如果有的话）
  if (userId) {
    const userHash = simpleHash(userId);
    baseSeed = baseSeed ^ (userHash * 7919); // 使用质数增加随机性
  }
  
  // 加入毫秒级时间戳，确保每次都不同
  const timeStamp = second * 1000 + millisecond;
  baseSeed = baseSeed ^ (timeStamp * 3571); // 使用另一个质数
  
  // 使用改进的随机数生成器
  const rng = createSeededRNG(baseSeed);
  
  // 生成更随机的卦象
  const lines: number[] = [];
  const changingLines: number[] = [];
  
  // 直接为每一爻生成随机值，而不是先生成八卦再组合
  for (let i = 0; i < 6; i++) {
    const randomValue = rng.next();
    
    // 生成爻的阴阳（0或1）
    const lineValue = Math.floor(randomValue * 2);
    lines.push(lineValue);
    
    // 随机决定是否为动爻（概率约16.7%，符合传统六爻理论）
    if (randomValue > 0.833) {
      changingLines.push(i + 1);
    }
  }
  
  // 如果没有动爻，随机选择一个（确保至少有一个动爻）
  if (changingLines.length === 0) {
    const randomLine = Math.floor(rng.next() * 6) + 1;
    changingLines.push(randomLine);
  }
  
  // 限制动爻数量（传统上一般不超过3个）
  if (changingLines.length > 3) {
    changingLines.splice(3);
  }
  
  return {
    lines,
    changingLines: changingLines.sort((a, b) => a - b)
  };
}

/**
 * 简单哈希函数
 */
function simpleHash(str: string): number {
  let hash = 0;
  if (str.length === 0) return hash;
  
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // 转换为32位整数
  }
  
  return Math.abs(hash);
}

/**
 * 创建基于种子的随机数生成器
 */
function createSeededRNG(seed: number) {
  let current = seed;
  
  return {
    next(): number {
      // 使用线性同余生成器算法
      current = (current * 1664525 + 1013904223) % Math.pow(2, 32);
      return Math.abs(current) / Math.pow(2, 32);
    }
  };
}

/**
 * 随机起卦法（模拟摇卦）
 */
function randomDivination(): { lines: number[], changingLines: number[] } {
  const lines: number[] = [];
  const changingLines: number[] = [];
  
  // 摇六次卦，每次得到一爻
  for (let i = 0; i < 6; i++) {
    const coins = [Math.random() > 0.5 ? 1 : 0, Math.random() > 0.5 ? 1 : 0, Math.random() > 0.5 ? 1 : 0];
    const sum = coins.reduce((a, b) => a + b, 0);
    
    switch (sum) {
      case 0: // 三个背，老阴，动爻
        lines.push(0);
        changingLines.push(i + 1);
        break;
      case 1: // 一正二背，少阳
        lines.push(1);
        break;
      case 2: // 二正一背，少阴
        lines.push(0);
        break;
      case 3: // 三个正，老阳，动爻
        lines.push(1);
        changingLines.push(i + 1);
        break;
    }
  }
  
  return { lines, changingLines };
}

/**
 * 根据索引获取三卦名称
 */
function getTrigramByIndex(index: number): string {
  const trigramNames = ['坤', '震', '坎', '兑', '艮', '离', '巽', '乾'];
  return trigramNames[index];
}

/**
 * 根据六爻数组计算卦象编号
 */
function calculateHexagramNumber(lines: number[]): number {
  let number = 0;
  for (let i = 0; i < 6; i++) {
    if (lines[i] === 1) {
      number += Math.pow(2, i);
    }
  }
  return number;
}

/**
 * 获取卦象名称
 */
function getHexagramName(lines: number[]): string {
  const upperLines = lines.slice(3, 6);
  const lowerLines = lines.slice(0, 3);
  
  const upperTrigram = getTrigramByLines(upperLines);
  const lowerTrigram = getTrigramByLines(lowerLines);
  
  // 查找对应的六十四卦
  const hexagramIndex = findHexagramIndex(upperTrigram, lowerTrigram);
  return HEXAGRAM_NAMES[hexagramIndex] || '未知卦象';
}

/**
 * 根据爻线获取三卦名称
 */
function getTrigramByLines(lines: number[]): string {
  const binary = lines.reverse().join('');
  for (const [name, info] of Object.entries(TRIGRAMS)) {
    if (info.binary === binary) {
      return name;
    }
  }
  return '乾'; // 默认值
}

/**
 * 查找六十四卦索引
 */
function findHexagramIndex(upper: string, lower: string): number {
  const mapping: { [key: string]: number } = {
    '乾乾': 0, '坤坤': 1, '坎震': 2, '艮坎': 3, '坎乾': 4, '乾坎': 5, '坤坎': 6, '坎坤': 7,
    '乾巽': 8, '兑乾': 9, '坤乾': 10, '乾坤': 11, '乾离': 12, '离乾': 13, '坤艮': 14, '震坤': 15,
    '兑震': 16, '艮巽': 17, '坤兑': 18, '巽坤': 19, '离震': 20, '艮离': 21, '艮坤': 22, '坤震': 23,
    '乾震': 24, '艮乾': 25, '艮震': 26, '兑巽': 27, '坎坎': 28, '离离': 29, '兑艮': 30, '震巽': 31,
    '乾艮': 32, '震乾': 33, '离坤': 34, '坤离': 35, '巽离': 36, '离兑': 37, '坎艮': 38, '震坎': 39,
    '艮兑': 40, '巽震': 41, '兑乾': 42, '乾巽': 43, '兑坤': 44, '坤巽': 45, '兑坎': 46, '坎巽': 47,
    '兑离': 48, '离巽': 49, '震震': 50, '艮艮': 51, '巽艮': 52, '震兑': 53, '震离': 54, '离艮': 55,
    '巽巽': 56, '兑兑': 57, '巽坎': 58, '坎兑': 59, '巽兑': 60, '震艮': 61, '坎离': 62, '离坎': 63
  };
  
  return mapping[upper + lower] || 0;
}

/**
 * 计算变卦
 */
function calculateChangedHexagram(originalLines: number[], changingLines: number[]): { lines: number[], name: string } {
  const changedLines = [...originalLines];
  
  // 改变动爻的阴阳
  changingLines.forEach(lineNumber => {
    const index = lineNumber - 1;
    changedLines[index] = changedLines[index] === 1 ? 0 : 1;
  });
  
  const changedName = getHexagramName(changedLines);
  return { lines: changedLines, name: changedName };
}

/**
 * 分析卦象的世应、体用关系
 */
function analyzeHexagram(lines: number[], hexagramName: string): {
  worldLine: number;
  responseLine: number;
  bodyLine: number;
  useLine: number;
} {
  // 简化的世应分析
  // 实际应用中需要更复杂的分析算法
  
  const worldLine = 3; // 第三爻为世爻（简化）
  const responseLine = 6; // 第六爻为应爻（简化）
  const bodyLine = 2; // 体卦主爻
  const useLine = 5; // 用卦主爻
  
  return {
    worldLine,
    responseLine,
    bodyLine,
    useLine
  };
}

/**
 * 获取卦象详细含义
 */
function getHexagramMeaning(hexagramName: string): {
  meaning: string;
  nature: string;
  advice: string;
  timing: string;
} {
  const info = HEXAGRAM_MEANINGS[hexagramName as keyof typeof HEXAGRAM_MEANINGS];
  if (info) {
    return info;
  }
  
  // 默认含义
  return {
    meaning: '变化之象，需要审时度势',
    nature: '平',
    advice: '保持平和心态，顺应变化',
    timing: '时机尚未明朗，需要观察'
  };
}

/**
 * 主要的六爻起卦函数
 */
export function generateLiuyaoReading(input: LiuyaoInput): LiuyaoResult {
  const { method = 'time', question, userId } = input;
  
  // 根据方法起卦
  let divination;
  if (method === 'random') {
    divination = randomDivination();
  } else {
    // 传递问题和用户ID到时间起卦函数
    divination = timeBasedDivination(question, userId);
  }
  
  const { lines, changingLines } = divination;
  
  // 获取本卦信息
  const hexagramName = getHexagramName(lines);
  const hexagramNumber = calculateHexagramNumber(lines);
  
  // 分析上下卦
  const upperLines = lines.slice(3, 6);
  const lowerLines = lines.slice(0, 3);
  const upperTrigram = getTrigramByLines([...upperLines]);
  const lowerTrigram = getTrigramByLines([...lowerLines]);
  
  // 计算变卦（如果有动爻）
  let finalHexagram, finalHexagramNumber;
  if (changingLines.length > 0) {
    const changed = calculateChangedHexagram(lines, changingLines);
    finalHexagram = changed.name;
    finalHexagramNumber = calculateHexagramNumber(changed.lines);
  }
  
  // 获取卦象含义
  const meaningInfo = getHexagramMeaning(hexagramName);
  
  // 分析卦象结构
  const analysis = analyzeHexagram(lines, hexagramName);
  
  return {
    hexagram: hexagramName,
    hexagramNumber,
    upperTrigram,
    lowerTrigram,
    changingLines,
    finalHexagram,
    finalHexagramNumber,
    meaning: meaningInfo.meaning,
    nature: meaningInfo.nature,
    advice: meaningInfo.advice,
    timing: meaningInfo.timing,
    analysis
  };
}