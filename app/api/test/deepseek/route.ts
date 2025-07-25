import { NextRequest, NextResponse } from 'next/server';
import { testDeepSeekConnection } from '@/lib/ai/deepseek';

export async function GET(request: NextRequest) {
  try {
    const isConnected = await testDeepSeekConnection();
    
    if (isConnected) {
      return NextResponse.json({ 
        success: true, 
        message: 'DeepSeek API连接正常',
        timestamp: new Date().toISOString()
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        message: 'DeepSeek API连接失败',
        timestamp: new Date().toISOString()
      }, { status: 500 });
    }
  } catch (error) {
    console.error('DeepSeek连接测试错误:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'DeepSeek API测试异常',
      error: error instanceof Error ? error.message : '未知错误',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}