import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  // 返回创建表的SQL脚本
  const sql = `
-- 玄机阁数据库表创建脚本
-- 请在Supabase控制台的SQL编辑器中执行

-- 1. 用户积分表
CREATE TABLE IF NOT EXISTS credits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  balance INTEGER DEFAULT 0 NOT NULL,
  total_earned INTEGER DEFAULT 0 NOT NULL,
  total_spent INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 2. 推算记录表
CREATE TABLE IF NOT EXISTS readings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('bazi', 'liuyao')),
  title VARCHAR(200),
  input_data JSONB NOT NULL,
  raw_result JSONB NOT NULL,
  ai_interpretation TEXT,
  credits_cost INTEGER NOT NULL,
  status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  shared_image_url TEXT,
  shared_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 支付订单表
CREATE TABLE IF NOT EXISTS payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  zpay_order_id VARCHAR(100) UNIQUE NOT NULL,
  product_name VARCHAR(200) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  credits_amount INTEGER NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'refunded')),
  zpay_response JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. 积分交易记录表
CREATE TABLE IF NOT EXISTS credit_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  amount INTEGER NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('earn', 'spend', 'refund')),
  description TEXT,
  related_payment_id UUID REFERENCES payments(id),
  related_reading_id UUID REFERENCES readings(id),
  balance_after INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. 用户档案表
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  nickname VARCHAR(50),
  avatar_url TEXT,
  birth_date DATE,
  gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
  location VARCHAR(100),
  bio TEXT,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 6. 商品表
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  credits_amount INTEGER NOT NULL,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 插入默认商品数据
INSERT INTO products (name, description, price, credits_amount, sort_order) VALUES
('初心套餐', '适合初次体验用户', 9.90, 30, 1),
('进阶套餐', '深度分析，洞察人生', 29.90, 100, 2),
('至尊套餐', '全面解读，掌控命运', 99.90, 380, 3)
ON CONFLICT DO NOTHING;

-- 创建RLS策略
ALTER TABLE credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Credits表的RLS策略
CREATE POLICY "Users can view own credits" ON credits FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own credits" ON credits FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own credits" ON credits FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Readings表的RLS策略
CREATE POLICY "Users can view own readings" ON readings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own readings" ON readings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own readings" ON readings FOR UPDATE USING (auth.uid() = user_id);

-- Payments表的RLS策略
CREATE POLICY "Users can view own payments" ON payments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own payments" ON payments FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Credit_transactions表的RLS策略
CREATE POLICY "Users can view own transactions" ON credit_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own transactions" ON credit_transactions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User_profiles表的RLS策略
CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 创建更新玄机值的函数
CREATE OR REPLACE FUNCTION update_user_credits(
  p_user_id UUID,
  p_amount INTEGER,
  p_type VARCHAR(20),
  p_description TEXT DEFAULT NULL
) RETURNS VOID AS $$
DECLARE
  current_balance INTEGER;
  new_balance INTEGER;
BEGIN
  -- 获取当前余额
  SELECT balance INTO current_balance FROM credits WHERE user_id = p_user_id;
  
  -- 如果用户没有积分记录，创建一个
  IF current_balance IS NULL THEN
    INSERT INTO credits (user_id, balance, total_earned, total_spent)
    VALUES (p_user_id, 0, 0, 0);
    current_balance := 0;
  END IF;
  
  -- 计算新余额
  new_balance := current_balance + p_amount;
  
  -- 更新积分表
  UPDATE credits 
  SET 
    balance = new_balance,
    total_earned = CASE WHEN p_amount > 0 THEN total_earned + p_amount ELSE total_earned END,
    total_spent = CASE WHEN p_amount < 0 THEN total_spent + ABS(p_amount) ELSE total_spent END,
    updated_at = NOW()
  WHERE user_id = p_user_id;
  
  -- 记录交易
  INSERT INTO credit_transactions (user_id, amount, type, description, balance_after)
  VALUES (p_user_id, p_amount, p_type, p_description, new_balance);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
`;

  return NextResponse.json({
    message: '请复制以下SQL脚本到Supabase控制台执行',
    sql: sql
  });
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // 测试各个表是否存在
    const tables = ['credits', 'readings', 'payments', 'credit_transactions', 'user_profiles', 'products'];
    const results = {};
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('count')
          .limit(1);
        
        results[table] = error ? `Error: ${error.message}` : 'exists';
      } catch (error) {
        results[table] = `Error: ${error}`;
      }
    }
    
    return NextResponse.json({
      message: '数据库表状态检查',
      tables: results
    });

  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : '检查失败'
    }, { status: 500 });
  }
}