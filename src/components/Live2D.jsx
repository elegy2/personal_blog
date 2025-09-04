import { h } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';

export default function Live2D() {
  const canvasRef = useRef(null);        // 用于绑定 canvas 元素
  const appRef = useRef(null);           // PIXI 应用的引用
  const modelRef = useRef(null);         // 模型的引用
  const dragDivRef = useRef(null);      // 拖动窗口的引用

  const [currentModel, setCurrentModel] = useState(0); // 当前显示的模型的索引

  // 模型的路径和图标
  const models = [
    { path: '/models/椿/椿.model3.json', icon: '🌸' },
    { path: '/models/秧秧/秧秧.model3.json', icon: '🐰' },
    { path: '/models/kafuka/kafuka1.model3.json', icon: '🐱' },
  ];

  // 每次模型切换时加载新模型
  useEffect(() => {
    let destroyed = false;  // 用于检测组件是否被销毁

    // 初始化 PIXI 应用和 Live2D 模型库
    async function initApp() {
      // 加载 Live2D 库
      if (!window.Live2DCubismCore) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = '/libs/live2dcubismcore.min.js';
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }

      // 动态导入 PIXI 和 Live2D 模型显示库
      const PIXI = await import('pixi.js');
      const { Live2DModel } = await import('pixi-live2d-display/cubism4');

      // 注册 PIXI Ticker 用于动画循环
      Live2DModel.registerTicker(PIXI.Ticker);

      // 如果 canvas 未初始化，退出
      if (!canvasRef.current || destroyed) return;

      // 如果 PIXI 应用还未初始化，进行初始化
      if (!appRef.current) {
        appRef.current = new PIXI.Application({
          view: canvasRef.current,
          resizeTo: window,
          backgroundAlpha: 0, // 设置透明背景
        });
      }

      return { PIXI, Live2DModel };
    }

    // 加载并显示模型
    async function loadModel() {
      try {
        const { Live2DModel } = await initApp();
        if (!appRef.current) return;

        const app = appRef.current;

        // 移除当前模型（如果有）
        if (modelRef.current) {
          app.stage.removeChild(modelRef.current);
          modelRef.current.destroy();
          modelRef.current = null;
        }

        // 加载新模型
        const model = await Live2DModel.from(models[currentModel].path);
        modelRef.current = model;

        // 计算模型缩放比例，并设置位置
        const scale = (app.view.height / model.height) * 0.5;
        model.scale.set(scale);
        model.anchor.set(0.5, 1);

        // 设置模型的初始位置
        let modelX = app.view.width / 2;
        let modelY = app.view.height;

        model.x = modelX;
        model.y = modelY;

        app.stage.addChild(model); // 将模型添加到舞台上

        // 重置拖动窗口的位置
        const dragDiv = dragDivRef.current;
        dragDiv.style.left = `${modelX - dragDiv.offsetWidth / 2}px`;
        dragDiv.style.top = `${modelY - dragDiv.offsetHeight / 2}px`;

        // 处理拖动逻辑
        let dragging = false;
        let offsetX = 0;
        let offsetY = 0;

        // 鼠标按下事件，开始拖动
        const onMouseDown = (e) => {
          dragging = true;  // 开始拖动
          offsetX = e.clientX - model.x;  // 计算偏移
          offsetY = e.clientY - model.y;  // 计算偏移
          e.preventDefault();  // 防止默认事件
        };

        // 鼠标移动事件，更新模型的位置
        const onMouseMove = (e) => {
          if (!dragging) return;  // 如果没有处于拖动状态，跳过

          // 计算新的模型位置
          const newX = e.clientX - offsetX;  // 计算新的水平位置
          const newY = e.clientY - offsetY;  // 计算新的垂直位置

          model.x = newX;  // 更新模型的 x 坐标
          model.y = newY;  // 更新模型的 y 坐标

          // 同步更新拖动窗口的位置
          dragDiv.style.left = `${newX - dragDiv.offsetWidth / 2}px`;
          dragDiv.style.top = `${newY - dragDiv.offsetHeight / 2}px`;
        };

        // 鼠标抬起事件，停止拖动
        const onMouseUp = () => {
          dragging = false;  // 停止拖动
        };

        // 添加事件监听器
        dragDiv.addEventListener('mousedown', onMouseDown);
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);

        // 清理事件监听器
        return () => {
          dragDiv.removeEventListener('mousedown', onMouseDown);
          window.removeEventListener('mousemove', onMouseMove);
          window.removeEventListener('mouseup', onMouseUp);
        };

      } catch (err) {
        console.error('[Live2D] 初始化失败', err);
      }
    }

    loadModel(); // 加载当前选中的模型

    return () => {
      destroyed = true;
    };
  }, [currentModel]); // 每次 `currentModel` 改变时重新加载模型

  return (
    <div>
      {/* 全屏 Canvas */}
      <canvas
        ref={canvasRef}  // 绑定 canvas
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',  // 全屏宽度
          height: '100vh', // 全屏高度
          zIndex: 100,     // 层级
          pointerEvents: 'none',  // 禁止 Canvas 捕获鼠标事件
        }}
      ></canvas>

      {/* 拖动窗口，覆盖模型 */}
      <div
        ref={dragDivRef}  // 绑定拖动容器
        style={{
          position: 'fixed',
          width: '300px',
          height: '400px',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',  // 居中显示
          zIndex: 101,  // 层级高于 Canvas
          cursor: 'grab', // 鼠标样式为抓取
        }}
      ></div>

      {/* 角色切换按钮 */}
      <div style={{ position: 'fixed', left: 10, bottom: 420, zIndex: 200 }}>
        <button onClick={() => setCurrentModel((i) => (i + 1) % models.length)}>
          ✨ 切换角色
        </button>
      </div>
    </div>
  );
}