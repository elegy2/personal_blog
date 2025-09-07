// src/components/Live2D.jsx
import { h } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';

export default function Live2D({ selectedModel = 0 }) {
  const canvasRef = useRef(null);
  const appRef = useRef(null);
  const modelRef = useRef(null);
  const dragDivRef = useRef(null);

  const [currentModel, setCurrentModel] = useState(selectedModel);
  const [showMenu, setShowMenu] = useState(false);
  const [loading, setLoading] = useState(true);

  const models = [
    { path: '/models/椿/椿.model3.json', icon: '1' },
    { path: '/models/秧秧/秧秧.model3.json', icon: '2' },
    { path: '/models/kafuka/kafuka1.model3.json', icon: '3' },
    { path: '/models/符玄/符玄.model3.json', icon: '4' },
    { path: '/models/Nicole/Nicole.model3.json', icon: '5' },
    { path: '/models/藿藿/藿藿.model3.json', icon: '6' },
    { path: '/models/简/简.model3.json', icon: '7' },
    { path: '/models/知更鸟/知更鸟.model3.json', icon: '8' }
  ];

  // 缓存已加载的模型
  const modelCache = useRef({});

  useEffect(() => {
    setCurrentModel(selectedModel);
  }, [selectedModel]);

  useEffect(() => {
    let destroyed = false;

    async function initApp() {
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

      if (!canvasRef.current || destroyed) return;
      if (!appRef.current) {
        appRef.current = new PIXI.Application({
          view: canvasRef.current,
          resizeTo: window,
          backgroundAlpha: 0,
          resolution: window.devicePixelRatio || 1,
          antialias: true,
          autoDensity: true,
        });
      }

      return { PIXI, Live2DModel };
    }

    async function loadModel() {
      if (currentModel === null) {
        // 隐藏当前模型
        if (modelRef.current && appRef.current) {
          modelRef.current.visible = false;
        }
        return;
      }

      setLoading(true);

      try {
        const { Live2DModel } = await initApp();
        if (!appRef.current) return;
        const app = appRef.current;

        let model;

        if (modelCache.current[currentModel]) {
          model = modelCache.current[currentModel];
        } else {
          model = await Live2DModel.from(models[currentModel].path);
          // 初始化缩放和锚点
          const scale = (app.view.height / model.height) * 0.4;
          model.scale.set(scale);
          model.anchor.set(0.5, 1);
          model.x = app.view.width / 2;
          model.y = app.view.height / 2;

          modelCache.current[currentModel] = model;
        }

        // 隐藏所有模型
        Object.values(modelCache.current).forEach(m => {
          if (app.stage.children.includes(m)) m.visible = false;
        });

        // 添加到舞台并显示
        if (!app.stage.children.includes(model)) {
          app.stage.addChild(model);
        }
        model.visible = true;
        modelRef.current = model;

        // 拖拽 div
        const dragDiv = dragDivRef.current;
        dragDiv.style.left = `${model.x - dragDiv.offsetWidth / 2}px`;
        dragDiv.style.top = `${model.y - dragDiv.offsetHeight / 2}px`;

        let dragging = false;
        let offsetX = 0;
        let offsetY = 0;

        const onMouseDown = (e) => {
          const pos = {};
          app.renderer.plugins.interaction.mapPositionToPoint(pos, e.clientX, e.clientY);
          dragging = true;
          offsetX = pos.x - model.x;
          offsetY = pos.y - model.y;
          e.preventDefault();
        };

        const onMouseMove = (e) => {
          if (!dragging) return;
          const pos = {};
          app.renderer.plugins.interaction.mapPositionToPoint(pos, e.clientX, e.clientY);
          const newX = pos.x - offsetX;
          const newY = pos.y - offsetY;
          model.x = newX;
          model.y = newY;
          dragDiv.style.left = `${newX - dragDiv.offsetWidth / 2}px`;
          dragDiv.style.top = `${newY - dragDiv.offsetHeight / 2}px`;
        };

        const onMouseUp = () => { dragging = false; };

        dragDiv.addEventListener('mousedown', onMouseDown);
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);

        setLoading(false);

      } catch (err) {
        console.error('[Live2D] 初始化失败', err);
        setLoading(false);
      }
    }

    loadModel();
    return () => { destroyed = true; };
  }, [currentModel]);

  return (
    <div>
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 999,
          pointerEvents: 'none',
        }}
      />

      <div
        ref={dragDivRef}
        style={{
          position: 'fixed',
          width: '300px',
          height: '400px',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 101,
          cursor: 'grab',
        }}
        onMouseEnter={() => setShowMenu(true)}
        onMouseLeave={() => setShowMenu(false)}
      >
        {loading && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: '#fff',
              fontSize: '16px',
              background: 'rgba(0,0,0,0.5)',
              padding: '4px 8px',
              borderRadius: '4px',
              zIndex: 105,
            }}
          >
            模型加载中...
          </div>
        )}

        {showMenu && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-100%, calc(-50% - 20px))',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              zIndex: 102,
            }}
          >
            <button
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                border: 'none',
                background: 'rgba(0,0,0,0.6)',
                color: '#fff',
                fontSize: '14px',
                cursor: 'pointer',
              }}
              onClick={() => setCurrentModel((i) => (i + 1) % models.length)}
            >
              ✨
            </button>
            <button
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                border: 'none',
                background: 'rgba(255,0,0,0.7)',
                color: '#fff',
                fontSize: '14px',
                cursor: 'pointer',
              }}
              onClick={() => setCurrentModel(null)}
            >
              ✕
            </button>
          </div>
        )}
      </div>
    </div>
  );
}



