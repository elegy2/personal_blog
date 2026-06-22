// src/components/Live2DViewer.jsx
// 可交互的高清 Live2D 查看器：支持拖动、滚轮缩放、按钮控制、重置
import { h } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';

export default function Live2DViewer({ modelIndex = 0, modelName = '' }) {
  const canvasRef = useRef(null);
  const appRef = useRef(null);
  const modelRef = useRef(null);
  const [loading, setLoading] = useState(true);

  // 基准缩放（每个模型加载后自适应计算）
  const baseScaleRef = useRef(0.18);
  // 用户缩放倍率
  const [zoom, setZoom] = useState(1);
  const zoomRef = useRef(1);

  // 拖拽位置偏移
  const offsetRef = useRef({ x: 0, y: 0 });
  const draggingRef = useRef(false);
  const lastPosRef = useRef({ x: 0, y: 0 });

  const VIEW_W = 600;
  const VIEW_H = 800;

  // 应用变换到模型
  const applyTransform = () => {
    const model = modelRef.current;
    if (!model) return;
    const s = baseScaleRef.current * zoomRef.current;
    model.scale.set(s);
    model.x = VIEW_W / 2 + offsetRef.current.x;
    model.y = VIEW_H + offsetRef.current.y; // 锚点在底部
  };

  // 初始化 Pixi + Live2D（只创建一次）
  useEffect(() => {
    let destroyed = false;

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

        const app = new PIXI.Application({
          view: canvasRef.current,
          autoStart: true,
          backgroundAlpha: 0,
          width: VIEW_W,
          height: VIEW_H,
          antialias: true,
          resolution: window.devicePixelRatio || 2,
        });
        appRef.current = app;

        await loadModel(modelIndex);
      } catch (error) {
        console.error('Live2D 初始化失败:', error);
        setLoading(false);
      }
    }

    initApp();

    return () => {
      destroyed = true;
      if (modelRef.current) {
        modelRef.current.destroy();
        modelRef.current = null;
      }
      if (appRef.current) {
        appRef.current.destroy(true);
        appRef.current = null;
      }
    };
  }, []);

  // 加载/切换模型
  const loadModel = async (index) => {
    const app = appRef.current;
    if (!app) return;

    setLoading(true);
    try {
      const { Live2DModel } = await import('pixi-live2d-display/cubism4');
      const models = MODEL_PATHS;
      const model = await Live2DModel.from(models[index]);

      // 移除旧模型
      if (modelRef.current) {
        app.stage.removeChild(modelRef.current);
        modelRef.current.destroy();
        modelRef.current = null;
      }

      model.anchor.set(0.5, 1);

      // 自适应基准缩放：让模型高度约占视图的 90%
      const rawHeight = model.height / (model.scale.y || 1);
      const fitScale = (VIEW_H * 0.9) / rawHeight;
      baseScaleRef.current = fitScale;

      // 重置用户变换
      zoomRef.current = 1;
      setZoom(1);
      offsetRef.current = { x: 0, y: 0 };

      modelRef.current = model;
      app.stage.addChild(model);
      applyTransform();

      // 点击身体触发动作
      model.on('hit', (hitAreas) => {
        if (hitAreas.includes('Body')) model.motion('Tap');
        else model.motion('');
      });

      setLoading(false);
    } catch (error) {
      console.error('模型加载失败:', error);
      setLoading(false);
    }
  };

  // modelIndex 变化时切换模型
  useEffect(() => {
    if (appRef.current) {
      loadModel(modelIndex);
    }
  }, [modelIndex]);

  // 缩放控制
  const changeZoom = (delta) => {
    const next = Math.min(3, Math.max(0.3, zoomRef.current + delta));
    zoomRef.current = next;
    setZoom(next);
    applyTransform();
  };

  const resetView = () => {
    zoomRef.current = 1;
    setZoom(1);
    offsetRef.current = { x: 0, y: 0 };
    applyTransform();
  };

  // 滚轮缩放
  const handleWheel = (e) => {
    e.preventDefault();
    changeZoom(e.deltaY < 0 ? 0.1 : -0.1);
  };

  // 拖拽平移
  const handlePointerDown = (e) => {
    draggingRef.current = true;
    lastPosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e) => {
    if (!draggingRef.current) return;
    const dx = e.clientX - lastPosRef.current.x;
    const dy = e.clientY - lastPosRef.current.y;
    lastPosRef.current = { x: e.clientX, y: e.clientY };
    offsetRef.current = {
      x: offsetRef.current.x + dx,
      y: offsetRef.current.y + dy,
    };
    applyTransform();
  };

  const handlePointerUp = () => {
    draggingRef.current = false;
  };

  return (
    <div className="viewer-wrap">
      <div
        className="canvas-box"
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <canvas ref={canvasRef} />

        {loading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>加载中...</p>
          </div>
        )}

        {modelName && <div className="model-badge">{modelName}</div>}

        <div className="hint">🖱️ 拖动平移 · 滚轮缩放</div>
      </div>

      {/* 控制栏 */}
      <div className="controls">
        <button onClick={() => changeZoom(0.15)} title="放大">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="M21 21l-4.35-4.35"></path>
            <line x1="11" y1="8" x2="11" y2="14"></line>
            <line x1="8" y1="11" x2="14" y2="11"></line>
          </svg>
        </button>
        <span className="zoom-level">{Math.round(zoom * 100)}%</span>
        <button onClick={() => changeZoom(-0.15)} title="缩小">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="M21 21l-4.35-4.35"></path>
            <line x1="8" y1="11" x2="14" y2="11"></line>
          </svg>
        </button>
        <button onClick={resetView} title="重置视图" className="reset-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
            <path d="M3 3v5h5"></path>
          </svg>
        </button>
      </div>

      <style jsx>{`
        .viewer-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          width: 100%;
        }

        .canvas-box {
          position: relative;
          width: 600px;
          height: 800px;
          max-width: 100%;
          background: radial-gradient(circle at 50% 30%, rgba(102,126,234,0.08), rgba(118,75,162,0.04));
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
          cursor: grab;
          touch-action: none;
        }

        .canvas-box:active {
          cursor: grabbing;
        }

        canvas {
          width: 100%;
          height: 100%;
          display: block;
        }

        .loading {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
          color: #667eea;
          pointer-events: none;
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

        .model-badge {
          position: absolute;
          top: 16px;
          left: 16px;
          padding: 6px 16px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 700;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .hint {
          position: absolute;
          bottom: 16px;
          left: 50%;
          transform: translateX(-50%);
          padding: 6px 14px;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(8px);
          color: white;
          border-radius: 20px;
          font-size: 12px;
          white-space: nowrap;
          pointer-events: none;
        }

        .controls {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 16px;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(12px);
          border-radius: 30px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        }

        .controls button {
          width: 40px;
          height: 40px;
          border: none;
          border-radius: 50%;
          background: rgba(102, 126, 234, 0.1);
          color: #667eea;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .controls button:hover {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          transform: translateY(-2px);
        }

        .reset-btn {
          background: rgba(245, 101, 101, 0.1) !important;
          color: #f56565 !important;
        }

        .reset-btn:hover {
          background: linear-gradient(135deg, #f56565 0%, #c53030 100%) !important;
          color: white !important;
        }

        .zoom-level {
          min-width: 50px;
          text-align: center;
          font-weight: 700;
          color: #4a5568;
          font-size: 14px;
        }

        html.dark .controls {
          background: rgba(30, 30, 30, 0.8);
        }

        html.dark .zoom-level {
          color: #e2e8f0;
        }

        @media (max-width: 768px) {
          .canvas-box {
            width: 100%;
            max-width: 400px;
            height: 560px;
          }
        }
      `}</style>
    </div>
  );
}

const MODEL_PATHS = [
  '/models/椿/椿.model3.json',
  '/models/秧秧/秧秧.model3.json',
  '/models/kafuka/kafuka1.model3.json',
  '/models/符玄/符玄.model3.json',
  '/models/Nicole/Nicole.model3.json',
  '/models/藿藿/藿藿.model3.json',
  '/models/简/简.model3.json',
  '/models/知更鸟/知更鸟.model3.json',
];
