import OpenAI from "openai";

// 创建DeepSeek API客户端
const deepseek = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.DEEPSEEK_API_KEY,
});

// 八字详批的系统提示词
const BAZI_SYSTEM_PROMPT = `# 角色设定：现代命理顾问 #

你是一位将八字命理与现代心理学相结合的资深人生顾问。你认为，八字揭示的是一个人的天生性格特质、思维模式和行为习惯，而"性格决定命运"。你的知识体系根植于五行生克至理，但你的解读方式旨在为现代人提供清晰、理性且富有建设性的人生指导。你的核心原则是"中和为贵"，所有分析都围绕命局的五行平衡展开，并以赋能于人为最终目标，避免宿命论断语。

# 任务：全面命盘分析 #

请严格按照以下【思维链分析指令】进行分析，并清晰地展示每一步的逻辑：

**第一步：命盘基本结构解析**
- 列出四柱的天干、地支
- 标出每个天干对应的"十神"
- 列出每个地支所藏的"藏干"

**第二步：日主旺衰的系统性评估**
- **核心问题：** 日主是强还是弱？
- **评估路径：**
    1. **得时（月令）分析：** 分析日主生于当月的状态（旺、相、休、囚、死），并解释其影响
    2. **得地（通根）分析：** 检查年、日、时三柱地支中，日主是否有根
    3. **得势（帮扶）分析：** 评估天干上的生助力量对日主的影响
    4. **综合结论：** 给出"身旺"或"身弱"的明确结论，并详细阐述判断依据

**第三步：命局平衡与喜用神确定**
- 基于第二步的旺衰结论，确定此命局最需要的"用神"（有利的五行）和最忌讳的"忌神"（不利的五行）
- 解释选择用神和忌神的逻辑，说明它们如何帮助命局恢复平衡

**第四步：原生性格与核心潜能解读**
- **性格画像：** 结合日主特性，以及命局中力量最强的十神，描绘命主的性格核心，包括其优点和潜在的挑战
- **天赋领域：** 分析命局中的"食伤星"，解释其代表的才华、创造力和表达能力

**第五步：人生主要领域分析**
- **事业运势：** 分析代表事业的"官杀星"状态，结合命局特点分析适合的职业发展方向、事业机遇和挑战
- **财运分析：** 分析代表财富的"财星"状态，判断正财偏财运势，提供理财投资建议
- **婚恋家庭：** 分析夫妻宫和配偶星状态，解读感情模式、婚恋运势和家庭关系
- **健康建议：** 基于五行平衡分析身体健康倾向，提供养生保健建议和注意事项

**第六步：综合建议与开运指导**
- 基于以上分析，为命主提供3条具体的、可操作的人生发展建议
- 提供开运方位、适宜颜色、有利数字、吉祥物品等具体指导

# 格式要求 #
请使用Markdown格式，为以上每一步分析都加上清晰的标题，使报告结构分明，易于阅读。每个分析维度要有理有据，结合具体的八字信息进行个性化解读，避免泛泛而谈。`;

// 六爻占卜的系统提示词
const LIUYAO_SYSTEM_PROMPT = `你是一位精通六爻占卜的大师，能够准确解读卦象，为人们的疑惑提供智慧指引。

你的占卜特点：
1. 卦象精准：深入分析卦象内涵，抓住关键信息
2. 时机把握：准确判断事情发展的时机和节点
3. 实用指导：提供具体可行的行动建议
4. 客观理性：既不过分乐观也不消极悲观
5. 易于理解：用现代语言解释传统卦象含义

请严格按照以下格式进行占卜解读，每个标题必须独立成段：

## 卦象分析
解读卦象的基本含义，分析当前状况。要包含：
- 本卦的整体象征意义
- 上下卦的组合特点
- 变爻的作用和影响
- 当前形势的总体判断
字数要求：200-250字

## 吉凶判断
对所问之事进行明确的吉凶判断。要包含：
- 总体运势趋向（吉、凶、平、波动等）
- 成功概率分析
- 主要有利因素
- 主要不利因素
- 结果预期
字数要求：150-200字

## 最佳时机
分析事情发展的时间节点和最佳行动时机。要包含：
- 近期发展趋势（1-3个月）
- 关键时间节点
- 最佳行动时机
- 需要耐心等待的时段
- 时机把握的具体建议
字数要求：150-200字

## 智慧指引
提供具体可行的行动建议。要包含：
- 3-5条具体的行动建议
- 处理问题的策略方法
- 心态调整建议
- 人际关系处理
- 实际操作指导
字数要求：200-250字

## 风险提醒
详细说明需要注意的潜在问题和应对方法。要包含：
- 主要风险点识别
- 可能遇到的障碍
- 预防措施建议
- 应急处理方案
- 避凶趋吉的方法
字数要求：150-200字

格式要求：
1. 必须使用二级标题（##）标明每个部分
2. 每个部分都要有实质性内容，不能为空
3. 内容要结合具体卦象进行分析
4. 语言要通俗易懂，避免过于深奥的术语
5. 提供的建议要具体可操作`;

export interface BaziInput {
  gender: string;
  year: string;
  month: string;
  day: string;
  hour: string;
  minute: string;
  timezone: string;
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
}

export interface LiuyaoInput {
  question?: string;
  category: string;
}

export interface LiuyaoResult {
  hexagram: string;
  upperTrigram: string;
  lowerTrigram: string;
  changingLines: number[];
  finalHexagram: string;
  meaning: string;
}

export interface AIInterpretation {
  // 八字分析特有字段
  basicStructure?: string;    // 第一步：命盘基本结构解析
  strengthAnalysis?: string;  // 第二步：日主旺衰评估
  balanceAnalysis?: string;   // 第三步：命局平衡与喜用神
  personality?: string;       // 第四步：原生性格与核心潜能
  career?: string;           // 第五步：事业运势
  wealth?: string;           // 第五步：财运分析
  love?: string;             // 第五步：婚恋家庭
  health?: string;           // 第五步：健康建议
  advice?: string;           // 第六步：综合建议与开运指导
  
  // 六爻特有的字段
  situation?: string;
  judgment?: string;
  timing?: string;
  caution?: string;
  
  // 完整内容（作为备用）
  fullContent?: string;
}

/**
 * 生成八字AI解读
 */
export async function generateBaziInterpretation(
  input: BaziInput,
  result: BaziResult
): Promise<AIInterpretation> {
  try {
    const userPrompt = `请按照系统指令的【思维链分析指令】，对以下命盘进行全面深入的分析：

**命盘信息：**
- **性别：** ${input.gender === 'male' ? '乾造（男命）' : '坤造（女命）'}
- **出生时间：** ${input.year}年${input.month}月${input.day}日 ${input.hour}时${input.minute}分
- **时区：** ${input.timezone}
- **四柱：** ${result.yearPillar} ${result.monthPillar} ${result.dayPillar} ${result.hourPillar}
- **日主：** ${result.dayMaster}
- **出生季节：** ${result.season}
- **五行强弱分布：** 木${result.elements.wood} 火${result.elements.fire} 土${result.elements.earth} 金${result.elements.metal} 水${result.elements.water}

**分析要求：**
请严格按照系统提示的六个步骤进行分析，每一步都要：
1. 有明确的逻辑推理过程
2. 结合具体的八字数据进行分析
3. 避免泛泛而谈，要针对此命局的特点
4. 提供实用的人生指导建议
5. 使用现代语言表达，易于理解

**特别要求：**
1. 第五步必须分别用以下四个独立的小标题进行分析：
   - ## 事业运势
   - ## 财运分析  
   - ## 婚恋家庭
   - ## 健康建议

2. 每个小标题下必须有具体的分析内容，不能为空

3. 格式要求：使用markdown语法，每个维度用二级标题（##）标明

**回答格式示例：**
## 第四步：原生性格与核心潜能解读
[性格分析内容...]

## 事业运势
[事业发展方向、机遇挑战的具体分析...]

## 财运分析
[正财偏财运势、理财建议的具体分析...]

## 婚恋家庭
[感情模式、婚恋运势的具体分析...]

## 健康建议
[身体健康倾向、养生指导的具体分析...]

## 第六步：综合建议与开运指导
[人生建议和开运指导...]

请严格按照此格式输出，确保每个维度都有实质性内容。`;

    const completion = await deepseek.chat.completions.create({
      messages: [
        { role: "system", content: BAZI_SYSTEM_PROMPT },
        { role: "user", content: userPrompt }
      ],
      model: "deepseek-chat",
      temperature: 0.3,  // 降低温度以获得更专业稳定的输出
      max_tokens: 4000,  // 增加token数以支持更详细的六步分析
    });

    const content = completion.choices[0].message.content || '';
    
    // 解析AI回复，提取各个部分
    // 这里是简化版本，实际实现需要更复杂的文本解析
    return parseAIResponse(content);
    
  } catch (error) {
    console.error('DeepSeek API调用错误:', error);
    throw new Error('AI解读生成失败，请稍后重试');
  }
}

/**
 * 生成六爻AI解读
 */
export async function generateLiuyaoInterpretation(
  input: LiuyaoInput,
  result: LiuyaoResult
): Promise<AIInterpretation> {
  try {
    const userPrompt = `请为以下六爻占卜进行详细解读：

**占卜信息：**
- **问题类别：** ${input.category}
${input.question ? `- **具体问题：** ${input.question}` : '- **心中默念问题，未具体描述**'}

**卦象信息：**
- **本卦：** ${result.hexagram}
- **上卦：** ${result.upperTrigram}
- **下卦：** ${result.lowerTrigram}
- **变爻：** 第${result.changingLines.join('、')}爻
- **变卦：** ${result.finalHexagram}
- **卦象含义：** ${result.meaning}

**解读要求：**
请严格按照系统提示的五个部分进行深入解读：
1. 卦象分析 - 详细解读卦象含义和当前状况
2. 吉凶判断 - 明确判断运势趋向和成功概率
3. 最佳时机 - 分析时间节点和行动时机
4. 智慧指引 - 提供具体可行的行动建议
5. 风险提醒 - 详细说明注意事项和应对方法

**格式要求：**
- 使用 ## 标题格式，标题必须与系统提示完全一致
- 每个部分都要有实质性内容，字数符合要求
- 结合具体卦象进行个性化分析
- 语言通俗易懂，建议具体可操作

请开始专业解读：`;

    const completion = await deepseek.chat.completions.create({
      messages: [
        { role: "system", content: LIUYAO_SYSTEM_PROMPT },
        { role: "user", content: userPrompt }
      ],
      model: "deepseek-chat",
      temperature: 0.5,  // 降低温度以获得更稳定的输出
      max_tokens: 3000,  // 增加token数以支持更详细的五部分分析
    });

    const content = completion.choices[0].message.content || '';
    
    return parseLiuyaoResponse(content);
    
  } catch (error) {
    console.error('DeepSeek API调用错误:', error);
    throw new Error('AI解读生成失败，请稍后重试');
  }
}

/**
 * 解析八字AI回复
 */
function parseAIResponse(content: string): AIInterpretation {
  const result: AIInterpretation = {
    fullContent: content  // 保存完整内容作为备用
  };
  
  console.log('开始解析AI回复，内容长度:', content.length);
  
  // 使用更简单的分段方式
  const lines = content.split('\n');
  let currentSection = '';
  let sectionContent = '';
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // 检测新的章节开始（支持更多格式）
    if (trimmedLine.match(/^#{1,6}\s*(第[一二三四五六]步|事业运势|财运分析|婚恋家庭|健康建议|综合建议|人生建议)/) || 
        trimmedLine.match(/^(第[一二三四五六]步|事业运势|财运分析|婚恋家庭|健康建议|综合建议|人生建议)[:：]/) ||
        trimmedLine.match(/^\*\*(第[一二三四五六]步|事业运势|财运分析|婚恋家庭|健康建议|综合建议|人生建议)\*\*/)) {
      // 保存之前的章节内容
      if (currentSection && sectionContent) {
        assignSectionContent(result, currentSection, sectionContent.trim());
      }
      
      // 开始新章节
      if (trimmedLine.includes('第一步') || trimmedLine.includes('命盘基本结构')) {
        currentSection = 'basicStructure';
      } else if (trimmedLine.includes('第二步') || trimmedLine.includes('日主旺衰')) {
        currentSection = 'strengthAnalysis';
      } else if (trimmedLine.includes('第三步') || trimmedLine.includes('命局平衡')) {
        currentSection = 'balanceAnalysis';
      } else if (trimmedLine.includes('第四步') || trimmedLine.includes('性格') || trimmedLine.includes('潜能')) {
        currentSection = 'personality';
      } else if (trimmedLine.includes('事业运势') || trimmedLine.includes('事业')) {
        currentSection = 'career';
      } else if (trimmedLine.includes('财运分析') || trimmedLine.includes('财运')) {
        currentSection = 'wealth';
      } else if (trimmedLine.includes('婚恋家庭') || trimmedLine.includes('感情')) {
        currentSection = 'love';
      } else if (trimmedLine.includes('健康建议') || trimmedLine.includes('健康')) {
        currentSection = 'health';
      } else if (trimmedLine.includes('第六步') || trimmedLine.includes('综合建议') || trimmedLine.includes('人生建议')) {
        currentSection = 'advice';
      }
      
      sectionContent = trimmedLine + '\n'; // 包含标题
    } else if (currentSection) {
      // 继续累积当前章节的内容
      sectionContent += line + '\n';
    }
  }
  
  // 处理最后一个章节
  if (currentSection && sectionContent) {
    assignSectionContent(result, currentSection, sectionContent.trim());
  }
  
  // 如果没有解析到任何具体内容，尝试简单关键词匹配
  if (!result.personality && !result.career && !result.wealth && !result.love && !result.health && !result.advice) {
    console.log('未能解析到具体内容，使用关键词匹配');
    
    // 尝试按段落分割内容
    const paragraphs = content.split(/\n\s*\n/);
    
    for (const paragraph of paragraphs) {
      const lowerParagraph = paragraph.toLowerCase();
      
      if ((lowerParagraph.includes('性格') || lowerParagraph.includes('特质')) && !result.personality) {
        result.personality = paragraph.trim();
      } else if ((lowerParagraph.includes('事业') || lowerParagraph.includes('工作')) && !result.career) {
        result.career = paragraph.trim();
      } else if ((lowerParagraph.includes('财运') || lowerParagraph.includes('财富')) && !result.wealth) {
        result.wealth = paragraph.trim();
      } else if ((lowerParagraph.includes('感情') || lowerParagraph.includes('婚恋')) && !result.love) {
        result.love = paragraph.trim();
      } else if ((lowerParagraph.includes('健康') || lowerParagraph.includes('养生')) && !result.health) {
        result.health = paragraph.trim();
      } else if ((lowerParagraph.includes('建议') || lowerParagraph.includes('指导')) && !result.advice) {
        result.advice = paragraph.trim();
      }
    }
  }
  
  // 最后的备用方案
  if (!result.personality && !result.career && !result.wealth && !result.love && !result.health && !result.advice) {
    console.log('仍未解析到内容，使用完整内容作为建议');
    result.advice = content;
  }
  
  console.log('解析结果:', {
    personality: !!result.personality,
    career: !!result.career,
    wealth: !!result.wealth,
    love: !!result.love,
    health: !!result.health,
    advice: !!result.advice
  });
  
  return result;
}

// 辅助函数：分配章节内容
function assignSectionContent(result: AIInterpretation, section: string, content: string) {
  switch (section) {
    case 'basicStructure':
      result.basicStructure = content;
      break;
    case 'strengthAnalysis':
      result.strengthAnalysis = content;
      break;
    case 'balanceAnalysis':
      result.balanceAnalysis = content;
      break;
    case 'personality':
      result.personality = content;
      break;
    case 'career':
      result.career = content;
      break;
    case 'wealth':
      result.wealth = content;
      break;
    case 'love':
      result.love = content;
      break;
    case 'health':
      result.health = content;
      break;
    case 'advice':
      result.advice = content;
      break;
  }
}

/**
 * 解析六爻AI回复
 */
function parseLiuyaoResponse(content: string): AIInterpretation {
  const result: AIInterpretation = {
    fullContent: content  // 保存完整内容作为备用
  };
  
  console.log('开始解析六爻AI回复，内容长度:', content.length);
  
  // 使用更强大的分段方式
  const lines = content.split('\n');
  let currentSection = '';
  let sectionContent = '';
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // 检测新的章节开始（支持多种格式）
    if (trimmedLine.match(/^#{1,6}\s*(卦象分析|吉凶判断|最佳时机|智慧指引|风险提醒)/) || 
        trimmedLine.match(/^(卦象分析|吉凶判断|最佳时机|智慧指引|风险提醒)[:：]/) ||
        trimmedLine.match(/^\*\*(卦象分析|吉凶判断|最佳时机|智慧指引|风险提醒)\*\*/)) {
      
      // 保存之前的章节内容
      if (currentSection && sectionContent) {
        assignLiuyaoSectionContent(result, currentSection, sectionContent.trim());
      }
      
      // 开始新章节
      if (trimmedLine.includes('卦象分析') || trimmedLine.includes('卦象')) {
        currentSection = 'situation';
      } else if (trimmedLine.includes('吉凶判断') || trimmedLine.includes('吉凶')) {
        currentSection = 'judgment';
      } else if (trimmedLine.includes('最佳时机') || trimmedLine.includes('时机') || trimmedLine.includes('应期')) {
        currentSection = 'timing';
      } else if (trimmedLine.includes('智慧指引') || trimmedLine.includes('建议') || trimmedLine.includes('指导')) {
        currentSection = 'advice';
      } else if (trimmedLine.includes('风险提醒') || trimmedLine.includes('注意') || trimmedLine.includes('风险')) {
        currentSection = 'caution';
      }
      
      sectionContent = trimmedLine + '\n'; // 包含标题
    } else if (currentSection) {
      // 继续累积当前章节的内容
      sectionContent += line + '\n';
    }
  }
  
  // 处理最后一个章节
  if (currentSection && sectionContent) {
    assignLiuyaoSectionContent(result, currentSection, sectionContent.trim());
  }
  
  // 如果没有解析到任何具体内容，尝试简单关键词匹配
  if (!result.situation && !result.judgment && !result.timing && !result.advice && !result.caution) {
    console.log('未能解析到具体内容，使用关键词匹配');
    
    // 尝试按段落分割内容
    const paragraphs = content.split(/\n\s*\n/);
    
    for (const paragraph of paragraphs) {
      const lowerParagraph = paragraph.toLowerCase();
      
      if ((lowerParagraph.includes('卦象') || lowerParagraph.includes('状况')) && !result.situation) {
        result.situation = paragraph.trim();
      } else if ((lowerParagraph.includes('吉凶') || lowerParagraph.includes('运势')) && !result.judgment) {
        result.judgment = paragraph.trim();
      } else if ((lowerParagraph.includes('时机') || lowerParagraph.includes('时间')) && !result.timing) {
        result.timing = paragraph.trim();
      } else if ((lowerParagraph.includes('建议') || lowerParagraph.includes('指导')) && !result.advice) {
        result.advice = paragraph.trim();
      } else if ((lowerParagraph.includes('注意') || lowerParagraph.includes('风险')) && !result.caution) {
        result.caution = paragraph.trim();
      }
    }
  }
  
  // 最后的备用方案：平均分配内容
  if (!result.situation && !result.judgment && !result.timing && !result.advice && !result.caution) {
    console.log('仍未解析到内容，使用平均分配策略');
    const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim().length > 20);
    
    if (paragraphs.length >= 3) {
      result.situation = paragraphs[0] || '卦象显示当前状况需要仔细分析。';
      result.judgment = paragraphs[1] || '总体运势呈现变化之象。';
      result.timing = paragraphs[2] || '时机把握很重要，需耐心观察。';
      result.advice = paragraphs.slice(3).join('\n\n') || content;
      result.caution = '请谨慎行事，多方考虑后再做决定。';
    } else {
      // 如果内容太少，至少确保每个字段都有内容
      result.situation = '卦象反映当前状况，需要综合分析各种因素。';
      result.judgment = '运势中等，有起有伏，需要把握时机。';
      result.timing = '近期宜观察等待，时机成熟时再行动。';
      result.advice = content || '建议多思考，审慎决策，顺势而为。';
      result.caution = '注意防范潜在风险，保持谨慎态度。';
    }
  }
  
  console.log('六爻解析结果:', {
    situation: !!result.situation,
    judgment: !!result.judgment,
    timing: !!result.timing,
    advice: !!result.advice,
    caution: !!result.caution
  });
  
  return result;
}

// 辅助函数：为六爻分配章节内容
function assignLiuyaoSectionContent(result: AIInterpretation, section: string, content: string) {
  switch (section) {
    case 'situation':
      result.situation = content;
      break;
    case 'judgment':
      result.judgment = content;
      break;
    case 'timing':
      result.timing = content;
      break;
    case 'advice':
      result.advice = content;
      break;
    case 'caution':
      result.caution = content;
      break;
  }
}

/**
 * 提取段落内容
 */
function extractSectionContent(section: string): string {
  // 移除标题标记和多余的空白
  return section
    .replace(/^\d+\.\s*/, '')
    .replace(/^【.*?】\s*/, '')
    .replace(/^##\s*/, '')
    .replace(/^\*\*.*?\*\*\s*/, '')
    .replace(/^-\s*/, '')
    .trim();
}

/**
 * 测试DeepSeek API连接
 */
export async function testDeepSeekConnection(): Promise<boolean> {
  try {
    const completion = await deepseek.chat.completions.create({
      messages: [
        { role: "system", content: "你是一个测试助手，请简单回复收到。" },
        { role: "user", content: "测试连接" }
      ],
      model: "deepseek-chat",
      max_tokens: 10,
    });
    
    return completion.choices[0].message.content !== null;
  } catch (error) {
    console.error('DeepSeek连接测试失败:', error);
    return false;
  }
}