// src/components/TarotGallery.jsx
import { h } from 'preact';

const tarotCards = [
  { img: '/photos/1.jpg', back: '/photos/back.png', modelIndex: 0 },
  { img: '/photos/2.jpg', back: '/photos/back.png', modelIndex: 1 },
  { img: '/photos/3.jpg', back: '/photos/back.png', modelIndex: 2 },
  { img: '/photos/4.jpg', back: '/photos/back.png', modelIndex: 3 },
  { img: '/photos/5.jpg', back: '/photos/back.png', modelIndex: 4 },
  { img: '/photos/6.jpg', back: '/photos/back.png', modelIndex: 5 },
  { img: '/photos/7.jpg', back: '/photos/back.png', modelIndex: 6 },
  { img: '/photos/8.jpg', back: '/photos/back.png', modelIndex: 7 },
];

export default function TarotGallery({ onSelect }) {
  return (
    <div>
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 101,
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '24px',
          justifyItems: 'center',
          alignItems: 'center',
        }}
      >
        {tarotCards.map((card) => (
          <div
            key={card.modelIndex}
            className="card"
            onClick={() => onSelect?.(card.modelIndex)}
          >
            <img className="card_img" src={card.back} alt="塔罗牌" />
            <img className="card_back" src={card.img} alt="塔罗牌背面" />
          </div>
        ))}
      </div>

      {/* 内联 CSS 翻转效果 */}
      <style>
        {`
          .card {
            position: relative;
            width: 120px;
            height: 180px;
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
        `}
      </style>
    </div>
  );
}
