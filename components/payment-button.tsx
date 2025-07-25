"use client";

import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import { useState } from "react";

interface PaymentButtonProps {
  packageId: string;
  packageName: string;
  color: string;
}

export function PaymentButton({ packageId, packageName, color }: PaymentButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async (paymentType: 'alipay' | 'wxpay') => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          packageId,
          paymentType
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || '创建订单失败');
      }

      // 跳转到支付页面
      window.location.href = result.paymentUrl;
    } catch (error) {
      console.error('支付错误:', error);
      alert(error instanceof Error ? error.message : '支付失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Button 
        onClick={() => handlePayment('alipay')}
        className={`w-full bg-gradient-to-r ${color} hover:opacity-90 text-white`}
        size="lg"
        disabled={isLoading}
      >
        <Zap className="h-4 w-4 mr-2" />
        {isLoading ? '创建订单中...' : '支付宝支付'}
      </Button>
      <Button 
        onClick={() => handlePayment('wxpay')}
        variant="outline"
        className="w-full border-green-600 text-green-300 hover:bg-green-900/50"
        size="lg"
        disabled={isLoading}
      >
        {isLoading ? '创建订单中...' : '微信支付'}
      </Button>
    </div>
  );
}