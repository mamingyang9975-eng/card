import { useState, type CSSProperties } from 'react';

type Card = {
  id: string;
  index: string;
  name: string;
  subtitle: string;
  description: string;
  accent: string;
  soft: string;
  ink: string;
};

const cards: Card[] = [
  {
    id: 'begin',
    index: '01',
    name: '启程',
    subtitle: 'THE BEGINNING',
    description: '向未知迈出一步。',
    accent: '#f0b84b',
    soft: '#fff3d8',
    ink: '#5f4000',
  },
  {
    id: 'insight',
    index: '02',
    name: '洞察',
    subtitle: 'THE INSIGHT',
    description: '看见尚未显露的线索。',
    accent: '#8c79dc',
    soft: '#eeeaff',
    ink: '#3d2c7a',
  },
  {
    id: 'courage',
    index: '03',
    name: '勇气',
    subtitle: 'THE COURAGE',
    description: '在犹疑中仍然向前。',
    accent: '#e77962',
    soft: '#ffebe6',
    ink: '#72291b',
  },
  {
    id: 'balance',
    index: '04',
    name: '平衡',
    subtitle: 'THE BALANCE',
    description: '让失序重新归于平静。',
    accent: '#64aa8e',
    soft: '#e4f5ee',
    ink: '#1f5946',
  },
  {
    id: 'new-moon',
    index: '05',
    name: '新月',
    subtitle: 'THE NEW MOON',
    description: '为即将发生的变化留白。',
    accent: '#5f8fc5',
    soft: '#e6f1fb',
    ink: '#214c79',
  },
];

function cardStyle(card: Card) {
  return {
    '--card-accent': card.accent,
    '--card-soft': card.soft,
    '--card-ink': card.ink,
  } as CSSProperties;
}

function CardArtwork({ card }: { card: Card }) {
  return (
    <div className="card-art" aria-hidden="true">
      <span className="orbit orbit-large" />
      <span className="orbit orbit-small" />
      <span className="art-core">
        <span>{card.index}</span>
      </span>
      <span className="spark spark-one" />
      <span className="spark spark-two" />
      <span className="spark spark-three" />
    </div>
  );
}

export default function App() {
  const [selectedId, setSelectedId] = useState(cards[0].id);
  const [screen, setScreen] = useState<'select' | 'use'>('select');
  const [used, setUsed] = useState(false);

  const selectedCard = cards.find((card) => card.id === selectedId) ?? cards[0];

  function openCard() {
    setUsed(false);
    setScreen('use');
  }

  function returnToCards() {
    setUsed(false);
    setScreen('select');
  }

  if (screen === 'use') {
    return (
      <main className="use-page" style={cardStyle(selectedCard)}>
        <header className="topbar use-topbar">
          <button className="text-button" type="button" onClick={returnToCards}>
            <span aria-hidden="true">←</span> 返回选择
          </button>
          <span className="brand-mark">ARC / 05</span>
          <span className="step-label">02 / USE</span>
        </header>

        <section className="use-stage" aria-live="polite">
          <div className={`active-card ${used ? 'is-used' : ''}`}>
            <div className="active-card-inner">
              <div className="card-kicker">
                <span>{selectedCard.index}</span>
                <span>{selectedCard.subtitle}</span>
              </div>
              <CardArtwork card={selectedCard} />
              <div className="active-card-copy">
                <h1>{selectedCard.name}</h1>
                <p>{selectedCard.description}</p>
              </div>
            </div>
          </div>

          <div className="use-copy">
            <span className="eyebrow">当前卡牌</span>
            <h2>{used ? '卡牌已生效' : `准备使用「${selectedCard.name}」`}</h2>
            <p>
              {used
                ? selectedCard.description
                : '确认后将触发这张卡牌。本原型暂不记录使用结果。'}
            </p>
            <button
              className="primary-button use-button"
              type="button"
              onClick={() => setUsed(true)}
              disabled={used}
            >
              {used ? '已使用' : '使用这张卡牌'}
              {!used && <span aria-hidden="true">↗</span>}
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="select-page">
      <header className="topbar">
        <div className="brand">
          <span className="brand-dot" aria-hidden="true" />
          <span>ARCANA</span>
        </div>
        <p>选择一张与你当下最接近的卡牌</p>
        <span className="step-label">01 / SELECT</span>
      </header>

      <section className="selection-intro">
        <span className="eyebrow">五张卡牌</span>
        <h1>此刻，你需要什么？</h1>
      </section>

      <section className="card-grid" aria-label="可选择的卡牌">
        {cards.map((card) => {
          const selected = card.id === selectedId;

          return (
            <button
              key={card.id}
              className={`choice-card ${selected ? 'is-selected' : ''}`}
              style={cardStyle(card)}
              type="button"
              aria-pressed={selected}
              onClick={() => setSelectedId(card.id)}
              onDoubleClick={openCard}
            >
              <span className="card-kicker">
                <span>{card.index}</span>
                <span>{card.subtitle}</span>
              </span>
              <CardArtwork card={card} />
              <span className="choice-card-copy">
                <strong>{card.name}</strong>
                <span>{card.description}</span>
              </span>
              <span className="selection-check" aria-hidden="true">✓</span>
            </button>
          );
        })}
      </section>

      <footer className="selection-footer">
        <div className="selected-summary">
          <span>当前选择</span>
          <strong>{selectedCard.name}</strong>
          <span className="summary-description">{selectedCard.description}</span>
        </div>
        <button className="primary-button" type="button" onClick={openCard}>
          进入卡牌 <span aria-hidden="true">→</span>
        </button>
      </footer>
    </main>
  );
}
