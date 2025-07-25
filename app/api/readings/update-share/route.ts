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

    // 解析请求数据
    const body = await request.json();
    const { readingId, imageUrl } = body;

    if (!readingId || !imageUrl) {
      return NextResponse.json({ error: '缺少必要参数' }, { status: 400 });
    }

    // 首先获取当前的分享次数
    const { data: currentReading } = await supabase
      .from('readings')
      .select('shared_count')
      .eq('id', readingId)
      .eq('user_id', user.id)
      .single();

    // 更新推算记录的分享图片URL和分享次数
    const { error } = await supabase
      .from('readings')
      .update({ 
        shared_image_url: imageUrl,
        shared_count: (currentReading?.shared_count || 0) + 1
      })
      .eq('id', readingId)
      .eq('user_id', user.id); // 确保用户只能更新自己的记录

    if (error) {
      console.error('更新分享图片URL失败:', error);
      return NextResponse.json({ error: '更新失败' }, { status: 500 });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('更新分享图片URL错误:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : '更新失败' 
    }, { status: 500 });
  }
}