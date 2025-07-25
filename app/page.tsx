import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";
import { Star, Sparkles, Zap, Shield, Heart, Gem } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="w-full border-b border-purple-800/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center p-4 px-6">
          <div className="flex items-center gap-3">
            <Sparkles className="h-6 w-6 text-purple-400" />
            <Link href="/" className="text-xl font-bold text-white">
              玄机阁
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/pricing" className="text-purple-200 hover:text-white transition-colors">
              定价
            </Link>
            <AuthButton />
            <ThemeSwitcher />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/stars.svg')] opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-24 text-center">
          <div className="space-y-8">
            <Badge variant="secondary" className="bg-purple-900/50 text-purple-200 border-purple-700">
              <Star className="h-4 w-4 mr-2" />
              AI驱动的深度运势分析
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
              洞察天机
              <br />
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                决策未来
              </span>
            </h1>
            
            <p className="text-xl text-purple-200 max-w-2xl mx-auto leading-relaxed">
              不再是模棱两可的断言，而是结合你生辰八字的个性化深度报告。
              您的AI命理军师，为迷茫提供智慧指引。
            </p>
            
            <div className="flex gap-4 justify-center flex-wrap">
              <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700 text-white px-8">
                <Link href={hasEnvVars ? "/auth/login" : "#features"}>
                  <Zap className="h-5 w-5 mr-2" />
                  立即开始推算
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="border-purple-400 text-purple-200 hover:bg-purple-900/50">
                <Link href="#features">
                  了解更多
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              核心功能
            </h2>
            <p className="text-xl text-purple-200">
              传统智慧与现代AI的完美结合
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-slate-800/50 border-purple-700/50 backdrop-blur-sm">
              <CardHeader>
                <div className="h-12 w-12 bg-purple-600/20 rounded-lg flex items-center justify-center mb-4">
                  <Star className="h-6 w-6 text-purple-400" />
                </div>
                <CardTitle className="text-white">八字详批</CardTitle>
                <CardDescription className="text-purple-200">
                  洞察一生格局
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-purple-300">
                  基于生辰八字，深度分析性格特质、事业财运、婚恋家庭，为人生重大决策提供指引。
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50 border-purple-700/50 backdrop-blur-sm">
              <CardHeader>
                <div className="h-12 w-12 bg-orange-600/20 rounded-lg flex items-center justify-center mb-4">
                  <Gem className="h-6 w-6 text-orange-400" />
                </div>
                <CardTitle className="text-white">六爻占卜</CardTitle>
                <CardDescription className="text-purple-200">
                  判断当下吉凶
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-purple-300">
                  针对具体问题起卦占卜，分析当下情况的吉凶走向，为短期决策提供参考。
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50 border-purple-700/50 backdrop-blur-sm">
              <CardHeader>
                <div className="h-12 w-12 bg-blue-600/20 rounded-lg flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6 text-blue-400" />
                </div>
                <CardTitle className="text-white">AI灵感解读</CardTitle>
                <CardDescription className="text-purple-200">
                  专属你的智慧
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-purple-300">
                  AI深度学习传统命理智慧，结合个人信息生成专属解读，告别晦涩难懂的传统表述。
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50 border-purple-700/50 backdrop-blur-sm">
              <CardHeader>
                <div className="h-12 w-12 bg-green-600/20 rounded-lg flex items-center justify-center mb-4">
                  <Heart className="h-6 w-6 text-green-400" />
                </div>
                <CardTitle className="text-white">开运商城</CardTitle>
                <CardDescription className="text-purple-200">
                  提升你的运势
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-purple-300">
                  精选开运好物，水晶手链、香薰禅意，为您的生活增添正能量。
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-24 bg-slate-800/30">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            开启你的玄机之旅
          </h2>
          <p className="text-xl text-purple-200 mb-12">
            最低仅需9.9元即可体验一次深度占卜
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
            <Card className="bg-slate-800/50 border-purple-700/50">
              <CardHeader>
                <CardTitle className="text-white">新手体验包</CardTitle>
                <div className="text-3xl font-bold text-purple-400">¥19.9</div>
                <CardDescription className="text-purple-200">20 玄机值</CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="bg-purple-900/50 border-purple-600 relative">
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-600">
                推荐
              </Badge>
              <CardHeader>
                <CardTitle className="text-white">高级推算包</CardTitle>
                <div className="text-3xl font-bold text-purple-400">¥49.9</div>
                <CardDescription className="text-purple-200">55 玄机值 (送5点)</CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="bg-slate-800/50 border-purple-700/50">
              <CardHeader>
                <CardTitle className="text-white">大师尊享包</CardTitle>
                <div className="text-3xl font-bold text-purple-400">¥99.9</div>
                <CardDescription className="text-purple-200">120 玄机值 (送20点)</CardDescription>
              </CardHeader>
            </Card>
          </div>
          
          <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700 text-white px-8">
            <Link href="/pricing">
              查看完整定价
            </Link>
          </Button>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-white text-center mb-16">
            用户好评
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-slate-800/50 border-purple-700/50">
              <CardContent className="pt-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-purple-200 mb-4">
                  "解读非常到位，给了我很大启发。AI的分析很有深度，不像传统算命那样模糊。"
                </p>
                <p className="text-sm text-purple-400">— 匿名用户</p>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50 border-purple-700/50">
              <CardContent className="pt-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-purple-200 mb-4">
                  "界面很舒服，不像别的网站那么乱。八字分析很详细，帮我理解了自己的性格。"
                </p>
                <p className="text-sm text-purple-400">— 匿名用户</p>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50 border-purple-700/50">
              <CardContent className="pt-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-purple-200 mb-4">
                  "六爻占卜很准，对我的工作决策帮助很大。现代化的体验，传统的智慧。"
                </p>
                <p className="text-sm text-purple-400">— 匿名用户</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-slate-800/30">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-white text-center mb-16">
            常见问题
          </h2>
          
          <div className="space-y-6">
            <Card className="bg-slate-800/50 border-purple-700/50">
              <CardHeader>
                <CardTitle className="text-white text-lg">结果准确吗？</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-purple-200">
                  我们基于传统命理学原理，结合AI深度分析，提供个性化解读。命理学旨在提供人生指引和思考角度，具体决策还需结合实际情况。
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50 border-purple-700/50">
              <CardHeader>
                <CardTitle className="text-white text-lg">我的隐私安全吗？</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-purple-200">
                  我们严格保护用户隐私，所有个人信息都经过加密处理。您的推算记录只有您本人可以查看，我们不会泄露任何个人信息。
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50 border-purple-700/50">
              <CardHeader>
                <CardTitle className="text-white text-lg">玄机值如何计算？</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-purple-200">
                  六爻占卜消耗5玄机值，八字详批消耗15玄机值。购买套餐越大，赠送的玄机值越多，更加划算。
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-2xl p-12 border border-purple-700/50">
            <Shield className="h-16 w-16 text-purple-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">
              注册即送体验点数
            </h2>
            <p className="text-xl text-purple-200 mb-8">
              开启你的玄机之旅，探索命运的奥秘
            </p>
            <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700 text-white px-8">
              <Link href={hasEnvVars ? "/auth/sign-up" : "#"}>
                <Sparkles className="h-5 w-5 mr-2" />
                立即注册
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-purple-800/30 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <Sparkles className="h-6 w-6 text-purple-400" />
              <span className="text-white font-bold">玄机阁</span>
              <span className="text-purple-300">AI运势推算平台</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-purple-300">
              <Link href="/pricing" className="hover:text-white transition-colors">
                定价
              </Link>
              <span>•</span>
              <span>服务条款</span>
              <span>•</span>
              <span>隐私政策</span>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-purple-800/30 text-center text-sm text-purple-400">
            <p>© 2024 玄机阁. 传统智慧与现代AI的完美结合</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
