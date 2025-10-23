// src/components/TarotCardDrawer.jsx
import { h } from 'preact';
import { useState } from 'preact/hooks';
import tarotCardsData from '../data/tarotCards.json';

export default function TarotGallery() {
  const [drawnCards, setDrawnCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [showReplay, setShowReplay] = useState(false);
  const [animating, setAnimating] = useState(false);

  const [question, setQuestion] = useState("");
  const [history, setHistory] = useState([]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const drawThreeCards = () => {
    if (!question.trim()) {
      alert("请先输入一个问题");
      return;
    }

    const shuffled = [...tarotCardsData].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 3).map(card => ({
      ...card,
      isReversed: Math.random() < 0.5
    }));

    setDrawnCards([]);
    setFlipped([false, false, false]);
    setShowReplay(false);
    setAnimating(true);

    selected.forEach((card, idx) => {
      setTimeout(() => {
        setDrawnCards(prev => {
          const next = [...prev];
          next[idx] = card;
          return next;
        });
      }, idx * 400);
    });

    setTimeout(() => {
      setAnimating(false);
      const newRecord = {
        question,
        cards: selected,
        time: new Date().toLocaleString()
      };
      setHistory(prev => [newRecord, ...prev].slice(0, 10));
      setQuestion("");
    }, 3 * 400);
  };

  const handleFlip = index => {
    if (animating) return;
    const newFlipped = [...flipped];
    newFlipped[index] = true;
    setFlipped(newFlipped);
    if (newFlipped.every(v => v)) setShowReplay(true);
  };

  const handleViewHistory = record => {
    setDrawnCards(record.cards);
    setFlipped([true, true, true]);
    setShowReplay(false);
    setShowHistoryModal(false);
  };

  return (
    <div className="tarot-gallery">
      {/* 输入问题 */}
      <div className="question-box">
        <input
          type="text"
          value={question}
          placeholder="请输入你要占卜的问题"
          onInput={e => setQuestion(e.target.value)}
        />
        {!drawnCards.length && (
          <button onClick={drawThreeCards}>抽卡</button>
        )}
        {history.length > 0 && (
          <button onClick={() => setShowHistoryModal(true)}>查看历史</button>
        )}
      </div>

      {/* 展示牌阵 */}
      <div className="tarot-grid">
        {drawnCards.map((card, idx) => (
          <div
            key={idx}
            className={`card ${flipped[idx] ? 'flipped' : ''}`}
            onClick={() => handleFlip(idx)}
          >
            <div className="card-inner">
              <div className="card-back">
                <span>点击翻牌</span>
              </div>
              <div className="card-front">
                <div className={`tarot-img-wrapper ${card.isReversed ? 'reversed' : ''}`}>
                  <img src={card.image} alt={card.name} className="tarot-img" />
                </div>
                <h3>{card.name} ({card.isReversed ? '逆位' : '正位'})</h3>
                <p>{card.isReversed ? card.reversed : card.upright}</p>
                <p className="position-label">{['过去','现在','未来'][idx]}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showReplay && <button onClick={drawThreeCards}>再来一次</button>}

      {/* 历史弹窗 */}
      {showHistoryModal && (
        <div className="modal-overlay" onClick={() => setShowHistoryModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>历史问题记录（最近 10 条）</h3>
            <table>
              <thead>
                <tr>
                  <th>问题</th>
                  <th>时间</th>
                  <th>牌阵</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {history.map((record, idx) => (
                  <tr key={idx}>
                    <td className="table-text">{record.question}</td>
                    <td className="table-text">{record.time}</td>
                    <td className="table-text">
                      {record.cards.map(c => (
                        <span key={c.name}>
                          {c.name} ({c.isReversed ? '逆位' : '正位'}){' '}
                        </span>
                      ))}
                    </td>
                    <td><button onClick={() => handleViewHistory(record)}>回看</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button className="close-btn" onClick={() => setShowHistoryModal(false)}>关闭</button>
          </div>
        </div>
      )}

      <style>
        {`
.tarot-gallery {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem; /* ↓ 减小整体模块间距 */
  padding: 0.5rem;
  box-sizing: border-box;
}

.question-box {
  display: flex;
  gap: 0.5rem; /* ↓ 按钮与输入框更紧凑 */
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
  max-width: 600px;
}

input {
  flex: 1;
  min-width: 200px;
  padding: 0.45rem 0.6rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 0.95rem;
}

button {
  padding: 0.45rem 0.9rem;
  border: none;
  border-radius: 6px;
  background-color: #e67e22;
  color: #fff;
  cursor: pointer;
  font-size: 0.95rem;
  transition: background-color 0.2s ease;
}

button:hover {
  background-color: #d35400;
}

/* 卡片区 */
.tarot-grid {
  display: flex;
  gap: 1rem; /* ↓ 缩小卡片间距 */
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
}

/* 单张卡片 */
.card {
  width: 230px;
  height: 440px;
  perspective: 1000px;
  cursor: pointer;
  transition: transform 0.25s ease;
}

.card:hover {
  transform: scale(1.02);
}

.card-inner {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.6s;
}

.card.flipped .card-inner {
  transform: rotateY(180deg);
}

.card-front, .card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 10px;
  backface-visibility: hidden;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 0.4rem; /* ↓ 减小卡片内留白 */
  box-shadow: 0 3px 10px rgba(0,0,0,0.25);
  text-align: center;
  box-sizing: border-box;
}

.card-back {
  background: #2c3e50;
  color: #fff;
  justify-content: center;
}

.card-front {
  background: #fef9f0;
  transform: rotateY(180deg);
  color: #333;
}

/* 图片与文字比例优化 */
.tarot-img-wrapper {
  width: 100%;
  height: 75%; /* ↑ 增大图片所占空间 */
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  border-radius: 8px;
  margin-bottom: 0.4rem;
}

.tarot-img-wrapper.reversed {
  transform: rotate(180deg);
}

.tarot-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

.card-front h3 {
  font-size: 1rem;
  margin: 0.25rem 0;
}

.card-front p {
  font-size: 0.8rem;
  margin: 0.25rem 0;
  line-height: 1.25;
}

.position-label {
  margin-top: 0.3rem;
  font-weight: bold;
  color: #e67e22;
}

/* 弹窗 */
.modal-overlay {
  position: fixed;
  top:0; left:0; right:0; bottom:0;
  background: rgba(0,0,0,0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: #fff;
  padding: 0.8rem;
  border-radius: 8px;
  max-width: 700px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 0.8rem;
}

th, td {
  border: 1px solid #ccc;
  padding: 0.4rem;
  text-align: left;
  color: #2c3e50;
}

.close-btn {
  margin-top: 0.8rem;
  background-color: #888;
}
.close-btn:hover {
  background-color: #555;
}

/* ✅ 响应式适配 */
@media (max-width: 1024px) {
  .tarot-grid {
    gap: 0.8rem;
  }
  .card {
    width: 210px;
    height: 410px;
  }
}

@media (max-width: 768px) {
  .tarot-grid {
    flex-direction: column;
    align-items: center;
    gap: 0.8rem;
  }
  .card {
    width: 80%;
    max-width: 280px;
    height: 400px;
  }
}

@media (max-width: 480px) {
  .card {
    width: 90%;
    height: 360px;
  }
  .card-front h3 {
    font-size: 0.95rem;
  }
  .card-front p {
    font-size: 0.78rem;
  }
  button {
    font-size: 0.85rem;
    padding: 0.4rem 0.7rem;
  }
}

        `}
      </style>
    </div>
  );
}


