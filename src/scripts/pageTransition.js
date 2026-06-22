// src/scripts/pageTransition.js
export function initPageTransitions() {
  // 创建滑动动画容器
  const transitionOverlay = document.createElement('div');
  transitionOverlay.className = 'page-transition-slide';
  document.body.appendChild(transitionOverlay);

  // 拦截所有链接点击
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');

    if (link && link.href &&
        link.href.startsWith(window.location.origin) &&
        !link.hasAttribute('target') &&
        !link.hasAttribute('download') &&
        !link.classList.contains('skip-transition')) {

      e.preventDefault();

      // 触发滑出动画
      document.body.classList.add('page-transitioning');
      transitionOverlay.classList.add('slide-out');

      // 等待动画完成后跳转
      setTimeout(() => {
        window.location.href = link.href;
      }, 400);
    }
  });

  // 页面加载后的进入动画
  window.addEventListener('load', () => {
    document.body.classList.add('page-enter');
    setTimeout(() => {
      document.body.classList.remove('page-enter');
    }, 500);
  });
}

// 自动初始化
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', initPageTransitions);
}
