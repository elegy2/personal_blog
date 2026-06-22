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
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const dragOffset = useRef({ x: 0, y: 0 });

  // 使用全局单例来存储Live2D实例
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
    if (e.target.closest('.model-menu')) return;
    setIsDragging(true);
    const rect = containerRef.current.getBoundingClientRect();
    dragOffset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const newX = e.clientX - dragOffset.current.x;
    const newY = e.clientY - dragOffset.current.y;
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

  useEffect(() => {
    let destroyed = false;
    let app = null;
    let model = null;

    async function initApp() {
      try {
        // 检查全局实例
        if (window.__live2d_instance) {
          globalState.current = window.__live2d_instance;
          app = globalState.current.app;
          model = globalState.current.model;

          // 复用现有canvas
          if (canvasRef.current && app.view !== canvasRef.current) {
            canvasRef.current.appendChild(app.view);
          }

          setLoading(false);
          return;
        }

        // 初始化新实例
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
          width: 300,
          height: 400,
          antialias: true,
        });

        model = await Live2DModel.from(models[currentModel].path);

        if (destroyed) {
          model.destroy();
          app.destroy(true);
          return;
        }

        model.scale.set(0.1);
        model.position.set(150, 350);
        model.anchor.set(0.5, 0.5);

        // 添加鼠标跟踪
        model.on('hit', (hitAreas) => {
          if (hitAreas.includes('Body')) {
            model.motion('Tap');
          }
        });

        app.stage.addChild(model);

        // 保存到全局
        window.__live2d_instance = { app, model, currentModel };
        globalState.current = window.__live2d_instance;

        setLoading(false);
      } catch (error) {
        console.error('Live2D 加载失败:', error);
        setLoading(false);
      }
    }

    initApp();

    return () => {
      destroyed = true;
      // 不销毁全局实例，保持持久化
    };
  }, []);

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

        newModel.scale.set(0.1);
        newModel.position.set(150, 350);
        newModel.anchor.set(0.5, 0.5);

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

  return (
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

      <div className="controls">
        <button
          className="menu-toggle"
          onClick={() => setShowMenu(!showMenu)}
          title="切换模型"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="1"></circle>
            <circle cx="19" cy="12" r="1"></circle>
            <circle cx="5" cy="12" r="1"></circle>
          </svg>
        </button>
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

      <style jsx>{`
        .live2d-container {
          position: fixed;
          width: 300px;
          height: 400px;
          z-index: 100;
          cursor: move;
          transition: opacity 0.3s ease;
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

        .controls {
          position: absolute;
          bottom: 10px;
          right: 10px;
        }

        .menu-toggle {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: none;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          transition: all 0.3s ease;
        }

        .menu-toggle:hover {
          transform: scale(1.1);
          background: white;
        }

        .model-menu {
          position: absolute;
          bottom: 60px;
          right: 10px;
          background: white;
          border-radius: 16px;
          padding: 16px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
          min-width: 240px;
          animation: slideUp 0.3s ease;
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
          font-size: 18px;
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
            height: 300px;
          }

          .model-menu {
            right: auto;
            left: 10px;
          }
        }
      `}</style>
    </div>
  );
}
