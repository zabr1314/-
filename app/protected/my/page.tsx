import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Coins, 
  CreditCard, 
  History, 
  Gift, 
  ShoppingCart,
  Calendar,
  TrendingUp,
  Award,
  Settings,
  Plus,
  Minus
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function MyAccountPage() {
  const supabase = await createClient();
  
  // 验证用户登录状态
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/auth/login");
  }

  // 获取用户积分信息
  const { data: credits } = await supabase
    .from('credits')
    .select('*')
    .eq('user_id', user.id)
    .single();

  // 获取用户档案信息
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();

  // 获取最近的积分交易记录
  const { data: transactions } = await supabase
    .from('credit_transactions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10);

  // 获取支付订单记录
  const { data: orders } = await supabase
    .from('payments')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5);

  // 获取推算统计
  const { data: readingsStats } = await supabase
    .from('readings')
    .select('type, created_at')
    .eq('user_id', user.id);

  // 计算统计数据
  const baziCount = readingsStats?.filter(r => r.type === 'bazi').length || 0;
  const liuyaoCount = readingsStats?.filter(r => r.type === 'liuyao').length || 0;
  const totalReadings = baziCount + liuyaoCount;

  // 格式化日期
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN');
  };

  // 格式化时间
  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN');
  };

  // 获取交易类型显示
  const getTransactionType = (type: string) => {
    switch (type) {
      case 'earn': return '获得';
      case 'spend': return '消费';
      case 'refund': return '退款';
      default: return type;
    }
  };

  // 获取交易颜色
  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'earn': return 'text-green-400';
      case 'spend': return 'text-red-400';
      case 'refund': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  // 获取订单状态
  const getOrderStatus = (status: string) => {
    switch (status) {
      case 'paid': return '已支付';
      case 'pending': return '待支付';
      case 'failed': return '支付失败';
      case 'refunded': return '已退款';
      default: return status;
    }
  };

  // 获取订单状态颜色
  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-400';
      case 'pending': return 'text-yellow-400';
      case 'failed': return 'text-red-400';
      case 'refunded': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">个人中心</h1>
          <p className="text-purple-200">管理您的账户信息和使用记录</p>
        </div>
        
        <Button asChild className="bg-purple-600 hover:bg-purple-700 text-white">
          <Link href="/pricing">
            <Plus className="h-4 w-4 mr-2" />
            充值玄机值
          </Link>
        </Button>
      </div>

      {/* User Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* 用户信息卡片 */}
        <Card className="bg-slate-800/50 border-purple-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <User className="h-5 w-5 text-purple-400" />
              用户信息
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-purple-200">昵称</span>
              <span className="text-white">{profile?.nickname || '神秘用户'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-200">邮箱</span>
              <span className="text-white text-sm">{user.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-200">注册时间</span>
              <span className="text-white">{formatDate(user.created_at)}</span>
            </div>
          </CardContent>
        </Card>

        {/* 玄机值余额 */}
        <Card className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 border-purple-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Coins className="h-5 w-5 text-yellow-400" />
              玄机值余额
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-400 mb-2">
              {credits?.balance || 0}
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-purple-200">累计获得</span>
                <div className="text-green-400 font-medium">{credits?.total_earned || 0}</div>
              </div>
              <div>
                <span className="text-purple-200">累计消费</span>
                <div className="text-red-400 font-medium">{credits?.total_spent || 0}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 推算统计 */}
        <Card className="bg-slate-800/50 border-purple-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-400" />
              推算统计
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-purple-200">总推算次数</span>
              <span className="text-white font-bold">{totalReadings}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-200">八字详批</span>
              <span className="text-purple-400">{baziCount} 次</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-200">六爻占卜</span>
              <span className="text-orange-400">{liuyaoCount} 次</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Information Tabs */}
      <Tabs defaultValue="transactions" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-slate-700/50 border border-purple-700/50">
          <TabsTrigger value="transactions" className="data-[state=active]:bg-purple-600">
            交易记录
          </TabsTrigger>
          <TabsTrigger value="orders" className="data-[state=active]:bg-purple-600">
            充值订单
          </TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-purple-600">
            账户设置
          </TabsTrigger>
        </TabsList>

        {/* 交易记录 */}
        <TabsContent value="transactions">
          <Card className="bg-slate-800/50 border-purple-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <History className="h-5 w-5 text-purple-400" />
                玄机值交易记录
              </CardTitle>
              <CardDescription className="text-purple-200">
                查看您的玄机值获得和消费记录
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!transactions || transactions.length === 0 ? (
                <div className="text-center py-8">
                  <History className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                  <p className="text-purple-200">暂无交易记录</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                          transaction.type === 'earn' ? 'bg-green-600/20' : 'bg-red-600/20'
                        }`}>
                          {transaction.type === 'earn' ? (
                            <Plus className="h-4 w-4 text-green-400" />
                          ) : (
                            <Minus className="h-4 w-4 text-red-400" />
                          )}
                        </div>
                        <div>
                          <div className="text-white font-medium">{transaction.description}</div>
                          <div className="text-sm text-purple-300">{formatDateTime(transaction.created_at)}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-bold ${getTransactionColor(transaction.type)}`}>
                          {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                        </div>
                        <div className="text-sm text-purple-300">余额: {transaction.balance_after}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 充值订单 */}
        <TabsContent value="orders">
          <Card className="bg-slate-800/50 border-purple-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-blue-400" />
                充值订单记录
              </CardTitle>
              <CardDescription className="text-purple-200">
                查看您的充值订单和支付状态
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!orders || orders.length === 0 ? (
                <div className="text-center py-8">
                  <CreditCard className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                  <p className="text-purple-200 mb-4">暂无充值记录</p>
                  <Button asChild className="bg-purple-600 hover:bg-purple-700 text-white">
                    <Link href="/pricing">
                      <Plus className="h-4 w-4 mr-2" />
                      立即充值
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-blue-600/20 flex items-center justify-center">
                          <ShoppingCart className="h-4 w-4 text-blue-400" />
                        </div>
                        <div>
                          <div className="text-white font-medium">{order.product_name}</div>
                          <div className="text-sm text-purple-300">{formatDateTime(order.created_at)}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-bold">¥{order.amount}</div>
                        <div className="text-sm text-yellow-400">{order.credits_amount} 玄机值</div>
                        <Badge variant="outline" className={`text-xs ${getOrderStatusColor(order.status)}`}>
                          {getOrderStatus(order.status)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 账户设置 */}
        <TabsContent value="settings">
          <Card className="bg-slate-800/50 border-purple-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Settings className="h-5 w-5 text-purple-400" />
                账户设置
              </CardTitle>
              <CardDescription className="text-purple-200">
                管理您的账户信息和偏好设置
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">基本信息</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-purple-200 mb-2">昵称</label>
                    <div className="p-3 bg-slate-700/50 rounded-lg text-white">
                      {profile?.nickname || '未设置'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-purple-200 mb-2">性别</label>
                    <div className="p-3 bg-slate-700/50 rounded-lg text-white">
                      {profile?.gender || '未设置'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">账户安全</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-purple-200">邮箱地址</span>
                    <span className="text-white">{user.email}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-purple-200">邮箱验证</span>
                    <Badge variant="outline" className={user.email_confirmed_at ? "text-green-400" : "text-yellow-400"}>
                      {user.email_confirmed_at ? "已验证" : "待验证"}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-purple-700/50">
                <Button variant="outline" className="border-purple-600 text-purple-300">
                  编辑资料
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}