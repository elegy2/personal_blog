import { h } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';

export default function Live2D() {
  const canvasRef = useRef(null);
  const appRef = useRef(null);
  const modelRef = useRef(null);
  const dragDivRef = useRef(null);

  const [currentModel, setCurrentModel] = useState(0);

  const models = [
    { path: '/models/椿/椿.model3.json', icon: '🌸' },
    { path: '/models/秧秧/秧秧.model3.json', icon: '🐰' },
    { path: '/models/kafuka/kafuka1.model3.json', icon: '🐱' },
  ];

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

      // 初始化 PIXI Application，只建一次
      if (!appRef.current) {
        appRef.current = new PIXI.Application({
          view: canvasRef.current,
          resizeTo: window,
          backgroundAlpha: 0,
        });
      }

      return { PIXI, Live2DModel };
    }

    async function loadModel() {
      try {
        const { Live2DModel } = await initApp();
        if (!appRef.current) return;

        const app = appRef.current;

        // 移除旧模型
        if (modelRef.current) {
          app.stage.removeChild(modelRef.current);
          modelRef.current.destroy();
          modelRef.current = null;
        }

        // 加载新模型
        const model = await Live2DModel.from(models[currentModel].path);
        modelRef.current = model;

        const scale = (app.view.height / model.height) * 0.8;
        model.scale.set(scale);
        model.x = app.view.width / 2;
        model.y = app.view.height;
        model.anchor.set(0.5, 1);

        app.stage.addChild(model);

        // === 拖动逻辑在 dragDiv 上 ===
        const dragDiv = dragDivRef.current;
        if (dragDiv) {
          let dragging = false;
          let offsetX = 0;
          let offsetY = 0;

          const onMouseDown = (e) => {
            dragging = true;
            offsetX = e.clientX - model.x;
            offsetY = e.clientY - model.y;
            e.preventDefault();
          };

          const onMouseMove = (e) => {
            if (!dragging) return;
            model.x = e.clientX - offsetX;
            model.y = e.clientY - offsetY;
          };

          const onMouseUp = () => {
            dragging = false;
          };

          dragDiv.addEventListener('mousedown', onMouseDown);
          window.addEventListener('mousemove', onMouseMove);
          window.addEventListener('mouseup', onMouseUp);

          // 清理
          return () => {
            dragDiv.removeEventListener('mousedown', onMouseDown);
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
          };
        }

      } catch (err) {
        console.error('[Live2D] 初始化失败', err);
      }
    }

    loadModel();

    return () => {
      destroyed = true;
    };
  }, [currentModel]);

  return (
    <div>
      {/* 全屏 Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 100,
          pointerEvents: 'none', // 不拦截页面事件
        }}
      ></canvas>

      {/* 拖动容器，覆盖模型位置 */}
      <div
        ref={dragDivRef}
        style={{
          position: 'fixed',
          width: '300px',
          height: '400px',
          left: '50%',
          bottom: 0,
          transform: 'translateX(-50%)',
          zIndex: 101,
          cursor: 'grab',
        }}
      ></div>

      {/* 角色切换按钮 */}
      <div style={{ position: 'fixed', left: 10, bottom: 420, zIndex: 200 }}>
        <button onClick={() => setCurrentModel((i) => (i + 1) % models.length)}>
          ✨
        </button>
      </div>
    </div>
  );
}
