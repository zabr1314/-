-- 玄机阁数据库Schema设计
-- 基于Supabase PostgreSQL

-- 1. 用户积分表 (credits) - 玄机值管理
CREATE TABLE IF NOT EXISTS credits (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    balance INTEGER DEFAULT 0 NOT NULL, -- 当前玄机值余额
    total_earned INTEGER DEFAULT 0 NOT NULL, -- 累计获得的玄机值
    total_spent INTEGER DEFAULT 0 NOT NULL, -- 累计消费的玄机值
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id)
);

-- 2. 推算记录表 (readings) - 存储八字和六爻推算结果
CREATE TABLE IF NOT EXISTS readings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('bazi', 'liuyao')), -- 八字或六爻
    title VARCHAR(200), -- 推算标题
    
    -- 输入数据 (JSON格式存储)
    input_data JSONB NOT NULL, -- 八字:生日时辰等; 六爻:问题等
    
    -- 原始计算结果
    raw_result JSONB NOT NULL, -- 命盘数据或卦象数据
    
    -- AI解读内容
    ai_interpretation TEXT, -- AI生成的解读文案
    
    -- 消费的玄机值
    credits_cost INTEGER NOT NULL, -- 本次推算消耗的玄机值
    
    -- 状态
    status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    
    -- 分享相关
    shared_image_url TEXT, -- 生成的分享图片URL
    shared_count INTEGER DEFAULT 0, -- 分享次数
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 支付订单表 (payments) - Zpay订单记录
CREATE TABLE IF NOT EXISTS payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    
    -- 订单信息
    order_id VARCHAR(100) UNIQUE NOT NULL, -- Zpay订单号
    amount DECIMAL(10,2) NOT NULL, -- 支付金额
    credits_amount INTEGER NOT NULL, -- 对应的玄机值数量
    
    -- 支付状态
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'refunded')),
    
    -- Zpay相关
    zpay_trade_no VARCHAR(100), -- Zpay交易号
    zpay_callback_data JSONB, -- Zpay回调数据
    
    -- 套餐信息
    package_name VARCHAR(100), -- 套餐名称 (新手体验包/高级推算包/大师尊享包)
    
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. 积分变动记录表 (credit_transactions) - 详细的积分流水
CREATE TABLE IF NOT EXISTS credit_transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    
    -- 交易信息
    type VARCHAR(20) NOT NULL CHECK (type IN ('earn', 'spend', 'refund')), -- 获得/消费/退款
    amount INTEGER NOT NULL, -- 变动数量 (正数为增加，负数为减少)
    balance_after INTEGER NOT NULL, -- 交易后余额
    
    -- 关联信息
    related_payment_id UUID REFERENCES payments(id), -- 关联的支付订单
    related_reading_id UUID REFERENCES readings(id), -- 关联的推算记录
    
    -- 描述
    description TEXT, -- 交易描述
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. 商城商品表 (products) - 运势商城商品
CREATE TABLE IF NOT EXISTS products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- 商品基本信息
    name VARCHAR(200) NOT NULL,
    description TEXT,
    image_url TEXT,
    
    -- 价格
    price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2), -- 原价(用于显示折扣)
    
    -- 商品分类
    category VARCHAR(50), -- 水晶/手链/香薰等
    tags TEXT[], -- 标签数组
    
    -- 状态
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'out_of_stock')),
    stock_quantity INTEGER DEFAULT 0, -- 库存数量
    
    -- 外部链接 (初期导向淘宝/微店)
    external_url TEXT, -- 外部购买链接
    
    -- 排序和展示
    sort_order INTEGER DEFAULT 0, -- 排序权重
    is_featured BOOLEAN DEFAULT false, -- 是否推荐商品
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. 用户配置表 (user_profiles) - 扩展用户信息
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    
    -- 个人信息
    nickname VARCHAR(50), -- 昵称
    avatar_url TEXT, -- 头像URL
    
    -- 偏好设置
    preferred_reading_type VARCHAR(20) CHECK (preferred_reading_type IN ('bazi', 'liuyao')), -- 偏好的推算类型
    notification_enabled BOOLEAN DEFAULT true, -- 是否启用通知
    
    -- 首次使用奖励
    welcome_credits_given BOOLEAN DEFAULT false, -- 是否已发放注册奖励
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id)
);

-- 创建索引以优化查询性能
CREATE INDEX IF NOT EXISTS idx_readings_user_id ON readings(user_id);
CREATE INDEX IF NOT EXISTS idx_readings_created_at ON readings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments(order_id);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_user_id ON credit_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_created_at ON credit_transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);

-- RLS (Row Level Security) 策略
-- 确保用户只能访问自己的数据

-- credits表RLS
ALTER TABLE credits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own credits" ON credits FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own credits" ON credits FOR UPDATE USING (auth.uid() = user_id);

-- readings表RLS
ALTER TABLE readings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own readings" ON readings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own readings" ON readings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own readings" ON readings FOR UPDATE USING (auth.uid() = user_id);

-- payments表RLS
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own payments" ON payments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own payments" ON payments FOR INSERT WITH CHECK (auth.uid() = user_id);

-- credit_transactions表RLS
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own transactions" ON credit_transactions FOR SELECT USING (auth.uid() = user_id);

-- products表 - 所有用户都可以查看
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active products" ON products FOR SELECT USING (status = 'active');

-- user_profiles表RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = user_id);

-- 初始化新用户的触发器函数
CREATE OR REPLACE FUNCTION initialize_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- 创建用户积分记录
    INSERT INTO credits (user_id, balance) VALUES (NEW.id, 0);
    
    -- 创建用户配置记录
    INSERT INTO user_profiles (user_id, nickname) VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', '神秘用户'));
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 创建触发器：新用户注册时自动初始化
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION initialize_new_user();

-- 函数：安全地更新用户积分
CREATE OR REPLACE FUNCTION update_user_credits(
    p_user_id UUID,
    p_amount INTEGER,
    p_type VARCHAR(20),
    p_description TEXT DEFAULT '',
    p_related_payment_id UUID DEFAULT NULL,
    p_related_reading_id UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    current_balance INTEGER;
    new_balance INTEGER;
BEGIN
    -- 获取当前余额
    SELECT balance INTO current_balance FROM credits WHERE user_id = p_user_id;
    
    IF current_balance IS NULL THEN
        RAISE EXCEPTION 'User credits record not found';
    END IF;
    
    -- 计算新余额
    new_balance := current_balance + p_amount;
    
    -- 检查余额不能为负
    IF new_balance < 0 THEN
        RAISE EXCEPTION 'Insufficient credits';
    END IF;
    
    -- 更新积分表
    UPDATE credits 
    SET 
        balance = new_balance,
        total_earned = CASE WHEN p_amount > 0 THEN total_earned + p_amount ELSE total_earned END,
        total_spent = CASE WHEN p_amount < 0 THEN total_spent + ABS(p_amount) ELSE total_spent END,
        updated_at = NOW()
    WHERE user_id = p_user_id;
    
    -- 记录交易流水
    INSERT INTO credit_transactions (
        user_id, type, amount, balance_after, description,
        related_payment_id, related_reading_id
    ) VALUES (
        p_user_id, p_type, p_amount, new_balance, p_description,
        p_related_payment_id, p_related_reading_id
    );
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;