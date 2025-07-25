const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseTest = async () => {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY
    );

    console.log('🔄 测试Supabase连接...');

    // 测试各个表是否存在
    const tables = ['credits', 'readings', 'payments', 'credit_transactions', 'user_profiles', 'products'];
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('count')
          .limit(1);
        
        if (error) {
          console.log(`❌ ${table}表: ${error.message}`);
        } else {
          console.log(`✅ ${table}表: 存在`);
        }
      } catch (error) {
        console.log(`❌ ${table}表: ${error.message}`);
      }
    }

    // 测试查询products表的数据
    console.log('\n🔍 查询products表数据:');
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*');
    
    if (productsError) {
      console.log('❌ 查询products失败:', productsError.message);
    } else {
      console.log('✅ 查询products成功:', products.length, '条记录');
      products.forEach(product => {
        console.log(`  - ${product.name}: ¥${product.price} (${product.credits_amount}玄机值)`);
      });
    }

  } catch (error) {
    console.error('❌ 测试失败:', error.message);
  }
};

supabaseTest();