import { createClient } from '@/lib/supabase/server';

/**
 * 初始化新用户数据
 * 为新注册用户创建credits记录和user_profiles记录
 */
export async function initializeUserData(userId: string) {
  try {
    const supabase = await createClient();

    // 创建用户积分记录
    const { error: creditsError } = await supabase
      .from('credits')
      .upsert({
        user_id: userId,
        balance: 10, // 新用户赠送10玄机值
        total_earned: 10,
        total_spent: 0
      }, {
        onConflict: 'user_id'
      });

    if (creditsError) {
      console.error('创建用户积分记录失败:', creditsError);
    }

    // 创建用户档案记录
    const { error: profileError } = await supabase
      .from('user_profiles')
      .upsert({
        user_id: userId,
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
        user_id: userId,
        amount: 10,
        type: 'earn',
        description: '新用户注册赠送',
        balance_after: 10
      });

    if (transactionError) {
      console.error('记录积分交易失败:', transactionError);
    }

    return { success: true };
  } catch (error) {
    console.error('初始化用户数据失败:', error);
    return { success: false, error };
  }
}