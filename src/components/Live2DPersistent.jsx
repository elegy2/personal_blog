// src/components/Live2DPersistent.jsx
import { h } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';

export default function Live2DPersistent({ selectedModel = 0 }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [currentModel, setCurrentModel] = useState(selectedModel);
  const [showMenu, setShowMenu] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [scale, setScale] = useState(0.12); // 默认缩放 - 调小一些
  const [position, setPosition] = useState({
    x: window.innerWidth - 280,
    y: window.innerHeight - 480
  });
  const dragOffset = useRef({ x: 0, y: 0 });

  const globalState = useRef(null);

  const models = [
    { path: '/models/椿/椿.model3.json', icon: '1', name: '椿' },
    { path: '/models/秧秧/秧秧.model3.json', icon: '2', name: '秧秧' },
    { path: '/models/kafuka/kafuka1.model3.json', icon: '3', name: 'Kafuka' },
    { path: '/models/符玄/符玄.model3.json', icon: '4', name: '符玄' },
    { path: '/models/Nicole/Nicole.model3.json', icon: '5', name: 'Nicole' },
    { path: '/models/藿藿/藿藿.model3.json', icon: '6', name: '藿藿' },
    { path: '/models/简/简.model3.json', icon: '7', name: '简' },
    { path: '/models/知更鸟/知更鸟.model3.json', icon: '8', name: '知更鸟' }
  ];

  useEffect(() => {
    setCurrentModel(selectedModel);
  }, [selectedModel]);

  // 拖拽逻辑
  const handleMouseDown = (e) => {
    if (e.target.closest('.model-controls') || e.target.closest('.model-menu')) return;
    setIsDragging(true);
    const rect = containerRef.current.getBoundingClientRect();
    dragOffset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const newX = Math.max(0, Math.min(e.clientX - dragOffset.current.x, window.innerWidth - 280));
    const newY = Math.max(0, Math.min(e.clientY - dragOffset.current.y, window.innerHeight - 480));
    setPosition({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  // 初始化Live2D
  useEffect(() => {
    let destroyed = false;
    let app = null;
    let model = null;

    async function initApp() {
      try {
        if (window.__live2d_instance) {
          globalState.current = window.__live2d_instance;
          app = globalState.current.app;
          model = globalState.current.model;

          if (canvasRef.current && app.view.parentNode !== canvasRef.current) {
            canvasRef.current.appendChild(app.view);
          }

          // 应用当前缩放
          if (model) {
            model.scale.set(scale);
          }

          setLoading(false);
          return;
        }

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
          width: 280,
          height: 480,
          antialias: true,
        });

        model = await Live2DModel.from(models[currentModel].path);

        if (destroyed) {
          model.destroy();
          app.destroy(true);
          return;
        }

        model.scale.set(scale);
        model.position.set(140, 450);
        model.anchor.set(0.5, 1);

        model.on('hit', (hitAreas) => {
          if (hitAreas.includes('Body')) {
            model.motion('Tap');
          }
        });

        app.stage.addChild(model);

        window.__live2d_instance = { app, model, currentModel };
        globalState.current = window.__live2d_instance;

        setLoading(false);
      } catch (error) {
        console.error('Live2D 加载失败:', error);
        setLoading(false);
      }
    }

    if (isVisible) {
      initApp();
    }

    return () => {
      destroyed = true;
    };
  }, [isVisible]);

  // 更新缩放
  useEffect(() => {
    if (globalState.current?.model) {
      globalState.current.model.scale.set(scale);
    }
  }, [scale]);

  // 切换模型
  const changeModel = async (index) => {
    if (index === currentModel) return;

    setLoading(true);
    setCurrentModel(index);

    try {
      const { Live2DModel } = await import('pixi-live2d-display/cubism4');
      const newModel = await Live2DModel.from(models[index].path);

      const app = globalState.current?.app;
      const oldModel = globalState.current?.model;

      if (app && oldModel) {
        app.stage.removeChild(oldModel);
        oldModel.destroy();

        newModel.scale.set(scale);
        newModel.position.set(140, 450);
        newModel.anchor.set(0.5, 1);

        app.stage.addChild(newModel);

        globalState.current.model = newModel;
        globalState.current.currentModel = index;
        window.__live2d_instance = globalState.current;
      }

      setLoading(false);
    } catch (error) {
      console.error('切换模型失败:', error);
      setLoading(false);
    }
  };

  if (!isVisible) {
    return (
      <button
        className="show-live2d-btn"
        onClick={() => setIsVisible(true)}
        title="显示看板娘"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
      </button>
    );
  }

  return (
    <>
      <div
        ref={containerRef}
        className={`live2d-container ${isDragging ? 'dragging' : ''}`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`
        }}
        onMouseDown={handleMouseDown}
      >
        <canvas ref={canvasRef} />

        {loading && (
          <div className="loading">
            <div className="spinner"></div>
          </div>
        )}

        <div className="model-controls">
          {/* 缩放控制 */}
          <div className="control-group">
            <button
              className="control-btn"
              onClick={() => setScale(Math.min(0.2, scale + 0.02))}
              title="放大"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="M21 21l-4.35-4.35"></path>
                <line x1="11" y1="8" x2="11" y2="14"></line>
                <line x1="8" y1="11" x2="14" y2="11"></line>
              </svg>
            </button>
            <button
              className="control-btn"
              onClick={() => setScale(Math.max(0.06, scale - 0.02))}
              title="缩小"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="M21 21l-4.35-4.35"></path>
                <line x1="8" y1="11" x2="14" y2="11"></line>
              </svg>
            </button>
          </div>

          {/* 菜单和关闭 */}
          <div className="control-group">
            <button
              className="control-btn"
              onClick={() => setShowMenu(!showMenu)}
              title="切换模型"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="1"></circle>
                <circle cx="19" cy="12" r="1"></circle>
                <circle cx="5" cy="12" r="1"></circle>
              </svg>
            </button>
            <button
              className="control-btn close-btn"
              onClick={() => setIsVisible(false)}
              title="关闭看板娘"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>

        {showMenu && (
          <div className="model-menu">
            <div className="menu-header">
              <span>选择看板娘</span>
              <button className="close-menu" onClick={() => setShowMenu(false)}>✕</button>
            </div>
            <div className="model-grid">
              {models.map((m, idx) => (
                <button
                  key={idx}
                  className={`model-btn ${idx === currentModel ? 'active' : ''}`}
                  onClick={() => {
                    changeModel(idx);
                    setShowMenu(false);
                  }}
                >
                  <span className="model-number">{m.icon}</span>
                  <span className="model-name">{m.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .live2d-container {
          position: fixed;
          width: 280px;
          height: 480px;
          z-index: 100;
          cursor: move;
          transition: opacity 0.3s ease;
          user-select: none;
        }

        .live2d-container.dragging {
          opacity: 0.8;
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
          pointer-events: none;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid rgba(255, 255, 255, 0.3);
          border-top-color: #667eea;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .model-controls {
          position: absolute;
          bottom: 10px;
          right: 10px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          cursor: default;
        }

        .control-group {
          display: flex;
          gap: 6px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 4px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .control-btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: none;
          background: transparent;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          color: #4a5568;
        }

        .control-btn:hover {
          background: rgba(102, 126, 234, 0.1);
          color: #667eea;
        }

        .control-btn.close-btn:hover {
          background: rgba(245, 101, 101, 0.1);
          color: #f56565;
        }

        .show-live2d-btn {
          position: fixed;
          bottom: 24px;
          right: 24px;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          border: none;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
          transition: all 0.3s ease;
          z-index: 100;
          animation: pulse 2s ease-in-out infinite;
        }

        .show-live2d-btn:hover {
          transform: scale(1.1);
          box-shadow: 0 12px 32px rgba(102, 126, 234, 0.6);
        }

        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
          }
          50% {
            box-shadow: 0 8px 32px rgba(102, 126, 234, 0.8);
          }
        }

        .model-menu {
          position: absolute;
          bottom: 120px;
          right: 10px;
          background: white;
          border-radius: 16px;
          padding: 16px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
          min-width: 240px;
          animation: slideUp 0.3s ease;
          cursor: default;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .menu-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          padding-bottom: 12px;
          border-bottom: 1px solid #e2e8f0;
        }

        .menu-header span {
          font-weight: 600;
          color: #2d3748;
          font-size: 14px;
        }

        .close-menu {
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
          color: #718096;
          padding: 0;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s ease;
        }

        .close-menu:hover {
          color: #2d3748;
        }

        .model-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
        }

        .model-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 12px 8px;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          background: white;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .model-btn:hover {
          border-color: #667eea;
          background: #f7fafc;
          transform: translateY(-2px);
        }

        .model-btn.active {
          border-color: #667eea;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .model-number {
          font-size: 16px;
          font-weight: 700;
        }

        .model-name {
          font-size: 12px;
          font-weight: 500;
        }

        .model-btn.active .model-name,
        .model-btn.active .model-number {
          color: white;
        }

        @media (max-width: 768px) {
          .live2d-container {
            width: 200px;
            height: 360px;
          }

          .model-menu {
            right: auto;
            left: 10px;
          }

          .show-live2d-btn {
            width: 48px;
            height: 48px;
            bottom: 16px;
            right: 16px;
          }
        }
      `}</style>
    </>
  );
}
