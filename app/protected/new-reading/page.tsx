"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, Crown, Calendar, Clock, Sparkles, AlertCircle, Loader2, Brain, Wand2 } from "lucide-react";
import Link from "next/link";

type ReadingType = "bazi" | "liuyao";

interface BaziData {
  year: string;
  month: string;
  day: string;
  hour: string;
  minute: string;
  gender: string;
  timezone: string;
}

interface LiuyaoData {
  question: string;
  category: string;
}

export default function NewReadingPage() {
  const [selectedType, setSelectedType] = useState<ReadingType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState<string>("");
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [baziData, setBaziData] = useState<BaziData>({
    year: "",
    month: "",
    day: "",
    hour: "",
    minute: "",
    gender: "",
    timezone: "Asia/Shanghai"
  });
  const [liuyaoData, setLiuyaoData] = useState<LiuyaoData>({
    question: "",
    category: ""
  });

  const handleBaziSubmit = async () => {
    if (!baziData.year || !baziData.month || !baziData.day || !baziData.gender) {
      alert("请填写完整的生辰信息");
      return;
    }

    setIsLoading(true);
    setLoadingProgress(0);
    
    try {
      // 步骤1：验证用户信息
      setLoadingStep("验证用户信息...");
      setLoadingProgress(10);
      await new Promise(resolve => setTimeout(resolve, 500));

      // 步骤2：生成八字排盘
      setLoadingStep("生成八字排盘...");
      setLoadingProgress(25);
      await new Promise(resolve => setTimeout(resolve, 800));

      // 步骤3：调用AI智慧解读
      setLoadingStep("AI智慧分析中...");
      setLoadingProgress(40);

      const response = await fetch('/api/readings/bazi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputData: baziData
        }),
      });

      // 步骤4：解析AI结果
      setLoadingStep("解析分析结果...");
      setLoadingProgress(75);
      await new Promise(resolve => setTimeout(resolve, 500));

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || '推算失败');
      }

      // 步骤5：保存推算记录
      setLoadingStep("保存推算记录...");
      setLoadingProgress(90);
      await new Promise(resolve => setTimeout(resolve, 300));

      // 步骤6：完成
      setLoadingStep("推算完成！");
      setLoadingProgress(100);
      await new Promise(resolve => setTimeout(resolve, 500));

      // 推算成功，跳转到详情页
      window.location.href = `/protected/readings/${result.reading_id}`;
    } catch (error) {
      console.error("推算错误:", error);
      alert(error instanceof Error ? error.message : "推算失败，请重试");
    } finally {
      setIsLoading(false);
      setLoadingStep("");
      setLoadingProgress(0);
    }
  };

  const handleLiuyaoSubmit = async () => {
    setIsLoading(true);
    setLoadingProgress(0);
    
    try {
      // 步骤1：心诚则灵
      setLoadingStep("心诚则灵，准备起卦...");
      setLoadingProgress(15);
      await new Promise(resolve => setTimeout(resolve, 600));

      // 步骤2：生成卦象
      setLoadingStep("生成六爻卦象...");
      setLoadingProgress(35);
      await new Promise(resolve => setTimeout(resolve, 700));

      // 步骤3：AI解读卦象
      setLoadingStep("AI解读卦象含义...");
      setLoadingProgress(50);

      const response = await fetch('/api/readings/liuyao', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputData: liuyaoData
        }),
      });

      // 步骤4：分析吉凶
      setLoadingStep("分析吉凶趋势...");
      setLoadingProgress(80);
      await new Promise(resolve => setTimeout(resolve, 400));

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || '起卦失败');
      }

      // 步骤5：完成占卜
      setLoadingStep("占卜完成！");
      setLoadingProgress(100);
      await new Promise(resolve => setTimeout(resolve, 500));

      // 起卦成功，跳转到详情页
      window.location.href = `/protected/readings/${result.reading_id}`;
    } catch (error) {
      console.error("起卦错误:", error);
      alert(error instanceof Error ? error.message : "起卦失败，请重试");
    } finally {
      setIsLoading(false);
      setLoadingStep("");
      setLoadingProgress(0);
    }
  };

  const renderTypeSelection = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-4">开启新的推算</h1>
        <p className="text-purple-200 text-lg">请选择您希望洞察的问题类型</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {/* 八字详批 */}
        <Card 
          className="bg-slate-800/50 border-purple-700/50 backdrop-blur-sm cursor-pointer transition-all hover:scale-105 hover:border-purple-500"
          onClick={() => setSelectedType("bazi")}
        >
          <CardHeader className="text-center">
            <div className="h-16 w-16 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Crown className="h-8 w-8 text-purple-400" />
            </div>
            <CardTitle className="text-2xl text-white">八字详批</CardTitle>
            <CardDescription className="text-purple-200 text-lg">
              探寻长期运势
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-purple-300 text-center">
              基于您的生辰八字，深度分析性格特质、事业财运、婚恋家庭，为人生重大决策提供指引。
            </p>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-purple-200">消耗玄机值</span>
                <Badge variant="outline" className="border-purple-500 text-purple-300">
                  15 玄机值
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-purple-200">分析维度</span>
                <span className="text-purple-300 text-sm">性格、事业、财运、感情、健康</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-purple-200">报告类型</span>
                <span className="text-purple-300 text-sm">详细文档 + PDF下载</span>
              </div>
            </div>
            <Button className="w-full bg-purple-600 hover:bg-purple-700">
              选择八字详批
            </Button>
          </CardContent>
        </Card>

        {/* 六爻占卜 */}
        <Card 
          className="bg-slate-800/50 border-orange-700/50 backdrop-blur-sm cursor-pointer transition-all hover:scale-105 hover:border-orange-500"
          onClick={() => setSelectedType("liuyao")}
        >
          <CardHeader className="text-center">
            <div className="h-16 w-16 bg-orange-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="h-8 w-8 text-orange-400" />
            </div>
            <CardTitle className="text-2xl text-white">六爻占卜</CardTitle>
            <CardDescription className="text-orange-200 text-lg">
              决断短期事务
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-orange-300 text-center">
              针对具体问题进行占卜分析，判断当下情况的吉凶走向，为短期决策提供参考。
            </p>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-orange-200">消耗玄机值</span>
                <Badge variant="outline" className="border-orange-500 text-orange-300">
                  5 玄机值
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-orange-200">适用场景</span>
                <span className="text-orange-300 text-sm">工作、感情、投资、出行</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-orange-200">结果呈现</span>
                <span className="text-orange-300 text-sm">卦象解析 + 智慧指引</span>
              </div>
            </div>
            <Button className="w-full bg-orange-600 hover:bg-orange-700">
              选择六爻占卜
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="text-center">
        <p className="text-purple-300 mb-4">
          首次使用？<Link href="/pricing" className="text-purple-400 hover:text-purple-300 underline">查看详细定价</Link>
        </p>
        <div className="flex items-center justify-center gap-2 text-sm text-purple-400">
          <AlertCircle className="h-4 w-4" />
          <span>玄机值不足时，系统将引导您前往充值</span>
        </div>
      </div>
    </div>
  );

  const renderBaziForm = () => (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">八字详批</h2>
        <p className="text-purple-200">请准确填写您的出生信息</p>
      </div>

      <Card className="bg-slate-800/50 border-purple-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Calendar className="h-5 w-5 text-purple-400" />
            出生信息
          </CardTitle>
          <CardDescription className="text-purple-200">
            准确的时间信息对推算结果至关重要
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gender" className="text-purple-200">性别</Label>
              <Select value={baziData.gender} onValueChange={(value) => setBaziData({...baziData, gender: value})}>
                <SelectTrigger className="bg-slate-700 border-purple-600 text-white">
                  <SelectValue placeholder="请选择性别" className="text-white" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-purple-600">
                  <SelectItem value="male" className="text-white hover:bg-purple-600/50 focus:bg-purple-600/50">男</SelectItem>
                  <SelectItem value="female" className="text-white hover:bg-purple-600/50 focus:bg-purple-600/50">女</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone" className="text-purple-200">时区</Label>
              <Select value={baziData.timezone} onValueChange={(value) => setBaziData({...baziData, timezone: value})}>
                <SelectTrigger className="bg-slate-700 border-purple-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-purple-600">
                  <SelectItem value="Asia/Shanghai" className="text-white hover:bg-purple-600/50 focus:bg-purple-600/50">北京时间 (UTC+8)</SelectItem>
                  <SelectItem value="Asia/Hong_Kong" className="text-white hover:bg-purple-600/50 focus:bg-purple-600/50">香港时间 (UTC+8)</SelectItem>
                  <SelectItem value="Asia/Taipei" className="text-white hover:bg-purple-600/50 focus:bg-purple-600/50">台北时间 (UTC+8)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="year" className="text-purple-200">出生年份</Label>
              <Input
                id="year"
                type="number"
                placeholder="如：1990"
                value={baziData.year}
                onChange={(e) => setBaziData({...baziData, year: e.target.value})}
                className="bg-slate-700 border-purple-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="month" className="text-purple-200">月份</Label>
              <Select value={baziData.month} onValueChange={(value) => setBaziData({...baziData, month: value})}>
                <SelectTrigger className="bg-slate-700 border-purple-600 text-white">
                  <SelectValue placeholder="月" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-purple-600">
                  {[...Array(12)].map((_, i) => (
                    <SelectItem key={i + 1} value={(i + 1).toString()} className="text-white hover:bg-purple-600/50 focus:bg-purple-600/50">
                      {i + 1}月
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="day" className="text-purple-200">日期</Label>
              <Select value={baziData.day} onValueChange={(value) => setBaziData({...baziData, day: value})}>
                <SelectTrigger className="bg-slate-700 border-purple-600 text-white">
                  <SelectValue placeholder="日" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-purple-600">
                  {[...Array(31)].map((_, i) => (
                    <SelectItem key={i + 1} value={(i + 1).toString()} className="text-white hover:bg-purple-600/50 focus:bg-purple-600/50">
                      {i + 1}日
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hour" className="text-purple-200">出生小时</Label>
              <Select value={baziData.hour} onValueChange={(value) => setBaziData({...baziData, hour: value})}>
                <SelectTrigger className="bg-slate-700 border-purple-600 text-white">
                  <SelectValue placeholder="时" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-purple-600">
                  {[...Array(24)].map((_, i) => (
                    <SelectItem key={i} value={i.toString()} className="text-white hover:bg-purple-600/50 focus:bg-purple-600/50">
                      {i.toString().padStart(2, '0')}时
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="minute" className="text-purple-200">分钟</Label>
              <Select value={baziData.minute} onValueChange={(value) => setBaziData({...baziData, minute: value})}>
                <SelectTrigger className="bg-slate-700 border-purple-600 text-white">
                  <SelectValue placeholder="分" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-purple-600">
                  {[0, 15, 30, 45].map((minute) => (
                    <SelectItem key={minute} value={minute.toString()} className="text-white hover:bg-purple-600/50 focus:bg-purple-600/50">
                      {minute.toString().padStart(2, '0')}分
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="bg-purple-900/20 border border-purple-700/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-4 w-4 text-purple-400" />
              <span className="text-purple-200 font-medium">温馨提示</span>
            </div>
            <p className="text-purple-300 text-sm">
              请尽量提供准确的出生时间。如果不确定具体分钟，可以选择最接近的时间段。
              出生时间的准确性直接影响八字推算的精度。
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button 
          variant="outline" 
          onClick={() => setSelectedType(null)}
          className="flex-1 border-purple-600 text-purple-300 hover:bg-purple-900/50"
        >
          返回选择
        </Button>
        <Button 
          onClick={handleBaziSubmit}
          disabled={isLoading}
          className="flex-1 bg-purple-600 hover:bg-purple-700"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              推算中...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              开始推算 (消耗15玄机值)
            </>
          )}
        </Button>
      </div>
    </div>
  );

  const renderLiuyaoForm = () => (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">六爻占卜</h2>
        <p className="text-orange-200">心诚则灵，专注您要询问的问题</p>
      </div>

      <Card className="bg-slate-800/50 border-orange-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Star className="h-5 w-5 text-orange-400" />
            起卦信息
          </CardTitle>
          <CardDescription className="text-orange-200">
            请明确表达您想要询问的问题
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="category" className="text-orange-200">问题类别</Label>
            <Select value={liuyaoData.category} onValueChange={(value) => setLiuyaoData({...liuyaoData, category: value})}>
              <SelectTrigger className="bg-slate-700 border-orange-600 text-white">
                <SelectValue placeholder="请选择问题类别" />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-orange-600">
                <SelectItem value="career" className="text-white hover:bg-orange-600/50 focus:bg-orange-600/50">事业工作</SelectItem>
                <SelectItem value="love" className="text-white hover:bg-orange-600/50 focus:bg-orange-600/50">感情婚姻</SelectItem>
                <SelectItem value="wealth" className="text-white hover:bg-orange-600/50 focus:bg-orange-600/50">财运投资</SelectItem>
                <SelectItem value="health" className="text-white hover:bg-orange-600/50 focus:bg-orange-600/50">健康平安</SelectItem>
                <SelectItem value="study" className="text-white hover:bg-orange-600/50 focus:bg-orange-600/50">学业考试</SelectItem>
                <SelectItem value="travel" className="text-white hover:bg-orange-600/50 focus:bg-orange-600/50">出行搬迁</SelectItem>
                <SelectItem value="lawsuit" className="text-white hover:bg-orange-600/50 focus:bg-orange-600/50">官司诉讼</SelectItem>
                <SelectItem value="other" className="text-white hover:bg-orange-600/50 focus:bg-orange-600/50">其他事项</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="question" className="text-orange-200">具体问题 (可选)</Label>
            <Textarea
              id="question"
              placeholder="您可以详细描述要询问的问题，但这不是必须的。心诚则灵，有些问题只需要在心中默念即可..."
              value={liuyaoData.question}
              onChange={(e) => setLiuyaoData({...liuyaoData, question: e.target.value})}
              className="bg-slate-700 border-orange-600 text-white min-h-[120px]"
            />
          </div>

          <div className="bg-orange-900/20 border border-orange-700/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-orange-400" />
              <span className="text-orange-200 font-medium">占卜须知</span>
            </div>
            <ul className="text-orange-300 text-sm space-y-1">
              <li>• 一日内同一问题只宜占卜一次</li>
              <li>• 问题应具体明确，避免过于宽泛</li>
              <li>• 占卜结果仅供参考，重大决策请结合实际情况</li>
              <li>• 心诚则灵，以平和的心态接受占卜结果</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button 
          variant="outline" 
          onClick={() => setSelectedType(null)}
          className="flex-1 border-orange-600 text-orange-300 hover:bg-orange-900/50"
        >
          返回选择
        </Button>
        <Button 
          onClick={handleLiuyaoSubmit}
          disabled={isLoading}
          className="flex-1 bg-orange-600 hover:bg-orange-700"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              起卦中...
            </>
          ) : (
            <>
              <Star className="h-4 w-4 mr-2" />
              心诚则灵，点击起卦 (消耗5玄机值)
            </>
          )}
        </Button>
      </div>
    </div>
  );

  // 渲染加载进度界面
  const renderLoadingProgress = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <Card className="bg-slate-800/90 border-purple-700/50 backdrop-blur-sm w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-400 animate-pulse" />
            AI正在智慧分析
          </CardTitle>
          <CardDescription className="text-purple-200">
            请耐心等待，AI正在为您进行深度推算...
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 进度条 */}
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-purple-200">{loadingStep}</span>
              <span className="text-purple-400">{loadingProgress}%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
          </div>

          {/* 动态提示 */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <Wand2 className="h-4 w-4 text-purple-400 animate-spin" />
              <span className="text-purple-300 text-sm">
                {selectedType === "bazi" ? "正在解析您的八字命盘..." : "正在解读卦象含义..."}
              </span>
            </div>
            <p className="text-purple-400 text-xs">
              AI分析需要一些时间，请不要关闭页面
            </p>
          </div>

          {/* 装饰性动画 */}
          <div className="flex justify-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-6 py-12">
        {!selectedType && renderTypeSelection()}
        {selectedType === "bazi" && renderBaziForm()}
        {selectedType === "liuyao" && renderLiuyaoForm()}
      </div>
      
      {/* 加载进度覆盖层 */}
      {isLoading && renderLoadingProgress()}
    </div>
  );
}