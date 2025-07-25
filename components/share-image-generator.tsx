"use client";

import { Button } from "@/components/ui/button";
import { Share2, Download, Copy, Check } from "lucide-react";
import { useState } from "react";

interface ShareImageGeneratorProps {
  readingId: string;
  type: 'bazi' | 'liuyao';
  title: string;
  summary: string;
  aiScore: number;
  createdAt: string;
}

export function ShareImageGenerator({ 
  readingId, 
  type, 
  title, 
  summary, 
  aiScore, 
  createdAt 
}: ShareImageGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const generateShareImage = async () => {
    setIsGenerating(true);
    try {
      // 构建图片API URL
      const params = new URLSearchParams({
        type,
        title: title.slice(0, 30), // 限制长度
        summary: summary.slice(0, 60), // 限制长度
        score: aiScore.toString(),
        date: new Date(createdAt).toLocaleDateString('zh-CN')
      });

      const url = `/api/images/share?${params.toString()}`;
      setImageUrl(url);

      // 更新数据库中的分享图片URL（可选）
      try {
        await fetch('/api/readings/update-share', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            readingId,
            imageUrl: url
          }),
        });
      } catch (error) {
        console.error('更新分享图片URL失败:', error);
      }

    } catch (error) {
      console.error('生成分享图片失败:', error);
      alert('生成分享图片失败，请重试');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = async () => {
    if (!imageUrl) return;

    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `玄机阁-${title}-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('下载图片失败:', error);
      alert('下载失败，请重试');
    }
  };

  const copyImageUrl = async () => {
    if (!imageUrl) return;

    try {
      const fullUrl = `${window.location.origin}${imageUrl}`;
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('复制链接失败:', error);
      alert('复制失败，请重试');
    }
  };

  const shareToSocialMedia = (platform: 'wechat' | 'weibo' | 'qq') => {
    if (!imageUrl) return;

    const fullUrl = `${window.location.origin}${imageUrl}`;
    const text = `我在玄机阁进行了${type === 'bazi' ? '八字详批' : '六爻占卜'}，AI评分${aiScore}分！`;
    
    let shareUrl = '';
    
    switch (platform) {
      case 'weibo':
        shareUrl = `https://service.weibo.com/share/share.php?url=${encodeURIComponent(fullUrl)}&title=${encodeURIComponent(text)}`;
        break;
      case 'qq':
        shareUrl = `https://connect.qq.com/widget/shareqq/index.html?url=${encodeURIComponent(fullUrl)}&title=${encodeURIComponent(text)}`;
        break;
      default:
        // 微信分享需要特殊处理，这里提供复制链接功能
        copyImageUrl();
        alert('微信分享：请复制链接后在微信中分享');
        return;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  return (
    <div className="space-y-4">
      {/* 生成分享图片按钮 */}
      {!imageUrl && (
        <Button
          onClick={generateShareImage}
          disabled={isGenerating}
          className="bg-purple-600 hover:bg-purple-700 w-full"
        >
          <Share2 className="h-4 w-4 mr-2" />
          {isGenerating ? '生成中...' : '生成分享图片'}
        </Button>
      )}

      {/* 图片预览和操作 */}
      {imageUrl && (
        <div className="space-y-4">
          {/* 图片预览 */}
          <div className="border border-purple-700/50 rounded-lg overflow-hidden">
            <img
              src={imageUrl}
              alt="分享图片预览"
              className="w-full h-auto"
              style={{ maxHeight: '300px', objectFit: 'contain' }}
            />
          </div>

          {/* 操作按钮 */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={downloadImage}
              variant="outline"
              className="border-green-600 text-green-300 hover:bg-green-900/50"
            >
              <Download className="h-4 w-4 mr-2" />
              下载图片
            </Button>

            <Button
              onClick={copyImageUrl}
              variant="outline"
              className="border-blue-600 text-blue-300 hover:bg-blue-900/50"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  已复制
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  复制链接
                </>
              )}
            </Button>
          </div>

          {/* 社交媒体分享 */}
          <div className="space-y-2">
            <p className="text-sm text-purple-300 text-center">分享到社交媒体</p>
            <div className="grid grid-cols-3 gap-2">
              <Button
                onClick={() => shareToSocialMedia('wechat')}
                variant="outline"
                size="sm"
                className="border-green-600 text-green-300 hover:bg-green-900/50"
              >
                微信
              </Button>
              <Button
                onClick={() => shareToSocialMedia('weibo')}
                variant="outline"
                size="sm"
                className="border-red-600 text-red-300 hover:bg-red-900/50"
              >
                微博
              </Button>
              <Button
                onClick={() => shareToSocialMedia('qq')}
                variant="outline"
                size="sm"
                className="border-blue-600 text-blue-300 hover:bg-blue-900/50"
              >
                QQ空间
              </Button>
            </div>
          </div>

          {/* 重新生成按钮 */}
          <Button
            onClick={() => {
              setImageUrl('');
              generateShareImage();
            }}
            variant="ghost"
            size="sm"
            className="text-purple-400 hover:text-purple-300 w-full"
          >
            重新生成图片
          </Button>
        </div>
      )}
    </div>
  );
}