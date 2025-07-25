const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const createTables = async () => {
  try {
    await client.connect();
    console.log('连接到数据库成功');

    // 1. 创建用户积分表
    console.log('创建credits表...');
    await client.query(`
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
    `);

    // 2. 创建推算记录表
    console.log('创建readings表...');
    await client.query(`
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
    `);

    // 3. 创建支付订单表
    console.log('创建payments表...');
    await client.query(`
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
    `);

    // 4. 创建积分交易记录表
    console.log('创建credit_transactions表...');
    await client.query(`
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
    `);

    // 5. 创建用户档案表
    console.log('创建user_profiles表...');
    await client.query(`
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
    `);

    // 6. 创建商品表
    console.log('创建products表...');
    await client.query(`
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
    `);

    // 插入默认商品数据
    console.log('插入默认商品数据...');
    await client.query(`
      INSERT INTO products (name, description, price, credits_amount, sort_order) VALUES
      ('初心套餐', '适合初次体验用户', 9.90, 30, 1),
      ('进阶套餐', '深度分析，洞察人生', 29.90, 100, 2),
      ('至尊套餐', '全面解读，掌控命运', 99.90, 380, 3)
      ON CONFLICT DO NOTHING;
    `);

    // 创建更新玄机值的函数
    console.log('创建update_user_credits函数...');
    await client.query(`
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
    `);

    // 启用RLS
    console.log('启用行级安全策略...');
    await client.query(`
      ALTER TABLE credits ENABLE ROW LEVEL SECURITY;
      ALTER TABLE readings ENABLE ROW LEVEL SECURITY;
      ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
      ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;
      ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
    `);

    // 创建RLS策略
    console.log('创建RLS策略...');
    
    // Credits表的RLS策略
    await client.query(`
      DROP POLICY IF EXISTS "Users can view own credits" ON credits;
      CREATE POLICY "Users can view own credits" ON credits FOR SELECT USING (auth.uid() = user_id);
      
      DROP POLICY IF EXISTS "Users can update own credits" ON credits;
      CREATE POLICY "Users can update own credits" ON credits FOR UPDATE USING (auth.uid() = user_id);
      
      DROP POLICY IF EXISTS "Users can insert own credits" ON credits;
      CREATE POLICY "Users can insert own credits" ON credits FOR INSERT WITH CHECK (auth.uid() = user_id);
    `);

    // Readings表的RLS策略
    await client.query(`
      DROP POLICY IF EXISTS "Users can view own readings" ON readings;
      CREATE POLICY "Users can view own readings" ON readings FOR SELECT USING (auth.uid() = user_id);
      
      DROP POLICY IF EXISTS "Users can insert own readings" ON readings;
      CREATE POLICY "Users can insert own readings" ON readings FOR INSERT WITH CHECK (auth.uid() = user_id);
      
      DROP POLICY IF EXISTS "Users can update own readings" ON readings;
      CREATE POLICY "Users can update own readings" ON readings FOR UPDATE USING (auth.uid() = user_id);
    `);

    // Payments表的RLS策略
    await client.query(`
      DROP POLICY IF EXISTS "Users can view own payments" ON payments;
      CREATE POLICY "Users can view own payments" ON payments FOR SELECT USING (auth.uid() = user_id);
      
      DROP POLICY IF EXISTS "Users can insert own payments" ON payments;
      CREATE POLICY "Users can insert own payments" ON payments FOR INSERT WITH CHECK (auth.uid() = user_id);
    `);

    // Credit_transactions表的RLS策略
    await client.query(`
      DROP POLICY IF EXISTS "Users can view own transactions" ON credit_transactions;
      CREATE POLICY "Users can view own transactions" ON credit_transactions FOR SELECT USING (auth.uid() = user_id);
      
      DROP POLICY IF EXISTS "Users can insert own transactions" ON credit_transactions;
      CREATE POLICY "Users can insert own transactions" ON credit_transactions FOR INSERT WITH CHECK (auth.uid() = user_id);
    `);

    // User_profiles表的RLS策略
    await client.query(`
      DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
      CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT USING (auth.uid() = user_id);
      
      DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
      CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = user_id);
      
      DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
      CREATE POLICY "Users can insert own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
    `);

    console.log('✅ 所有数据库表和策略创建完成！');

  } catch (error) {
    console.error('❌ 创建表失败:', error);
  } finally {
    await client.end();
  }
};

createTables();