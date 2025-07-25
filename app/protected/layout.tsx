import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";
import { Sparkles, Plus, History, User, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="w-full border-b border-purple-800/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center p-4 px-6">
          <div className="flex items-center gap-8">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Sparkles className="h-6 w-6 text-purple-400" />
              <Link href="/" className="text-xl font-bold text-white">
                玄机阁
              </Link>
            </div>
            
            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-6">
              <Link 
                href="/protected/new-reading" 
                className="flex items-center gap-2 text-purple-200 hover:text-white transition-colors"
              >
                <Plus className="h-4 w-4" />
                新建推算
              </Link>
              <Link 
                href="/protected/readings" 
                className="flex items-center gap-2 text-purple-200 hover:text-white transition-colors"
              >
                <History className="h-4 w-4" />
                历史记录
              </Link>
              <Link 
                href="/protected/my" 
                className="flex items-center gap-2 text-purple-200 hover:text-white transition-colors"
              >
                <User className="h-4 w-4" />
                个人中心
              </Link>
              <Link 
                href="/protected/mall" 
                className="flex items-center gap-2 text-purple-200 hover:text-white transition-colors"
              >
                <ShoppingBag className="h-4 w-4" />
                运势商城
              </Link>
            </div>
          </div>
          
          {/* Right side */}
          <div className="flex items-center gap-4">
            <Button asChild size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
              <Link href="/protected/new-reading">
                <Plus className="h-4 w-4 mr-2" />
                开始推算
              </Link>
            </Button>
            <AuthButton />
            <ThemeSwitcher />
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="flex-1">
        {children}
      </div>

      {/* Footer */}
      <footer className="border-t border-purple-800/30 py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <Sparkles className="h-6 w-6 text-purple-400" />
              <span className="text-white font-bold">玄机阁</span>
              <span className="text-purple-300">您的AI命理军师</span>
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
        </div>
      </footer>
    </main>
  );
}
