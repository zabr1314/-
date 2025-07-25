import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";
import { Sparkles, Check, Star, Zap, Crown, Gift } from "lucide-react";
import { PaymentButton } from "@/components/payment-button";

export default function PricingPage() {
  const packages = [
    {
      id: "starter",
      name: "新手体验包",
      price: "19.9",
      credits: 20,
      bonus: 0,
      color: "from-blue-600 to-blue-700",
      popular: false,
      features: [
        "4次六爻占卜 (5玄机值/次)",
        "1次八字详批体验",
        "AI个性化解读",
        "结果永久保存",
        "精美分享图片"
      ]
    },
    {
      id: "advanced", 
      name: "高级推算包",
      price: "49.9",
      credits: 55,
      bonus: 5,
      color: "from-purple-600 to-purple-700",
      popular: true,
      features: [
        "11次六爻占卜",
        "3次八字详批",
        "赠送5玄机值",
        "优先AI处理",
        "高清分享图片",
        "PDF报告下载"
      ]
    },
    {
      id: "master",
      name: "大师尊享包", 
      price: "99.9",
      credits: 120,
      bonus: 20,
      color: "from-amber-600 to-amber-700",
      popular: false,
      features: [
        "24次六爻占卜",
        "8次八字详批",
        "赠送20玄机值",
        "专属客服支持",
        "所有高级功能",
        "终身技术支持"
      ]
    }
  ];

  const services = [
    {
      name: "六爻占卜",
      description: "针对具体问题进行占卜分析，判断短期运势吉凶",
      cost: 5,
      duration: "即时生成",
      icon: Star
    },
    {
      name: "八字详批",
      description: "基于生辰八字进行全面分析，洞察一生运势格局",
      cost: 15, 
      duration: "深度解读",
      icon: Crown
    }
  ];

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
            <Link href="/" className="text-purple-200 hover:text-white transition-colors">
              首页
            </Link>
            <AuthButton />
            <ThemeSwitcher />
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Badge variant="secondary" className="bg-purple-900/50 text-purple-200 border-purple-700 mb-6">
            <Gift className="h-4 w-4 mr-2" />
            透明定价，按次付费
          </Badge>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            选择您的
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              玄机值套餐
            </span>
          </h1>
          
          <p className="text-xl text-purple-200 max-w-2xl mx-auto">
            购买玄机值，解锁AI驱动的深度命理分析。套餐越大，赠送越多，更加划算。
          </p>
        </div>
      </section>

      {/* Service Pricing */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-white text-center mb-8">服务定价</h2>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-16">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <Card key={service.name} className="bg-slate-800/50 border-purple-700/50 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-purple-600/20 rounded-lg flex items-center justify-center">
                        <Icon className="h-6 w-6 text-purple-400" />
                      </div>
                      <div>
                        <CardTitle className="text-white">{service.name}</CardTitle>
                        <CardDescription className="text-purple-200">
                          {service.duration}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-purple-300 mb-4">{service.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-purple-400">
                        {service.cost} 玄机值
                      </span>
                      <Badge variant="outline" className="border-purple-500 text-purple-300">
                        每次消耗
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Packages */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">玄机值套餐</h2>
            <p className="text-purple-200">选择适合您的套餐，开启智慧之旅</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {packages.map((pkg) => (
              <Card 
                key={pkg.id} 
                className={`relative bg-slate-800/50 border-purple-700/50 backdrop-blur-sm transition-all hover:scale-105 ${
                  pkg.popular ? 'ring-2 ring-purple-500 bg-purple-900/20' : ''
                }`}
              >
                {pkg.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-600">
                    <Star className="h-3 w-3 mr-1" />
                    最受欢迎
                  </Badge>
                )}
                
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl text-white">{pkg.name}</CardTitle>
                  <div className="space-y-2">
                    <div className="text-4xl font-bold text-white">
                      ¥{pkg.price}
                    </div>
                    <div className="text-purple-200">
                      {pkg.credits} 玄机值
                      {pkg.bonus > 0 && (
                        <Badge variant="secondary" className="ml-2 bg-green-600/20 text-green-400 border-green-600">
                          +{pkg.bonus}赠送
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {pkg.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-3 text-purple-200">
                        <Check className="h-4 w-4 text-green-400 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {hasEnvVars ? (
                    <PaymentButton 
                      packageId={pkg.id} 
                      packageName={pkg.name}
                      color={pkg.color}
                    />
                  ) : (
                    <Button 
                      className={`w-full bg-gradient-to-r ${pkg.color} hover:opacity-90 text-white`}
                      size="lg"
                      asChild
                    >
                      <Link href="#">
                        <Zap className="h-4 w-4 mr-2" />
                        立即充值
                      </Link>
                    </Button>
                  )}

                  <p className="text-xs text-purple-400 text-center">
                    支持微信、支付宝等多种支付方式
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-16 bg-slate-800/30">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">为什么选择玄机阁？</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="h-16 w-16 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">AI深度解读</h3>
              <p className="text-purple-300">
                结合传统命理学与现代AI技术，提供个性化、易懂的深度分析，告别晦涩难懂的传统表述。
              </p>
            </div>

            <div className="text-center">
              <div className="h-16 w-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">按需付费</h3>
              <p className="text-purple-300">
                无需月费年费，按次使用更灵活。玄机值永不过期，随时使用随时享受专业服务。
              </p>
            </div>

            <div className="text-center">
              <div className="h-16 w-16 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Crown className="h-8 w-8 text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">专业可信</h3>
              <p className="text-purple-300">
                基于传统命理学原理，经过专业命理师审核的AI模型，确保结果的专业性和参考价值。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-white text-center mb-12">常见问题</h2>
          
          <div className="space-y-6">
            <Card className="bg-slate-800/50 border-purple-700/50">
              <CardHeader>
                <CardTitle className="text-white text-lg">玄机值会过期吗？</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-purple-200">
                  不会。您购买的玄机值永久有效，可以随时使用。我们相信真正的智慧应该不受时间限制。
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-purple-700/50">
              <CardHeader>
                <CardTitle className="text-white text-lg">支持哪些支付方式？</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-purple-200">
                  我们支持微信支付、支付宝、银行卡等多种支付方式，安全便捷，即时到账。
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-purple-700/50">
              <CardHeader>
                <CardTitle className="text-white text-lg">如何获得更多优惠？</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-purple-200">
                  购买大容量套餐可获得更多赠送玄机值。新用户注册即送体验玄机值，邀请好友还有额外奖励。
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-purple-700/50">
              <CardHeader>
                <CardTitle className="text-white text-lg">不满意可以退款吗？</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-purple-200">
                  我们提供7天无理由退款服务。如果您对服务不满意，可以申请退还未使用的玄机值对应金额。
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-2xl p-12 border border-purple-700/50">
            <h2 className="text-3xl font-bold text-white mb-4">
              开始您的命理探索之旅
            </h2>
            <p className="text-xl text-purple-200 mb-8">
              选择适合的套餐，让AI为您解读命运密码
            </p>
            <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700 text-white px-8">
              <Link href={hasEnvVars ? "/auth/sign-up" : "#"}>
                <Sparkles className="h-5 w-5 mr-2" />
                立即开始
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-purple-800/30 py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <Sparkles className="h-6 w-6 text-purple-400" />
              <span className="text-white font-bold">玄机阁</span>
              <span className="text-purple-300">定价透明，服务专业</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-purple-300">
              <Link href="/" className="hover:text-white transition-colors">
                返回首页
              </Link>
              <span>•</span>
              <span>客服支持</span>
              <span>•</span>
              <span>退款政策</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}