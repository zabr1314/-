import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { 
  createPaymentOrder, 
  generateOrderId, 
  getProductName, 
  getPackageInfo 
} from '@/lib/payment/zpay';

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
    const { packageId, paymentType } = body;

    // 验证套餐和支付方式
    if (!packageId || !['starter', 'advanced', 'master'].includes(packageId)) {
      return NextResponse.json({ error: '无效的套餐选择' }, { status: 400 });
    }

    if (!paymentType || !['alipay', 'wxpay'].includes(paymentType)) {
      return NextResponse.json({ error: '无效的支付方式' }, { status: 400 });
    }

    // 获取套餐信息
    const packageInfo = getPackageInfo(packageId);
    const productName = getProductName(packageId);
    
    // 生成订单号
    const orderId = generateOrderId();
    
    // 创建订单记录
    const { data: payment, error: insertError } = await supabase
      .from('payments')
      .insert({
        user_id: user.id,
        order_id: orderId,
        amount: packageInfo.price,
        credits_amount: packageInfo.credits,
        package_name: productName,
        status: 'pending'
      })
      .select()
      .single();

    if (insertError) {
      console.error('创建订单失败:', insertError);
      return NextResponse.json({ error: '创建订单失败' }, { status: 500 });
    }

    // 构建支付参数
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const paymentParams = {
      name: productName,
      money: packageInfo.price.toFixed(2),
      type: paymentType as 'alipay' | 'wxpay',
      out_trade_no: orderId,
      notify_url: `${baseUrl}/api/payment/notify`,
      return_url: `${baseUrl}/protected/my?payment=success`,
      param: packageId
    };

    // 生成支付URL
    const paymentUrl = createPaymentOrder(paymentParams);

    return NextResponse.json({
      orderId,
      paymentUrl,
      amount: packageInfo.price,
      credits: packageInfo.credits,
      productName
    });

  } catch (error) {
    console.error('创建支付订单错误:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : '创建订单失败' 
    }, { status: 500 });
  }
}