import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // 获取参数
    const type = searchParams.get('type') || 'bazi';
    const title = searchParams.get('title') || '玄机阁推算结果';
    const summary = searchParams.get('summary') || '洞察天机，决策未来';
    const score = searchParams.get('score') || '95';
    const date = searchParams.get('date') || new Date().toLocaleDateString();

    // 根据类型设置颜色主题
    const colors = type === 'bazi' 
      ? {
          primary: '#9333ea', // purple-600
          secondary: '#a855f7', // purple-500
          accent: '#c084fc', // purple-400
          background: '#1e1b4b', // indigo-900
          card: '#312e81' // indigo-800
        }
      : {
          primary: '#ea580c', // orange-600
          secondary: '#f97316', // orange-500
          accent: '#fb923c', // orange-400
          background: '#7c2d12', // orange-900
          card: '#9a3412' // orange-800
        };

    const typeDisplay = type === 'bazi' ? '八字详批' : '六爻占卜';
    const icon = type === 'bazi' ? '👑' : '⭐';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.background,
            backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(255,255,255,0.1) 2px, transparent 0), radial-gradient(circle at 75px 75px, rgba(255,255,255,0.05) 2px, transparent 0)',
            backgroundSize: '100px 100px',
            fontFamily: '"Noto Sans SC", sans-serif',
          }}
        >
          {/* 顶部装饰 */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '6px',
              background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary}, ${colors.accent})`,
            }}
          />

          {/* 主要内容区域 */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: colors.card,
              borderRadius: '24px',
              padding: '60px',
              margin: '40px',
              width: '80%',
              maxWidth: '800px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              border: `2px solid ${colors.accent}40`,
            }}
          >
            {/* Logo和标题 */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '40px',
              }}
            >
              <span style={{ fontSize: '48px', marginRight: '16px' }}>✨</span>
              <h1
                style={{
                  fontSize: '48px',
                  fontWeight: 'bold',
                  color: 'white',
                  margin: 0,
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                }}
              >
                玄机阁
              </h1>
            </div>

            {/* 推算类型标签 */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: colors.primary,
                borderRadius: '50px',
                padding: '12px 32px',
                marginBottom: '32px',
              }}
            >
              <span style={{ fontSize: '24px', marginRight: '12px' }}>{icon}</span>
              <span
                style={{
                  fontSize: '24px',
                  fontWeight: '600',
                  color: 'white',
                }}
              >
                {typeDisplay}
              </span>
            </div>

            {/* 推算标题 */}
            <h2
              style={{
                fontSize: '36px',
                fontWeight: 'bold',
                color: 'white',
                textAlign: 'center',
                marginBottom: '24px',
                lineHeight: 1.2,
                maxWidth: '600px',
              }}
            >
              {title}
            </h2>

            {/* 摘要内容 */}
            <p
              style={{
                fontSize: '20px',
                color: colors.accent,
                textAlign: 'center',
                lineHeight: 1.5,
                marginBottom: '40px',
                maxWidth: '600px',
              }}
            >
              {summary}
            </p>

            {/* 评分和日期 */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                maxWidth: '500px',
                marginTop: '20px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: colors.secondary + '40',
                  borderRadius: '16px',
                  padding: '16px 24px',
                }}
              >
                <span style={{ fontSize: '20px', marginRight: '12px' }}>⭐</span>
                <span
                  style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: colors.accent,
                  }}
                >
                  AI评分: {score}
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  color: colors.accent,
                  fontSize: '18px',
                }}
              >
                <span style={{ marginRight: '8px' }}>📅</span>
                {date}
              </div>
            </div>
          </div>

          {/* 底部水印 */}
          <div
            style={{
              position: 'absolute',
              bottom: '20px',
              display: 'flex',
              alignItems: 'center',
              color: 'rgba(255,255,255,0.6)',
              fontSize: '16px',
            }}
          >
            <span style={{ marginRight: '8px' }}>🔮</span>
            传统智慧与现代AI的完美结合
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error('图片生成错误:', error);
    return new Response('图片生成失败', { status: 500 });
  }
}