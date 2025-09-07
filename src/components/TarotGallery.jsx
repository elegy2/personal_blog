// src/components/TarotGallery.jsx
import { h } from 'preact';
import { useState } from 'preact/hooks';

const tarotCards = [
  { img: '/photos/1.jpg', back: '/photos/card_back1.jpg', modelIndex: 0 },
  { img: '/photos/2.jpg', back: '/photos/card_back2.jpg', modelIndex: 1 },
  { img: '/photos/3.jpg', back: '/photos/card_back3.jpg', modelIndex: 2 },
  { img: '/photos/4.jpg', back: '/photos/card_back4.jpg', modelIndex: 3 },
  { img: '/photos/5.jpg', back: '/photos/card_back5.jpg', modelIndex: 4 },
  { img: '/photos/6.jpg', back: '/photos/card_back6.jpg', modelIndex: 5 },
  { img: '/photos/7.jpg', back: '/photos/card_back7.jpg', modelIndex: 6 },
  { img: '/photos/8.jpg', back: '/photos/card_back8.jpg', modelIndex: 7 },
];

export default function TarotGallery({ onSelect }) {
  const [activeCard, setActiveCard] = useState(null); // 当前点击的卡牌
  const [closing, setClosing] = useState(false); // 控制关闭时的动画状态

  // 点击卡牌时触发：展示放大效果
  const handleClick = (card) => {
    setActiveCard(card);
    setClosing(false); // 确保重新打开时不是关闭状态
    onSelect?.(card.modelIndex);
  };

  // 点击关闭时触发：先执行动画，再移除卡牌
  const handleClose = () => {
    setClosing(true); // 添加 closing class，触发 zoomOut 动画
    setTimeout(() => setActiveCard(null), 400); // 等待动画完成再清除
  };

  return (
    <div className="tarot-gallery">
      {/* 卡牌网格 */}
      <div className="tarot-grid">
        {tarotCards.map((card) => (
          <div
            key={card.modelIndex}
            className="card"
            onClick={() => handleClick(card)}
          >
            <img className="card_img" src={card.back} alt="塔罗牌" />
            <img className="card_back" src={card.img} alt="塔罗牌背面" />
          </div>
        ))}
      </div>

      {/* 点击后放大展示 */}
      {activeCard && (
        <div className="overlay" onClick={handleClose}>
          <img
            src={activeCard.img}
            alt="放大卡牌"
            className={`enlarged-card ${closing ? 'closing' : ''}`}
          />
        </div>
      )}

      {/* CSS */}
      <style>
        {`
          .tarot-gallery {
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .tarot-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 140px;
            justify-items: center;
            align-items: center;
          }

          .card {
            position: relative;
            width: 200px;
            height: 300px;
            perspective: 1000px;
            cursor: pointer;
          }
          .card_img, .card_back {
            position: absolute;
            width: 100%;
            height: 100%;
            border-radius: 12px;
            backface-visibility: hidden;
            transition: transform 0.5s ease, box-shadow 0.5s ease;
          }
          .card_img {
            z-index: 2;
            transform: rotateY(0deg);
          }
          .card_back {
            transform: rotateY(180deg);
          }
          .card:hover .card_img {
            transform: rotateY(180deg);
            box-shadow: 0 12px 32px rgba(0,0,0,0.45);
          }
          .card:hover .card_back {
            transform: rotateY(0deg);
            box-shadow: 0 12px 32px rgba(0,0,0,0.45);
          }

          .overlay {
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.6);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 200;
          }

          .enlarged-card {
            width: 300px;
            height: 450px;
            border-radius: 16px;
            box-shadow: 0 16px 40px rgba(0,0,0,0.6);
            animation: zoomIn 0.4s ease forwards;
          }

          /* 关闭时触发的缩小消失动画 */
          .enlarged-card.closing {
            animation: zoomOut 0.4s ease forwards;
          }

          @keyframes zoomIn {
            from { opacity: 0; transform: scale(0.6); }
            to { opacity: 1; transform: scale(1); }
          }
          @keyframes zoomOut {
            from { opacity: 1; transform: scale(1); }
            to { opacity: 0; transform: scale(0.6); }
          }
        `}
      </style>
    </div>
  );
}
