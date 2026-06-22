// src/components/TarotGallery.jsx
import { h } from 'preact';
import { useState } from 'preact/hooks';

const tarotCards = [
  { img: '/photos/1.jpg', back: '/photos/card_back1.jpg', modelIndex: 0, name: '椿' },
  { img: '/photos/2.jpg', back: '/photos/card_back2.jpg', modelIndex: 1, name: '秧秧' },
  { img: '/photos/3.jpg', back: '/photos/card_back3.jpg', modelIndex: 2, name: 'Kafuka' },
  { img: '/photos/4.jpg', back: '/photos/card_back4.jpg', modelIndex: 3, name: '符玄' },
  { img: '/photos/5.jpg', back: '/photos/card_back5.jpg', modelIndex: 4, name: 'Nicole' },
  { img: '/photos/6.jpg', back: '/photos/card_back6.jpg', modelIndex: 5, name: '藿藿' },
  { img: '/photos/7.jpg', back: '/photos/card_back7.jpg', modelIndex: 6, name: '简' },
  { img: '/photos/8.jpg', back: '/photos/card_back8.jpg', modelIndex: 7, name: '知更鸟' },
];

export default function TarotGallery({ onSelect }) {
  const [activeCard, setActiveCard] = useState(null);
  const [closing, setClosing] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);

  const handleClick = (card) => {
    setActiveCard(card);
    setClosing(false);
    onSelect?.(card.modelIndex);
  };

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => setActiveCard(null), 400);
  };

  return (
    <div className="tarot-gallery">
      <div className="tarot-grid">
        {tarotCards.map((card) => (
          <div
            key={card.modelIndex}
            className={`card ${hoveredCard === card.modelIndex ? 'hovered' : ''}`}
            onClick={() => handleClick(card)}
            onMouseEnter={() => setHoveredCard(card.modelIndex)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="card-inner">
              <div className="card-front">
                <img className="card-img" src={card.back} alt="塔罗牌" />
                <div className="card-glow"></div>
              </div>
              <div className="card-back-face">
                <img className="card-img" src={card.img} alt={card.name} />
                <div className="card-name">{card.name}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {activeCard && (
        <div className="overlay" onClick={handleClose}>
          <div className={`enlarged-card ${closing ? 'closing' : ''}`} onClick={(e) => e.stopPropagation()}>
            <img src={activeCard.img} alt={activeCard.name} />
            <div className="card-info">
              <h3>{activeCard.name}</h3>
              <p>点击卡片外任意位置关闭</p>
            </div>
            <button className="close-btn" onClick={handleClose}>✕</button>
          </div>
        </div>
      )}

      <style>
        {`
          .tarot-gallery {
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 2rem 0;
          }

          .tarot-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
            gap: clamp(24px, 4vw, 48px);
            justify-items: center;
            width: 100%;
            max-width: 1200px;
            padding: 1rem;
            box-sizing: border-box;
          }

          @media (min-width: 768px) {
            .tarot-grid {
              grid-template-columns: repeat(4, 1fr);
            }
          }

          .card {
            position: relative;
            width: 100%;
            max-width: 180px;
            aspect-ratio: 2 / 3;
            perspective: 1200px;
            cursor: pointer;
            transition: transform 0.3s ease;
          }

          .card:hover {
            transform: translateY(-10px);
          }

          .card-inner {
            position: relative;
            width: 100%;
            height: 100%;
            transform-style: preserve-3d;
            transition: transform 0.6s cubic-bezier(0.4, 0.0, 0.2, 1);
          }

          .card.hovered .card-inner {
            transform: rotateY(180deg);
          }

          .card-front,
          .card-back-face {
            position: absolute;
            width: 100%;
            height: 100%;
            backface-visibility: hidden;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          }

          .card-front {
            z-index: 2;
          }

          .card-back-face {
            transform: rotateY(180deg);
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }

          .card-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
          }

          .card-glow {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: radial-gradient(
              circle at center,
              rgba(255, 255, 255, 0.3) 0%,
              transparent 70%
            );
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
          }

          .card:hover .card-glow {
            opacity: 1;
          }

          .card-name {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 12px;
            background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
            color: white;
            text-align: center;
            font-weight: 600;
            font-size: 16px;
            letter-spacing: 1px;
          }

          .overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.85);
            backdrop-filter: blur(8px);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            animation: fadeIn 0.3s ease;
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          .enlarged-card {
            position: relative;
            width: 90%;
            max-width: 400px;
            background: white;
            border-radius: 24px;
            overflow: hidden;
            box-shadow: 0 24px 64px rgba(0, 0, 0, 0.5);
            animation: zoomIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
          }

          .enlarged-card img {
            width: 100%;
            height: auto;
            display: block;
          }

          .card-info {
            padding: 24px;
            text-align: center;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
          }

          .card-info h3 {
            margin: 0 0 8px 0;
            font-size: 24px;
            font-weight: 700;
          }

          .card-info p {
            margin: 0;
            font-size: 14px;
            opacity: 0.9;
          }

          .close-btn {
            position: absolute;
            top: 16px;
            right: 16px;
            width: 36px;
            height: 36px;
            border: none;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.9);
            color: #333;
            font-size: 20px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          }

          .close-btn:hover {
            background: white;
            transform: rotate(90deg);
          }

          .enlarged-card.closing {
            animation: zoomOut 0.4s ease forwards;
          }

          @keyframes zoomIn {
            from {
              opacity: 0;
              transform: scale(0.7) translateY(30px);
            }
            to {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }

          @keyframes zoomOut {
            from {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
            to {
              opacity: 0;
              transform: scale(0.7) translateY(30px);
            }
          }

          @media (max-width: 768px) {
            .tarot-grid {
              grid-template-columns: repeat(2, 1fr);
              gap: 16px;
            }

            .enlarged-card {
              max-width: 340px;
            }

            .card-info h3 {
              font-size: 20px;
            }
          }
        `}
      </style>
    </div>
  );
}
