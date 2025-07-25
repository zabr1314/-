import crypto from 'crypto';

export interface ZpayConfig {
  pid: string;
  pkey: string;
  baseUrl: string;
}

export interface PaymentParams {
  name: string;          // 商品名称
  money: string;         // 订单金额
  type: 'alipay' | 'wxpay'; // 支付方式
  out_trade_no: string;  // 商户订单号
  notify_url: string;    // 异步通知地址
  return_url: string;    // 跳转页面
  param?: string;        // 附加内容
}

export interface ZpayNotification {
  pid: string;
  name: string;
  money: string;
  out_trade_no: string;
  trade_no: string;
  param?: string;
  trade_status: string;
  type: string;
  sign: string;
  sign_type: string;
}

// Zpay配置
const zpayConfig: ZpayConfig = {
  pid: process.env.ZPAY_PID || '',
  pkey: process.env.ZPAY_PKEY || '',
  baseUrl: 'https://z-pay.cn/submit.php'
};

/**
 * 生成支付签名
 */
function generateSign(params: Record<string, string>, key: string): string {
  // 1. 排除sign、sign_type和空值参数
  const filteredParams: Record<string, string> = {};
  for (const [k, v] of Object.entries(params)) {
    if (v && k !== 'sign' && k !== 'sign_type') {
      filteredParams[k] = v;
    }
  }

  // 2. 按参数名ASCII码从小到大排序
  const sortedKeys = Object.keys(filteredParams).sort();
  
  // 3. 拼接成URL键值对格式
  const paramString = sortedKeys
    .map(key => `${key}=${filteredParams[key]}`)
    .join('&');

  // 4. 拼接密钥并进行MD5加密
  const signString = paramString + key;
  return crypto.createHash('md5').update(signString).digest('hex');
}

/**
 * 创建支付订单
 */
export function createPaymentOrder(params: PaymentParams): string {
  if (!zpayConfig.pid || !zpayConfig.pkey) {
    throw new Error('Zpay配置不完整');
  }

  // 构建支付参数
  const paymentData = {
    pid: zpayConfig.pid,
    name: params.name,
    money: params.money,
    type: params.type,
    out_trade_no: params.out_trade_no,
    notify_url: params.notify_url,
    return_url: params.return_url,
    sign_type: 'MD5',
    ...(params.param && { param: params.param })
  };

  // 生成签名
  const sign = generateSign(paymentData, zpayConfig.pkey);
  
  // 构建支付URL
  const urlParams = new URLSearchParams({
    ...paymentData,
    sign
  });

  return `${zpayConfig.baseUrl}?${urlParams.toString()}`;
}

/**
 * 验证支付通知签名
 */
export function verifyNotification(notification: ZpayNotification): boolean {
  if (!zpayConfig.pkey) {
    throw new Error('Zpay密钥未配置');
  }

  const { sign, ...params } = notification;
  const calculatedSign = generateSign(params as Record<string, string>, zpayConfig.pkey);
  
  return calculatedSign === sign;
}

/**
 * 处理支付通知
 */
export function processPaymentNotification(notification: ZpayNotification): {
  isValid: boolean;
  isSuccess: boolean;
  orderId: string;
  tradeNo: string;
  amount: string;
  paymentType: string;
} {
  const isValid = verifyNotification(notification);
  const isSuccess = notification.trade_status === 'TRADE_SUCCESS';
  
  return {
    isValid,
    isSuccess,
    orderId: notification.out_trade_no,
    tradeNo: notification.trade_no,
    amount: notification.money,
    paymentType: notification.type
  };
}

/**
 * 生成订单号
 */
export function generateOrderId(): string {
  const now = new Date();
  const dateStr = now.getFullYear().toString() +
    (now.getMonth() + 1).toString().padStart(2, '0') +
    now.getDate().toString().padStart(2, '0') +
    now.getHours().toString().padStart(2, '0') +
    now.getMinutes().toString().padStart(2, '0') +
    now.getSeconds().toString().padStart(2, '0');
  
  const randomStr = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return dateStr + randomStr;
}

/**
 * 获取商品名称
 */
export function getProductName(packageId: string): string {
  const packages = {
    'starter': '新手体验包',
    'advanced': '高级推算包',
    'master': '大师尊享包'
  };
  
  return packages[packageId as keyof typeof packages] || '玄机值充值';
}

/**
 * 获取套餐价格和玄机值
 */
export function getPackageInfo(packageId: string): { price: number; credits: number } {
  const packages = {
    'starter': { price: 19.9, credits: 20 },
    'advanced': { price: 49.9, credits: 55 },
    'master': { price: 99.9, credits: 120 }
  };
  
  return packages[packageId as keyof typeof packages] || { price: 0, credits: 0 };
}