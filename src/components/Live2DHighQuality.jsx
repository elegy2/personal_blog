// src/components/Live2DHighQuality.jsx
import { h } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';

export default function Live2DHighQuality({ modelIndex = 0 }) {
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(true);

  const models = [
    { path: '/models/椿/椿.model3.json', name: '椿' },
    { path: '/models/秧秧/秧秧.model3.json', name: '秧秧' },
    { path: '/models/kafuka/kafuka1.model3.json', name: 'Kafuka' },
    { path: '/models/符玄/符玄.model3.json', name: '符玄' },
    { path: '/models/Nicole/Nicole.model3.json', name: 'Nicole' },
    { path: '/models/藿藿/藿藿.model3.json', name: '藿藿' },
    { path: '/models/简/简.model3.json', name: '简' },
    { path: '/models/知更鸟/知更鸟.model3.json', name: '知更鸟' }
  ];

  useEffect(() => {
    let destroyed = false;
    let app = null;
    let model = null;

    async function initApp() {
      try {
        if (!window.Live2DCubismCore) {
          await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = '/libs/live2dcubismcore.min.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
          });
        }

        const PIXI = await import('pixi.js');
        const { Live2DModel } = await import('pixi-live2d-display/cubism4');
        Live2DModel.registerTicker(PIXI.Ticker);

        if (destroyed) return;

        app = new PIXI.Application({
          view: canvasRef.current,
          autoStart: true,
          backgroundAlpha: 0,
          width: 600,
          height: 800,
          antialias: true,
          resolution: window.devicePixelRatio || 2, // 高分辨率
        });

        model = await Live2DModel.from(models[modelIndex].path);

        if (destroyed) {
          model.destroy();
          app.destroy(true);
          return;
        }

        // 更大的缩放和更好的定位以确保高清显示
        model.scale.set(0.18);
        model.position.set(300, 750);
        model.anchor.set(0.5, 1);

        // 添加交互
        model.on('hit', (hitAreas) => {
          if (hitAreas.includes('Body')) {
            model.motion('Tap');
          }
        });

        app.stage.addChild(model);

        setLoading(false);
      } catch (error) {
        console.error('Live2D 加载失败:', error);
        setLoading(false);
      }
    }

    initApp();

    return () => {
      destroyed = true;
      if (model) model.destroy();
      if (app) app.destroy(true);
    };
  }, [modelIndex]);

  return (
    <div className="live2d-hq-container">
      <canvas ref={canvasRef} />
      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>加载中...</p>
        </div>
      )}
      <style jsx>{`
        .live2d-hq-container {
          position: relative;
          width: 600px;
          height: 800px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }

        canvas {
          width: 100%;
          height: 100%;
        }

        .loading {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
          color: #667eea;
        }

        .spinner {
          width: 50px;
          height: 50px;
          margin: 0 auto 1rem;
          border: 4px solid rgba(102, 126, 234, 0.2);
          border-top-color: #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .loading p {
          margin: 0;
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .live2d-hq-container {
            width: 100%;
            max-width: 400px;
            height: 600px;
          }
        }
      `}</style>
    </div>
  );
}
