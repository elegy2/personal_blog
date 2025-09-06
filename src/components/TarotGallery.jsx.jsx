// src/components/TarotGallery.jsx
import { h } from 'preact';

const tarotCards = [
  { img: '/photos/1.jpg', modelIndex: 0 },
  { img: '/photos/2.jpg', modelIndex: 1 },
  { img: '/photos/3.jpg', modelIndex: 2 },
  { img: '/photos/4.jpg', modelIndex: 3 },
  { img: '/photos/5.jpg', modelIndex: 4 },
  { img: '/photos/6.jpg', modelIndex: 5 },
  { img: '/photos/7.jpg', modelIndex: 6 },
  { img: '/photos/8.jpg', modelIndex: 7 },
];

export default function TarotGallery({ onSelect }) {
  return (
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
          style={{
            width: '120px',
            height: '180px',
            overflow: 'hidden',
            cursor: 'pointer',
            transition: 'transform 0.25s ease, box-shadow 0.25s ease',
            borderRadius: '12px',
            boxShadow: '0 6px 16px rgba(0,0,0,0.3)',
          }}
          onClick={() => onSelect?.(card.modelIndex)}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.3)';
            e.currentTarget.style.zIndex = 999;
            e.currentTarget.style.boxShadow =
              '0 12px 32px rgba(0,0,0,0.45)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.zIndex = 101;
            e.currentTarget.style.boxShadow =
              '0 6px 16px rgba(0,0,0,0.3)';
          }}
        >
          <img
            src={card.img}
            alt="塔罗牌"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '12px',
            }}
          />
        </div>
      ))}
    </div>
  );
}
