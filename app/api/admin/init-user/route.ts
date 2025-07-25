import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // 验证用户登录状态
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: '用户未登录' }, { status: 401 });
    }

    // 检查用户是否已经有积分记录
    const { data: existingCredits } = await supabase
      .from('credits')
      .select('id')
      .eq('user_id', user.id)
      .single();

    // 如果没有积分记录，创建新用户数据
    if (!existingCredits) {
      // 创建用户积分记录
      const { error: creditsError } = await supabase
        .from('credits')
        .insert({
          user_id: user.id,
          balance: 10, // 新用户赠送10玄机值
          total_earned: 10,
          total_spent: 0
        });

      if (creditsError) {
        console.error('创建用户积分记录失败:', creditsError);
      }

      // 创建用户档案记录
      const { error: profileError } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: user.id,
          settings: {
            notifications: true,
            theme: 'dark'
          }
        }, {
          onConflict: 'user_id'
        });

      if (profileError) {
        console.error('创建用户档案失败:', profileError);
      }

      // 记录积分获得交易
      const { error: transactionError } = await supabase
        .from('credit_transactions')
        .insert({
          user_id: user.id,
          amount: 10,
          type: 'earn',
          description: '新用户注册赠送',
          balance_after: 10
        });

      if (transactionError) {
        console.error('记录积分交易失败:', transactionError);
      }
    }

    return NextResponse.json({ success: true, message: '用户数据初始化完成' });

  } catch (error) {
    console.error('初始化用户数据错误:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : '初始化失败' 
    }, { status: 500 });
  }
}