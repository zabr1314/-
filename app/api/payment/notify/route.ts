import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { processPaymentNotification, type ZpayNotification } from '@/lib/payment/zpay';

export async function GET(request: NextRequest) {
  return handlePaymentNotification(request);
}

export async function POST(request: NextRequest) {
  return handlePaymentNotification(request);
}

async function handlePaymentNotification(request: NextRequest) {
  try {
    console.log('收到支付通知:', request.url);
    
    // 获取通知参数
    const url = new URL(request.url);
    const params = Object.fromEntries(url.searchParams);
    
    console.log('通知参数:', params);

    // 验证必要参数
    const requiredFields = ['pid', 'name', 'money', 'out_trade_no', 'trade_no', 'trade_status', 'type', 'sign'];
    for (const field of requiredFields) {
      if (!params[field]) {
        console.error(`缺少必要参数: ${field}`);
        return new NextResponse('缺少必要参数', { status: 400 });
      }
    }

    const notification: ZpayNotification = {
      pid: params.pid,
      name: params.name,
      money: params.money,
      out_trade_no: params.out_trade_no,
      trade_no: params.trade_no,
      param: params.param,
      trade_status: params.trade_status,
      type: params.type,
      sign: params.sign,
      sign_type: params.sign_type || 'MD5'
    };

    // 处理支付通知
    const result = processPaymentNotification(notification);
    
    if (!result.isValid) {
      console.error('签名验证失败');
      return new NextResponse('签名验证失败', { status: 400 });
    }

    if (!result.isSuccess) {
      console.log('支付未成功，状态:', notification.trade_status);
      return new NextResponse('success', { status: 200 });
    }

    // 查询订单是否存在
    const supabase = await createClient();
    const { data: payment, error: selectError } = await supabase
      .from('payments')
      .select('*')
      .eq('order_id', result.orderId)
      .single();

    if (selectError || !payment) {
      console.error('订单不存在:', result.orderId);
      return new NextResponse('订单不存在', { status: 404 });
    }

    // 检查订单是否已经处理
    if (payment.status === 'paid') {
      console.log('订单已处理:', result.orderId);
      return new NextResponse('success', { status: 200 });
    }

    // 验证金额
    if (parseFloat(result.amount) !== payment.amount) {
      console.error('金额不匹配:', result.amount, payment.amount);
      return new NextResponse('金额不匹配', { status: 400 });
    }

    // 开始数据库事务处理
    try {
      // 更新订单状态
      const { error: updateError } = await supabase
        .from('payments')
        .update({
          status: 'paid',
          zpay_trade_no: result.tradeNo,
          zpay_callback_data: notification,
          paid_at: new Date().toISOString()
        })
        .eq('id', payment.id);

      if (updateError) {
        throw updateError;
      }

      // 增加用户玄机值
      await supabase.rpc('update_user_credits', {
        p_user_id: payment.user_id,
        p_amount: payment.credits_amount,
        p_type: 'earn',
        p_description: `购买${payment.package_name}`,
        p_related_payment_id: payment.id
      });

      console.log('支付处理成功:', {
        orderId: result.orderId,
        userId: payment.user_id,
        amount: result.amount,
        credits: payment.credits_amount
      });

      return new NextResponse('success', { status: 200 });

    } catch (dbError) {
      console.error('数据库处理失败:', dbError);
      
      // 尝试回滚订单状态（如果需要的话）
      await supabase
        .from('payments')
        .update({ status: 'failed' })
        .eq('id', payment.id);

      return new NextResponse('处理失败', { status: 500 });
    }

  } catch (error) {
    console.error('支付通知处理错误:', error);
    return new NextResponse('处理失败', { status: 500 });
  }
}