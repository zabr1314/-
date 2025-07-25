import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateLiuyaoInterpretation, type LiuyaoInput, type LiuyaoResult } from '@/lib/ai/deepseek';
import { generateLiuyaoReading, type LiuyaoInput as FortuneInput } from '@/lib/fortune/liuyao';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // 验证用户登录状态
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: '用户未登录' }, { status: 401 });
    }

    // 解析请求数据
    const body = await request.json();
    const { inputData } = body as { inputData: LiuyaoInput };

    // 验证必填字段
    if (!inputData.category) {
      return NextResponse.json({ error: '请选择问题类别' }, { status: 400 });
    }

    // 检查用户玄机值余额
    const { data: credits } = await supabase
      .from('credits')
      .select('balance')
      .eq('user_id', user.id)
      .single();

    if (!credits || credits.balance < 5) {
      return NextResponse.json({ error: '玄机值不足，请先充值' }, { status: 400 });
    }

    // 转换输入格式，添加用户ID以增加个性化
    const fortuneInput: FortuneInput = {
      question: inputData.question,
      category: inputData.category,
      method: 'time', // 使用时间起卦法
      userId: user.id  // 传递用户ID，增加起卦的个性化因素
    };

    // 生成六爻卦象
    const fortuneResult = generateLiuyaoReading(fortuneInput);
    const rawResult: LiuyaoResult = {
      hexagram: fortuneResult.hexagram,
      upperTrigram: fortuneResult.upperTrigram,
      lowerTrigram: fortuneResult.lowerTrigram,
      changingLines: fortuneResult.changingLines,
      finalHexagram: fortuneResult.finalHexagram || fortuneResult.hexagram,
      meaning: fortuneResult.meaning
    };

    // 调用AI生成解读
    const aiInterpretation = await generateLiuyaoInterpretation(inputData, rawResult);

    // 扣除玄机值
    await supabase.rpc('update_user_credits', {
      p_user_id: user.id,
      p_amount: -5,
      p_type: 'spend',
      p_description: '六爻占卜'
    });

    // 生成推算标题
    const title = inputData.question 
      ? inputData.question.slice(0, 20) + (inputData.question.length > 20 ? '...' : '')
      : `${inputData.category}占卜`;

    // 保存推算记录
    const { data: reading, error: insertError } = await supabase
      .from('readings')
      .insert({
        user_id: user.id,
        type: 'liuyao',
        title,
        input_data: inputData,
        raw_result: rawResult,
        ai_interpretation: JSON.stringify(aiInterpretation),
        credits_cost: 5,
        status: 'completed'
      })
      .select()
      .single();

    if (insertError) {
      console.error('保存推算记录失败:', insertError);
      return NextResponse.json({ error: '保存失败，请重试' }, { status: 500 });
    }

    return NextResponse.json({
      reading_id: reading.id,
      input_data: inputData,
      raw_result: rawResult,
      ai_interpretation: aiInterpretation,
      credits_used: 5
    });

  } catch (error) {
    console.error('六爻占卜错误:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : '占卜失败，请稍后重试' 
    }, { status: 500 });
  }
}

