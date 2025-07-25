import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Star, 
  Crown, 
  Calendar, 
  Share2, 
  Download,
  Copy,
  ArrowLeft,
  Sparkles,
  Heart,
  Briefcase,
  DollarSign,
  Shield,
  Brain,
  Clock,
  Target
} from "lucide-react";
import Link from "next/link";
import { ShareImageGenerator } from "@/components/share-image-generator";
import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ReadingDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  
  // 验证用户登录状态
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/auth/login");
  }

  // 从数据库获取推算记录
  const { data: reading, error } = await supabase
    .from('readings')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (error || !reading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-white mb-2">推算记录不存在</h3>
          <p className="text-purple-200 mb-6">该记录可能已被删除或您没有访问权限</p>
          <Button asChild variant="outline" className="border-purple-600 text-purple-300">
            <Link href="/protected/readings">
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回记录列表
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // 解析AI解读内容
  let aiInterpretation;
  try {
    aiInterpretation = typeof reading.ai_interpretation === 'string' 
      ? JSON.parse(reading.ai_interpretation) 
      : reading.ai_interpretation;
  } catch (error) {
    console.error('解析AI解读失败:', error);
    aiInterpretation = {};
  }


  // 使用真实数据
  const currentReading = reading;
  const isBazi = currentReading.type === "bazi";
  
  // 格式化日期
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN');
  };

  // Markdown解析函数
  const parseMarkdown = (content: string, themeColor: string = 'purple') => {
    if (!content) return '';
    
    // 清理内容并拆分为段落
    const cleanContent = content.trim();
    const lines = cleanContent.split('\n');
    let html = '';
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (!line) {
        // 空行作为段落分隔符
        if (html && !html.endsWith('<br/>')) {
          html += '<br/><br/>';
        }
        continue;
      }
      
      // 处理标题
      if (line.match(/^#{1,6}\s+/)) {
        const titleText = line.replace(/^#{1,6}\s+/, '');
        html += `<h4 class="text-white font-semibold text-base mt-4 mb-2 border-l-2 border-${themeColor}-400 pl-3">${titleText}</h4>`;
      }
      // 处理列表项
      else if (line.match(/^[\s]*[-*+]\s+/)) {
        const listText = line.replace(/^[\s]*[-*+]\s+/, '');
        html += `<div class="flex items-start gap-2 mb-1"><span class="text-${themeColor}-400 mt-1">•</span><span>${listText}</span></div>`;
      }
      // 普通段落
      else {
        html += `<p class="mb-2">${line}</p>`;
      }
    }
    
    // 处理内联格式
    return html
      // 处理粗体
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-medium">$1</strong>')
      // 处理斜体 
      .replace(/\*([^*]+)\*/g, `<em class="text-${themeColor}-100 italic">$1</em>`)
      // 清理多余的换行
      .replace(/<br\/><br\/><br\/>/g, '<br/><br/>');
  };

  const getTypeDisplay = (type: string) => {
    return type === "bazi" ? "八字详批" : "六爻占卜";
  };

  const getTypeIcon = (type: string) => {
    return type === "bazi" ? Crown : Star;
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-400";
    if (score >= 80) return "text-yellow-400";
    return "text-orange-400";
  };

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button asChild variant="outline" size="sm" className="border-purple-600 text-purple-300">
          <Link href="/protected/readings">
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回列表
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
              isBazi ? 'bg-purple-600/20' : 'bg-orange-600/20'
            }`}>
              {isBazi ? (
                <Crown className="h-5 w-5 text-purple-400" />
              ) : (
                <Star className="h-5 w-5 text-orange-400" />
              )}
            </div>
            <h1 className="text-2xl font-bold text-white">{currentReading.title}</h1>
            <Badge variant="outline" className={
              isBazi 
                ? "bg-purple-600/20 text-purple-400 border-purple-600"
                : "bg-orange-600/20 text-orange-400 border-orange-600"
            }>
              {getTypeDisplay(currentReading.type)}
            </Badge>
          </div>
          <div className="flex items-center gap-6 text-sm text-purple-300">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(currentReading.created_at)}
            </span>
            <span>消耗 {currentReading.credits_cost} 玄机值</span>
            <span className="flex items-center gap-1">
              <Share2 className="h-3 w-3" />
              分享 {currentReading.shared_count || 0} 次
            </span>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-blue-600 text-blue-300">
            <Download className="h-4 w-4 mr-2" />
            下载PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Column - Input Data */}
        <div className="space-y-6">
          <Card className="bg-slate-800/50 border-purple-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Clock className="h-5 w-5 text-purple-400" />
                {isBazi ? "出生信息" : "占卜信息"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {isBazi ? (
                <>
                  <div className="flex justify-between">
                    <span className="text-purple-200">性别</span>
                    <span className="text-white">{currentReading.input_data.gender || '未知'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-200">出生年份</span>
                    <span className="text-white">{currentReading.input_data.year || '未知'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-200">出生月份</span>
                    <span className="text-white">{currentReading.input_data.month || '未知'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-200">出生日期</span>
                    <span className="text-white">{currentReading.input_data.day || '未知'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-200">出生时辰</span>
                    <span className="text-white">{currentReading.input_data.hour || '未知'}:{currentReading.input_data.minute || '00'}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <span className="text-purple-200">问题类别</span>
                    <p className="text-white">{currentReading.input_data.category || '未知'}</p>
                  </div>
                  <div className="space-y-2">
                    <span className="text-purple-200">具体问题</span>
                    <p className="text-white text-sm leading-relaxed">{currentReading.input_data.question || '未提供具体问题'}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Raw Result */}
          <Card className="bg-slate-800/50 border-purple-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-400" />
                {isBazi ? "命盘信息" : "卦象详情"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {isBazi ? (
                <>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-center p-2 bg-slate-700/50 rounded">
                      <div className="text-purple-200">年柱</div>
                      <div className="text-white font-medium">{currentReading.raw_result.yearPillar || '未知'}</div>
                    </div>
                    <div className="text-center p-2 bg-slate-700/50 rounded">
                      <div className="text-purple-200">月柱</div>
                      <div className="text-white font-medium">{currentReading.raw_result.monthPillar || '未知'}</div>
                    </div>
                    <div className="text-center p-2 bg-slate-700/50 rounded">
                      <div className="text-purple-200">日柱</div>
                      <div className="text-white font-medium">{currentReading.raw_result.dayPillar || '未知'}</div>
                    </div>
                    <div className="text-center p-2 bg-slate-700/50 rounded">
                      <div className="text-purple-200">时柱</div>
                      <div className="text-white font-medium">{currentReading.raw_result.hourPillar || '未知'}</div>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-purple-700/50">
                    <div className="flex justify-between text-sm">
                      <span className="text-purple-200">日主</span>
                      <span className="text-white font-medium">{currentReading.raw_result.dayMaster || '未知'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-purple-200">季节</span>
                      <span className="text-white">{currentReading.raw_result.season || '未知'}</span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                    <div className="text-2xl font-bold text-white mb-2">{currentReading.raw_result.hexagram || '未知卦象'}</div>
                    <div className="text-purple-200 text-sm">本卦</div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 bg-slate-700/30 rounded">
                      <div className="text-purple-200 text-sm">上卦</div>
                      <div className="text-white font-medium">{currentReading.raw_result.upperTrigram || '未知'}</div>
                    </div>
                    <div className="text-center p-3 bg-slate-700/30 rounded">
                      <div className="text-purple-200 text-sm">下卦</div>
                      <div className="text-white font-medium">{currentReading.raw_result.lowerTrigram || '未知'}</div>
                    </div>
                  </div>
                  {currentReading.raw_result.finalHexagram && (
                    <div className="text-center p-3 bg-slate-700/50 rounded">
                      <div className="text-purple-200 text-sm mb-1">变卦</div>
                      <div className="text-white font-medium">{currentReading.raw_result.finalHexagram}</div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Status Info */}
          <Card className="bg-slate-800/50 border-purple-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white text-sm">推算状态</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-purple-200">状态</span>
                  <span className="text-green-400">已完成</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-200">推算方式</span>
                  <span className="text-white">{isBazi ? '传统八字排盘' : '六爻时间起卦'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-200">AI引擎</span>
                  <span className="text-white">DeepSeek V3</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Share Image Generator */}
          <Card className="bg-slate-800/50 border-purple-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white text-sm flex items-center gap-2">
                <Share2 className="h-4 w-4 text-purple-400" />
                分享结果
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ShareImageGenerator
                readingId={currentReading.id}
                type={currentReading.type as 'bazi' | 'liuyao'}
                title={currentReading.title}
                summary={isBazi ? aiInterpretation?.personality?.slice(0, 60) || '暂无解读' : aiInterpretation?.situation?.slice(0, 60) || '暂无解读'}
                aiScore={95}
                createdAt={formatDate(currentReading.created_at)}
              />
            </CardContent>
          </Card>
        </div>

        {/* Right Column - AI Interpretation */}
        <div className="lg:col-span-3">
          <Card className="bg-slate-800/50 border-purple-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-400" />
                AI智慧解读
              </CardTitle>
              <CardDescription className="text-purple-200">
                基于传统命理学结合现代AI分析的个性化解读
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* 调试信息：显示原始AI内容 */}
              {aiInterpretation?.fullContent && (
                <details className="mb-4 p-3 bg-slate-700/30 rounded border border-purple-700/50">
                  <summary className="text-purple-400 cursor-pointer text-sm">查看原始AI输出（调试用）</summary>
                  <pre className="text-xs text-purple-200 mt-2 whitespace-pre-wrap max-h-40 overflow-y-auto">
                    {aiInterpretation.fullContent}
                  </pre>
                </details>
              )}
              
              {isBazi ? (
                <Tabs defaultValue="personality" className="space-y-6">
                  <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 bg-slate-700/50 border border-purple-700/50">
                    <TabsTrigger value="personality" className="data-[state=active]:bg-purple-600">
                      性格分析
                    </TabsTrigger>
                    <TabsTrigger value="career" className="data-[state=active]:bg-purple-600">
                      事业运势
                    </TabsTrigger>
                    <TabsTrigger value="wealth" className="data-[state=active]:bg-purple-600">
                      财运分析
                    </TabsTrigger>
                    <TabsTrigger value="love" className="data-[state=active]:bg-purple-600">
                      婚恋家庭
                    </TabsTrigger>
                    <TabsTrigger value="health" className="data-[state=active]:bg-purple-600">
                      健康建议
                    </TabsTrigger>
                    <TabsTrigger value="advice" className="data-[state=active]:bg-purple-600">
                      综合建议
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="personality">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <Heart className="h-5 w-5 text-pink-400" />
                        <h3 className="text-lg font-semibold text-white">性格特质分析</h3>
                      </div>
                      <div className="text-purple-200 leading-relaxed">
                        {aiInterpretation?.personality ? (
                          <div dangerouslySetInnerHTML={{
                            __html: parseMarkdown(aiInterpretation.personality, 'purple')
                          }} />
                        ) : (
                          <p className="text-purple-400 italic">暂无性格分析</p>
                        )}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="career">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <Briefcase className="h-5 w-5 text-blue-400" />
                        <h3 className="text-lg font-semibold text-white">事业发展运势</h3>
                      </div>
                      <div className="text-purple-200 leading-relaxed">
                        {aiInterpretation?.career ? (
                          <>
                            <div dangerouslySetInnerHTML={{
                              __html: parseMarkdown(aiInterpretation.career, 'blue')
                            }} />
                            <details className="mt-4 p-2 bg-slate-700/20 rounded text-xs">
                              <summary className="text-blue-400 cursor-pointer">查看原始内容</summary>
                              <pre className="text-blue-200 mt-1 whitespace-pre-wrap">{aiInterpretation.career}</pre>
                            </details>
                          </>
                        ) : (
                          <p className="text-purple-400 italic">暂无事业分析</p>
                        )}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="wealth">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <DollarSign className="h-5 w-5 text-green-400" />
                        <h3 className="text-lg font-semibold text-white">财富运势分析</h3>
                      </div>
                      <div className="text-purple-200 leading-relaxed">
                        {aiInterpretation?.wealth ? (
                          <div dangerouslySetInnerHTML={{
                            __html: parseMarkdown(aiInterpretation.wealth, 'green')
                          }} />
                        ) : (
                          <p className="text-purple-400 italic">暂无财运分析</p>
                        )}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="love">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <Heart className="h-5 w-5 text-pink-400" />
                        <h3 className="text-lg font-semibold text-white">感情婚恋运势</h3>
                      </div>
                      <div className="text-purple-200 leading-relaxed">
                        {aiInterpretation?.love ? (
                          <div dangerouslySetInnerHTML={{
                            __html: parseMarkdown(aiInterpretation.love, 'pink')
                          }} />
                        ) : (
                          <p className="text-purple-400 italic">暂无感情分析</p>
                        )}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="health">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <Shield className="h-5 w-5 text-green-400" />
                        <h3 className="text-lg font-semibold text-white">健康养生建议</h3>
                      </div>
                      <div className="text-purple-200 leading-relaxed">
                        {aiInterpretation?.health ? (
                          <div dangerouslySetInnerHTML={{
                            __html: parseMarkdown(aiInterpretation.health, 'green')
                          }} />
                        ) : (
                          <p className="text-purple-400 italic">暂无健康分析</p>
                        )}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="advice">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <Sparkles className="h-5 w-5 text-purple-400" />
                        <h3 className="text-lg font-semibold text-white">AI综合建议</h3>
                      </div>
                      <div className="text-purple-200 leading-relaxed">
                        {aiInterpretation?.advice ? (
                          <div dangerouslySetInnerHTML={{
                            __html: parseMarkdown(aiInterpretation.advice, 'purple')
                          }} />
                        ) : (
                          <p className="text-purple-400 italic">暂无综合建议</p>
                        )}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              ) : (
                <Tabs defaultValue="situation" className="space-y-6">
                  <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 bg-slate-700/50 border border-orange-700/50">
                    <TabsTrigger value="situation" className="data-[state=active]:bg-orange-600">
                      卦象分析
                    </TabsTrigger>
                    <TabsTrigger value="judgment" className="data-[state=active]:bg-orange-600">
                      吉凶判断
                    </TabsTrigger>
                    <TabsTrigger value="timing" className="data-[state=active]:bg-orange-600">
                      应期分析
                    </TabsTrigger>
                    <TabsTrigger value="advice" className="data-[state=active]:bg-orange-600">
                      行动建议
                    </TabsTrigger>
                    <TabsTrigger value="caution" className="data-[state=active]:bg-orange-600">
                      注意事项
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="situation">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <Star className="h-5 w-5 text-orange-400" />
                        <h3 className="text-lg font-semibold text-white">当前状况分析</h3>
                      </div>
                      <div className="text-orange-200 leading-relaxed">
                        {aiInterpretation?.situation ? (
                          <div dangerouslySetInnerHTML={{
                            __html: parseMarkdown(aiInterpretation.situation, 'orange')
                          }} />
                        ) : (
                          <p className="text-orange-400 italic">暂无状况分析</p>
                        )}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="judgment">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <Target className="h-5 w-5 text-orange-400" />
                        <h3 className="text-lg font-semibold text-white">吉凶判断</h3>
                      </div>
                      <div className="text-orange-200 leading-relaxed">
                        {aiInterpretation?.judgment ? (
                          <div dangerouslySetInnerHTML={{
                            __html: parseMarkdown(aiInterpretation.judgment, 'orange')
                          }} />
                        ) : (
                          <p className="text-orange-400 italic">暂无吉凶判断</p>
                        )}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="timing">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <Clock className="h-5 w-5 text-orange-400" />
                        <h3 className="text-lg font-semibold text-white">最佳时机</h3>
                      </div>
                      <div className="text-orange-200 leading-relaxed">
                        {aiInterpretation?.timing ? (
                          <div dangerouslySetInnerHTML={{
                            __html: parseMarkdown(aiInterpretation.timing, 'orange')
                          }} />
                        ) : (
                          <p className="text-orange-400 italic">暂无时机分析</p>
                        )}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="advice">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <Sparkles className="h-5 w-5 text-orange-400" />
                        <h3 className="text-lg font-semibold text-white">智慧指引</h3>
                      </div>
                      <div className="text-orange-200 leading-relaxed">
                        {aiInterpretation?.advice ? (
                          <div dangerouslySetInnerHTML={{
                            __html: parseMarkdown(aiInterpretation.advice, 'orange')
                          }} />
                        ) : (
                          <p className="text-orange-400 italic">暂无智慧指引</p>
                        )}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="caution">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <Shield className="h-5 w-5 text-orange-400" />
                        <h3 className="text-lg font-semibold text-white">风险提醒</h3>
                      </div>
                      <div className="text-orange-200 leading-relaxed">
                        {aiInterpretation?.caution ? (
                          <div dangerouslySetInnerHTML={{
                            __html: parseMarkdown(aiInterpretation.caution, 'orange')
                          }} />
                        ) : (
                          <p className="text-orange-400 italic">暂无风险提醒</p>
                        )}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}