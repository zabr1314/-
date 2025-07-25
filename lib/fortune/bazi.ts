/**
 * 八字排盘算法实现
 * 基于传统命理学理论，实现天干地支的计算
 */

// 天干数组
const HEAVENLY_STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];

// 地支数组
const EARTHLY_BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

// 五行属性映射
const FIVE_ELEMENTS = {
  '甲': '木', '乙': '木',
  '丙': '火', '丁': '火',
  '戊': '土', '己': '土',
  '庚': '金', '辛': '金',
  '壬': '水', '癸': '水',
  '子': '水', '丑': '土', '寅': '木', '卯': '木',
  '辰': '土', '巳': '火', '午': '火', '未': '土',
  '申': '金', '酉': '金', '戌': '土', '亥': '水'
};

// 月份地支对应
const MONTH_BRANCHES = ['寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑'];

// 时辰地支对应
const HOUR_BRANCHES = [
  '子', '丑', '寅', '卯', '辰', '巳',
  '午', '未', '申', '酉', '戌', '亥'
];

// 年干起月干表
const YEAR_MONTH_STEM = {
  '甲': ['丙', '丁', '戊', '己', '庚', '辛', '壬', '癸', '甲', '乙', '丙', '丁'],
  '己': ['丙', '丁', '戊', '己', '庚', '辛', '壬', '癸', '甲', '乙', '丙', '丁'],
  '乙': ['戊', '己', '庚', '辛', '壬', '癸', '甲', '乙', '丙', '丁', '戊', '己'],
  '庚': ['戊', '己', '庚', '辛', '壬', '癸', '甲', '乙', '丙', '丁', '戊', '己'],
  '丙': ['庚', '辛', '壬', '癸', '甲', '乙', '丙', '丁', '戊', '己', '庚', '辛'],
  '辛': ['庚', '辛', '壬', '癸', '甲', '乙', '丙', '丁', '戊', '己', '庚', '辛'],
  '丁': ['壬', '癸', '甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'],
  '壬': ['壬', '癸', '甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'],
  '戊': ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸', '甲', '乙'],
  '癸': ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸', '甲', '乙']
};

// 日干起时干表
const DAY_HOUR_STEM = {
  '甲': ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸', '甲', '乙'],
  '己': ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸', '甲', '乙'],
  '乙': ['丙', '丁', '戊', '己', '庚', '辛', '壬', '癸', '甲', '乙', '丙', '丁'],
  '庚': ['丙', '丁', '戊', '己', '庚', '辛', '壬', '癸', '甲', '乙', '丙', '丁'],
  '丙': ['戊', '己', '庚', '辛', '壬', '癸', '甲', '乙', '丙', '丁', '戊', '己'],
  '辛': ['戊', '己', '庚', '辛', '壬', '癸', '甲', '乙', '丙', '丁', '戊', '己'],
  '丁': ['庚', '辛', '壬', '癸', '甲', '乙', '丙', '丁', '戊', '己', '庚', '辛'],
  '壬': ['庚', '辛', '壬', '癸', '甲', '乙', '丙', '丁', '戊', '己', '庚', '辛'],
  '戊': ['壬', '癸', '甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'],
  '癸': ['壬', '癸', '甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']
};

export interface BaziInput {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  gender: 'male' | 'female';
}

export interface BaziResult {
  yearPillar: string;
  monthPillar: string;
  dayPillar: string;
  hourPillar: string;
  dayMaster: string;
  season: string;
  elements: {
    wood: number;
    fire: number;
    earth: number;
    metal: number;
    water: number;
  };
  strength: 'strong' | 'weak' | 'balanced';
  favorableElements: string[];
  unfavorableElements: string[];
}

/**
 * 计算年柱天干地支
 */
function calculateYearPillar(year: number): string {
  // 以1900年为庚子年基准
  const baseYear = 1900;
  const yearDiff = year - baseYear;
  
  const stemIndex = yearDiff % 10;
  const branchIndex = yearDiff % 12;
  
  // 1900年是庚子年，庚在天干中是第7位（从0开始），子在地支中是第1位
  const baseStemIndex = 6; // 庚
  const baseBranchIndex = 0; // 子
  
  const actualStemIndex = (baseStemIndex + stemIndex) % 10;
  const actualBranchIndex = (baseBranchIndex + yearDiff) % 12;
  
  return HEAVENLY_STEMS[actualStemIndex] + EARTHLY_BRANCHES[actualBranchIndex];
}

/**
 * 计算月柱天干地支
 */
function calculateMonthPillar(year: number, month: number): string {
  const yearPillar = calculateYearPillar(year);
  const yearStem = yearPillar[0];
  
  const monthBranch = MONTH_BRANCHES[month - 1];
  const monthStem = YEAR_MONTH_STEM[yearStem as keyof typeof YEAR_MONTH_STEM]?.[month - 1] || '甲';
  
  return monthStem + monthBranch;
}

/**
 * 计算日柱天干地支（简化算法）
 */
function calculateDayPillar(year: number, month: number, day: number): string {
  // 使用简化的日柱计算方法
  // 实际应用中需要更精确的万年历算法
  const totalDays = calculateTotalDays(year, month, day);
  
  // 以1900年1月1日为甲子日基准
  const baseDayIndex = 15; // 1900年1月1日是癸亥日，从甲子开始算是第15天
  const dayIndex = (totalDays + baseDayIndex) % 60;
  
  const stemIndex = dayIndex % 10;
  const branchIndex = dayIndex % 12;
  
  return HEAVENLY_STEMS[stemIndex] + EARTHLY_BRANCHES[branchIndex];
}

/**
 * 计算时柱天干地支
 */
function calculateHourPillar(dayPillar: string, hour: number): string {
  const dayMaster = dayPillar[0];
  
  // 确定时辰
  let hourIndex = Math.floor((hour + 1) / 2) % 12;
  if (hour === 23) hourIndex = 0; // 23点属于子时
  
  const hourBranch = HOUR_BRANCHES[hourIndex];
  const hourStem = DAY_HOUR_STEM[dayMaster as keyof typeof DAY_HOUR_STEM]?.[hourIndex] || '甲';
  
  return hourStem + hourBranch;
}

/**
 * 计算从1900年1月1日到指定日期的总天数
 */
function calculateTotalDays(year: number, month: number, day: number): number {
  let totalDays = 0;
  
  // 计算年数
  for (let y = 1900; y < year; y++) {
    totalDays += isLeapYear(y) ? 366 : 365;
  }
  
  // 计算月数
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  for (let m = 1; m < month; m++) {
    if (m === 2 && isLeapYear(year)) {
      totalDays += 29;
    } else {
      totalDays += daysInMonth[m - 1];
    }
  }
  
  // 加上天数
  totalDays += day - 1;
  
  return totalDays;
}

/**
 * 判断是否为闰年
 */
function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

/**
 * 统计五行个数
 */
function countElements(pillars: string[]): { wood: number; fire: number; earth: number; metal: number; water: number } {
  const elements = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
  
  pillars.forEach(pillar => {
    for (const char of pillar) {
      const element = FIVE_ELEMENTS[char as keyof typeof FIVE_ELEMENTS];
      if (element) {
        switch (element) {
          case '木': elements.wood++; break;
          case '火': elements.fire++; break;
          case '土': elements.earth++; break;
          case '金': elements.metal++; break;
          case '水': elements.water++; break;
        }
      }
    }
  });
  
  return elements;
}

/**
 * 判断日主强弱
 */
function calculateStrength(dayMaster: string, elements: { wood: number; fire: number; earth: number; metal: number; water: number }, season: string): 'strong' | 'weak' | 'balanced' {
  const dayElement = FIVE_ELEMENTS[dayMaster as keyof typeof FIVE_ELEMENTS];
  let strength = 0;
  
  // 根据五行属性计算基础分数
  switch (dayElement) {
    case '木':
      strength += elements.wood * 2 + elements.water * 1 - elements.gold * 1 - elements.fire * 0.5;
      break;
    case '火':
      strength += elements.fire * 2 + elements.wood * 1 - elements.water * 1 - elements.earth * 0.5;
      break;
    case '土':
      strength += elements.earth * 2 + elements.fire * 1 - elements.wood * 1 - elements.metal * 0.5;
      break;
    case '金':
      strength += elements.metal * 2 + elements.earth * 1 - elements.fire * 1 - elements.water * 0.5;
      break;
    case '水':
      strength += elements.water * 2 + elements.metal * 1 - elements.earth * 1 - elements.wood * 0.5;
      break;
  }
  
  // 根据季节调整
  const seasonBonus = getSeasonBonus(dayElement, season);
  strength += seasonBonus;
  
  if (strength > 3) return 'strong';
  if (strength < -1) return 'weak';
  return 'balanced';
}

/**
 * 获取季节加成
 */
function getSeasonBonus(element: string, season: string): number {
  const seasonElements = {
    '春季': '木',
    '夏季': '火',
    '秋季': '金',
    '冬季': '水'
  };
  
  if (seasonElements[season as keyof typeof seasonElements] === element) {
    return 2; // 当季得力
  }
  return 0;
}

/**
 * 确定喜用神和忌神
 */
function getFavorableElements(dayMaster: string, strength: string): { favorable: string[]; unfavorable: string[] } {
  const dayElement = FIVE_ELEMENTS[dayMaster as keyof typeof FIVE_ELEMENTS];
  
  if (strength === 'strong') {
    // 身强喜泄耗
    switch (dayElement) {
      case '木': return { favorable: ['火', '金'], unfavorable: ['水', '木'] };
      case '火': return { favorable: ['土', '水'], unfavorable: ['木', '火'] };
      case '土': return { favorable: ['金', '木'], unfavorable: ['火', '土'] };
      case '金': return { favorable: ['水', '火'], unfavorable: ['土', '金'] };
      case '水': return { favorable: ['木', '土'], unfavorable: ['金', '水'] };
    }
  } else if (strength === 'weak') {
    // 身弱喜生扶
    switch (dayElement) {
      case '木': return { favorable: ['水', '木'], unfavorable: ['金', '火'] };
      case '火': return { favorable: ['木', '火'], unfavorable: ['水', '土'] };
      case '土': return { favorable: ['火', '土'], unfavorable: ['木', '金'] };
      case '金': return { favorable: ['土', '金'], unfavorable: ['火', '水'] };
      case '水': return { favorable: ['金', '水'], unfavorable: ['土', '木'] };
    }
  }
  
  // 平衡状态
  return { favorable: ['木', '火', '土', '金', '水'], unfavorable: [] };
}

/**
 * 确定季节
 */
function getSeason(month: number): string {
  if (month >= 2 && month <= 4) return '春季';
  if (month >= 5 && month <= 7) return '夏季';
  if (month >= 8 && month <= 10) return '秋季';
  return '冬季';
}

/**
 * 主要的八字排盘函数
 */
export function calculateBaziChart(input: BaziInput): BaziResult {
  const { year, month, day, hour, minute } = input;
  
  // 计算四柱
  const yearPillar = calculateYearPillar(year);
  const monthPillar = calculateMonthPillar(year, month);
  const dayPillar = calculateDayPillar(year, month, day);
  const hourPillar = calculateHourPillar(dayPillar, hour);
  
  // 日主
  const dayMaster = dayPillar[0];
  
  // 季节
  const season = getSeason(month);
  
  // 统计五行
  const pillars = [yearPillar, monthPillar, dayPillar, hourPillar];
  const elements = countElements(pillars);
  
  // 判断强弱
  const strength = calculateStrength(dayMaster, elements, season);
  
  // 确定喜忌神
  const { favorable, unfavorable } = getFavorableElements(dayMaster, strength);
  
  return {
    yearPillar,
    monthPillar,
    dayPillar,
    hourPillar,
    dayMaster: dayMaster + FIVE_ELEMENTS[dayMaster as keyof typeof FIVE_ELEMENTS],
    season,
    elements,
    strength,
    favorableElements: favorable,
    unfavorableElements: unfavorable
  };
}