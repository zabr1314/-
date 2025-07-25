import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Star, 
  Crown, 
  Calendar, 
  Search, 
  Plus,
  Eye,
  Share2,
  Download,
  Clock,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function ReadingsPage() {
  const supabase = await createClient();
  
  // 验证用户登录状态
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/auth/login");
  }

  // 从数据库获取用户的推算记录
  const { data: readings, error } = await supabase
    .from('readings')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('获取推算记录失败:', error);
  }

  const getTypeDisplay = (type: string) => {
    return type === "bazi" ? "八字详批" : "六爻占卜";
  };

  const getTypeIcon = (type: string) => {
    return type === "bazi" ? Crown : Star;
  };

  const getTypeColor = (type: string) => {
    return type === "bazi" 
      ? "bg-purple-600/20 text-purple-400 border-purple-600"
      : "bg-orange-600/20 text-orange-400 border-orange-600";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400';
      case 'processing': return 'text-yellow-400';
      case 'failed': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return '已完成';
      case 'processing': return '处理中';
      case 'failed': return '失败';
      case 'pending': return '等待中';
      default: return '未知';
    }
  };

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">推算记录</h1>
          <p className="text-purple-200">管理和查看您的所有推算历史</p>
        </div>
        
        <Button asChild className="bg-purple-600 hover:bg-purple-700 text-white">
          <Link href="/protected/new-reading">
            <Plus className="h-4 w-4 mr-2" />
            新建推算
          </Link>
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 h-4 w-4" />
          <Input 
            placeholder="搜索推算记录..." 
            className="pl-10 bg-slate-800/50 border-purple-700/50 text-white placeholder-purple-300"
          />
        </div>
        <Select>
          <SelectTrigger className="w-full sm:w-48 bg-slate-800/50 border-purple-700/50 text-white">
            <SelectValue placeholder="选择类型" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部类型</SelectItem>
            <SelectItem value="bazi">八字详批</SelectItem>
            <SelectItem value="liuyao">六爻占卜</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Readings List */}
      {!readings || readings.length === 0 ? (
        <div className="text-center py-12">
          <Sparkles className="h-16 w-16 text-purple-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">还没有推算记录</h3>
          <p className="text-purple-200 mb-6">开始您的第一次玄机探索吧</p>
          <Button asChild className="bg-purple-600 hover:bg-purple-700 text-white">
            <Link href="/protected/new-reading">
              <Plus className="h-4 w-4 mr-2" />
              立即开始推算
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {readings.map((reading) => {
            const TypeIcon = getTypeIcon(reading.type);
            
            return (
              <Card key={reading.id} className="bg-slate-800/50 border-purple-700/50 backdrop-blur-sm hover:bg-slate-800/70 transition-all">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                        reading.type === 'bazi' ? 'bg-purple-600/20' : 'bg-orange-600/20'
                      }`}>
                        <TypeIcon className={`h-4 w-4 ${
                          reading.type === 'bazi' ? 'text-purple-400' : 'text-orange-400'
                        }`} />
                      </div>
                      <Badge variant="outline" className={getTypeColor(reading.type)}>
                        {getTypeDisplay(reading.type)}
                      </Badge>
                    </div>
                    <span className={`text-sm ${getStatusColor(reading.status)}`}>
                      {getStatusText(reading.status)}
                    </span>
                  </div>
                  
                  <CardTitle className="text-white text-lg line-clamp-2">
                    {reading.title}
                  </CardTitle>
                  
                  <div className="flex items-center gap-4 text-sm text-purple-300">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(reading.created_at)}
                    </span>
                    <span>{reading.credits_cost} 玄机值</span>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <Button asChild size="sm" variant="outline" className="border-purple-600 text-purple-300">
                        <Link href={`/protected/readings/${reading.id}`}>
                          <Eye className="h-3 w-3 mr-1" />
                          查看
                        </Link>
                      </Button>
                      <Button size="sm" variant="outline" className="border-blue-600 text-blue-300">
                        <Share2 className="h-3 w-3 mr-1" />
                        分享
                      </Button>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3 text-purple-400" />
                      <span className="text-sm text-purple-300">
                        已分享 {reading.shared_count || 0} 次
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}