// src/components/CharacterShowcase.jsx
// 统一展示组件：卡片选择 + Live2D 查看器共享状态，点击卡片可靠切换模型
import { h } from 'preact';
import { useState } from 'preact/hooks';
import Live2DViewer from './Live2DViewer.jsx';

const characters = [
  { img: '/photos/1.jpg', modelIndex: 0, name: '椿' },
  { img: '/photos/2.jpg', modelIndex: 1, name: '秧秧' },
  { img: '/photos/3.jpg', modelIndex: 2, name: 'Kafuka' },
  { img: '/photos/4.jpg', modelIndex: 3, name: '符玄' },
  { img: '/photos/5.jpg', modelIndex: 4, name: 'Nicole' },
  { img: '/photos/6.jpg', modelIndex: 5, name: '藿藿' },
  { img: '/photos/7.jpg', modelIndex: 6, name: '简' },
  { img: '/photos/8.jpg', modelIndex: 7, name: '知更鸟' },
];

export default function CharacterShowcase() {
  const [selected, setSelected] = useState(0);

  return (
    <div className="showcase">
      {/* 左侧：角色卡片选择 */}
      <div className="card-panel">
        <h3 className="panel-title">选择角色</h3>
        <div className="card-grid">
          {characters.map((char) => (
            <button
              key={char.modelIndex}
              className={`char-card ${selected === char.modelIndex ? 'active' : ''}`}
              onClick={() => setSelected(char.modelIndex)}
            >
              <div className="card-img-wrap">
                <img src={char.img} alt={char.name} loading="lazy" />
                {selected === char.modelIndex && (
                  <div className="active-badge">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                )}
              </div>
              <span className="char-name">{char.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 右侧：Live2D 查看器 */}
      <div className="viewer-panel">
        <Live2DViewer modelIndex={selected} modelName={characters[selected].name} />
      </div>

      <style jsx>{`
        .showcase {
          display: grid;
          grid-template-columns: 1fr 660px;
          gap: 2.5rem;
          align-items: start;
        }

        .card-panel {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(12px);
          border-radius: 24px;
          padding: 1.5rem;
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }

        .panel-title {
          margin: 0 0 1.25rem 0;
          font-size: 20px;
          font-weight: 800;
          color: #2d3748;
        }

        .card-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }

        .char-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 8px;
          border: 2px solid transparent;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.5);
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .char-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.2);
        }

        .char-card.active {
          border-color: #667eea;
          background: linear-gradient(135deg, rgba(102,126,234,0.15), rgba(118,75,162,0.1));
          box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
        }

        .card-img-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 2 / 3;
          border-radius: 12px;
          overflow: hidden;
        }

        .card-img-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.3s ease;
        }

        .char-card:hover .card-img-wrap img {
          transform: scale(1.08);
        }

        .active-badge {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 28px;
          height: 28px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
          animation: pop 0.3s ease;
        }

        @keyframes pop {
          0% { transform: scale(0); }
          70% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }

        .char-name {
          font-size: 14px;
          font-weight: 600;
          color: #4a5568;
        }

        .char-card.active .char-name {
          color: #667eea;
          font-weight: 700;
        }

        .viewer-panel {
          position: sticky;
          top: 2rem;
        }

        /* 夜间模式 */
        html.dark .card-panel {
          background: rgba(30, 30, 30, 0.7);
          border-color: rgba(255, 255, 255, 0.1);
        }

        html.dark .panel-title {
          color: #e2e8f0;
        }

        html.dark .char-card {
          background: rgba(50, 50, 50, 0.5);
        }

        html.dark .char-name {
          color: #cbd5e0;
        }

        html.dark .char-card.active .char-name {
          color: #9f7aea;
        }

        /* 响应式 */
        @media (max-width: 1200px) {
          .showcase {
            grid-template-columns: 1fr;
          }

          .viewer-panel {
            position: static;
            order: -1;
          }

          .card-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        @media (max-width: 768px) {
          .card-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  );
}
