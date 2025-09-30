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
          gap: 1.5rem;
        }
        .question-box {
          display: flex;
          gap: 1rem;
        }
        input {
          padding: 0.5rem;
          border-radius: 6px;
          border: 1px solid #ccc;
        }
        button {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 6px;
          background-color: #e67e22;
          color: #fff;
          cursor: pointer;
        }
        button:hover { background-color: #d35400; }
        .tarot-grid {
          display: flex;
          gap: 2rem;
        }
        .card {
          width: 150px;
          height: 220px;
          perspective: 1000px;
          cursor: pointer;
        }
        .card-inner {
          width: 100%;
          height: 100%;
          position: relative;
          transform-style: preserve-3d;
          transition: transform 0.6s;
        }
        .card.flipped .card-inner { transform: rotateY(180deg); }
        .card-front, .card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 12px;
          backface-visibility: hidden;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 0.5rem;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          text-align: center;
        }
        .card-back { background: #2c3e50; color: #fff; }
        .card-front { background: #fef9f0; transform: rotateY(180deg); color: #333; }
        .position-label { margin-top: 0.5rem; font-weight: bold; color: #e67e22; }

        /* 弹窗 */
        .modal-overlay {
          position: fixed;
          top:0; left:0; right:0; bottom:0;
          background: rgba(0,0,0,0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        .modal {
          background: #fff;
          padding: 1rem;
          border-radius: 8px;
          max-width: 700px;
          width: 90%;
          max-height: 80vh;
          overflow-y: auto;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 1rem;
        }
        th, td {
          border: 1px solid #ccc;
          padding: 0.5rem;
          text-align: left;
          color: #2c3e50; /* 设置表头和单元格文字颜色 */
        }
          
        .table-text {
          color: #2c3e50; /* 修改文字颜色为深蓝色，更好阅读 */
        }
        .close-btn {
          margin-top: 1rem;
          background-color: #888;
        }
        .close-btn:hover { background-color: #555; }
        `}
      </style>
    </div>
  );
}


