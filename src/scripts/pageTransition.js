// src/scripts/pageTransition.js
export function initPageTransitions() {
  // 创建翻页动画容器
  const transitionOverlay = document.createElement('div');
  transitionOverlay.className = 'page-transition-overlay';
  transitionOverlay.innerHTML = `
    <div class="page-left"></div>
    <div class="page-right"></div>
  `;
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

      // 触发翻页动画
      transitionOverlay.classList.add('active');

      // 等待动画完成后跳转
      setTimeout(() => {
        window.location.href = link.href;
      }, 600);
    }
  });

  // 页面加载后的进入动画
  window.addEventListener('load', () => {
    transitionOverlay.classList.add('page-enter');
    setTimeout(() => {
      transitionOverlay.classList.remove('page-enter');
    }, 800);
  });
}

// 自动初始化
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', initPageTransitions);
}
