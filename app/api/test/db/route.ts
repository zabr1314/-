import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // 测试基本连接
    const { data: user, error: userError } = await supabase.auth.getUser();
    
    // 测试查询数据库表
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');
    
    // 尝试查询我们的表
    const { data: credits, error: creditsError } = await supabase
      .from('credits')
      .select('count')
      .limit(1);
    
    const { data: readings, error: readingsError } = await supabase
      .from('readings')
      .select('count')
      .limit(1);

    return NextResponse.json({
      connection: 'success',
      user: user ? 'authenticated' : 'not authenticated',
      userError: userError?.message,
      tables: tables?.map(t => t.table_name) || [],
      tablesError: tablesError?.message,
      creditsTable: creditsError ? `Error: ${creditsError.message}` : 'exists',
      readingsTable: readingsError ? `Error: ${readingsError.message}` : 'exists',
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY
    });

  } catch (error) {
    return NextResponse.json({
      connection: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}