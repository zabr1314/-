import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateBaziInterpretation, type BaziInput, type BaziResult } from '@/lib/ai/deepseek';
import { calculateBaziChart, type BaziInput as FortuneInput } from '@/lib/fortune/bazi';

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
    const { inputData } = body as { inputData: BaziInput };

    // 验证必填字段
    if (!inputData.year || !inputData.month || !inputData.day || !inputData.gender) {
      return NextResponse.json({ error: '请填写完整的出生信息' }, { status: 400 });
    }

    // 检查用户玄机值余额
    const { data: credits } = await supabase
      .from('credits')
      .select('balance')
      .eq('user_id', user.id)
      .single();

    if (!credits || credits.balance < 15) {
      return NextResponse.json({ error: '玄机值不足，请先充值' }, { status: 400 });
    }

    // 转换输入格式
    const fortuneInput: FortuneInput = {
      year: parseInt(inputData.year),
      month: parseInt(inputData.month),
      day: parseInt(inputData.day),
      hour: parseInt(inputData.hour),
      minute: parseInt(inputData.minute) || 0,
      gender: inputData.gender === '男' ? 'male' : 'female'
    };

    // 生成八字排盘结果
    const fortuneResult = calculateBaziChart(fortuneInput);
    const rawResult: BaziResult = {
      yearPillar: fortuneResult.yearPillar,
      monthPillar: fortuneResult.monthPillar,
      dayPillar: fortuneResult.dayPillar,
      hourPillar: fortuneResult.hourPillar,
      dayMaster: fortuneResult.dayMaster,
      season: fortuneResult.season,
      elements: fortuneResult.elements
    };

    // 调用AI生成解读
    const aiInterpretation = await generateBaziInterpretation(inputData, rawResult);

    // 扣除玄机值
    await supabase.rpc('update_user_credits', {
      p_user_id: user.id,
      p_amount: -15,
      p_type: 'spend',
      p_description: '八字详批推算'
    });

    // 保存推算记录
    const { data: reading, error: insertError } = await supabase
      .from('readings')
      .insert({
        user_id: user.id,
        type: 'bazi',
        title: `${inputData.year}年运势详批`,
        input_data: inputData,
        raw_result: rawResult,
        ai_interpretation: JSON.stringify(aiInterpretation),
        credits_cost: 15,
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
      credits_used: 15
    });

  } catch (error) {
    console.error('八字推算错误:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : '推算失败，请稍后重试' 
    }, { status: 500 });
  }
}

