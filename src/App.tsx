import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from 'react';

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

type Screen = 'landing' | 'select' | 'use' | 'journey' | 'deck';

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

const particles = Array.from({ length: 84 }, (_, index) => {
  const angle = (index * 137.508 * Math.PI) / 180;
  const reach = 34 + (index % 8) * 7;

  return {
    id: index,
    style: {
      '--particle-x': `${Math.cos(angle) * reach}vw`,
      '--particle-y': `${Math.sin(angle) * reach}vh`,
      '--particle-delay': `${-((index * 0.073) % 1.9)}s`,
      '--particle-duration': `${1.35 + (index % 7) * 0.12}s`,
      '--particle-size': `${1 + (index % 4) * 0.7}px`,
    } as CSSProperties,
  };
});

const deckMotes = Array.from({ length: 16 }, (_, index) => ({
  id: index,
  style: {
    left: `${7 + ((index * 37) % 88)}%`,
    top: `${8 + ((index * 53) % 82)}%`,
    '--mote-x': `${-28 + ((index * 19) % 58)}px`,
    '--mote-y': `${-34 + ((index * 23) % 70)}px`,
    '--mote-size': `${1.2 + (index % 4) * 0.75}px`,
    '--mote-blur': `${index % 5 === 0 ? 2.5 : index % 3 === 0 ? 1 : 0}px`,
    '--mote-opacity': `${0.24 + (index % 4) * 0.1}`,
    '--mote-delay': `${-(index * 1.7)}s`,
    '--mote-duration': `${13 + (index % 6) * 3}s`,
  } as CSSProperties,
}));

function cardStyle(card: Card) {
  return {
    '--card-accent': card.accent,
    '--card-soft': card.soft,
    '--card-ink': card.ink,
  } as CSSProperties;
}

function deckCardStyle(card: Card, deckTheme: Card) {
  return {
    ...cardStyle(card),
    '--card-accent': deckTheme.accent,
  } as CSSProperties;
}

function CardArtwork({ card }: { card: Card }) {
  return (
    <div className="card-art" aria-hidden="true">
      <span className="orbit-layer orbit-layer-large">
        <span className="orbit" />
        <span className="spark spark-one" />
        <span className="spark spark-three" />
      </span>
      <span className="orbit-layer orbit-layer-small">
        <span className="orbit" />
        <span className="spark spark-two" />
      </span>
      <span className="art-core">
        <span>{card.index}</span>
      </span>
    </div>
  );
}

function LandingDeck({
  card,
  onContinue,
  onExpand,
}: {
  card: Card;
  onContinue: () => void;
  onExpand: () => void;
}) {
  const [isPressing, setIsPressing] = useState(false);
  const pressTimer = useRef<number | null>(null);
  const longPressTriggered = useRef(false);

  function clearPressTimer() {
    if (pressTimer.current !== null) {
      window.clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  }

  useEffect(() => clearPressTimer, []);

  function startPress(event: ReactPointerEvent<HTMLButtonElement>) {
    if (event.pointerType === 'mouse' && event.button !== 0) return;

    clearPressTimer();
    longPressTriggered.current = false;
    setIsPressing(true);
    pressTimer.current = window.setTimeout(() => {
      pressTimer.current = null;
      longPressTriggered.current = true;
      setIsPressing(false);
      onExpand();
    }, 620);
  }

  function endPress() {
    clearPressTimer();
    setIsPressing(false);
  }

  function continueJourney() {
    if (longPressTriggered.current) {
      longPressTriggered.current = false;
      return;
    }
    onContinue();
  }

  return (
    <main className="landing-page" style={cardStyle(card)}>
      <header className="topbar landing-topbar">
        <div className="brand">
          <span className="brand-dot" aria-hidden="true" />
          <span>ARCANA</span>
        </div>
        <span className="brand-mark">今日旅程</span>
        <span className="step-label">01 / START</span>
      </header>

      <section className="landing-stage" aria-label="从启程牌开始今天的旅程">
        <div className={`landing-card-stack ${isPressing ? 'is-pressing' : ''}`}>
          {cards.slice(1).map((stackCard, index) => (
            <span
              key={stackCard.id}
              className="landing-stack-card"
              style={{
                ...cardStyle(stackCard),
                '--stack-depth': index + 1,
                zIndex: cards.length - index,
              } as CSSProperties}
              aria-hidden="true"
            >
              <span>{stackCard.index}</span>
            </span>
          ))}

          <article className="active-card landing-front-card" style={cardStyle(card)} aria-hidden="true">
            <div className="active-card-inner landing-front-inner">
              <div className="card-kicker">
                <span>{card.index}</span>
                <span>{card.subtitle}</span>
              </div>
              <CardArtwork card={card} />
              <div className="active-card-copy">
                <h1>{card.name}</h1>
                <p>{card.description}</p>
              </div>
            </div>
          </article>

          <button
            className="landing-stack-button"
            type="button"
            aria-label="点击从启程牌继续；长按展开所有卡牌"
            onClick={continueJourney}
            onPointerDown={startPress}
            onPointerUp={endPress}
            onPointerCancel={endPress}
            onPointerLeave={endPress}
            onContextMenu={(event) => event.preventDefault()}
          />
        </div>

        <button className="landing-hint" type="button" onClick={onContinue}>
          点击继续
        </button>
      </section>
    </main>
  );
}

function Journey({ card, onComplete }: { card: Card; onComplete: () => void }) {
  const [phase, setPhase] = useState<'words' | 'lights'>('words');
  const needsEntering = card.id === 'courage' || card.id === 'new-moon';

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lightTimer = window.setTimeout(() => setPhase('lights'), reduceMotion ? 350 : 2200);
    const completeTimer = window.setTimeout(onComplete, reduceMotion ? 900 : 5700);

    return () => {
      window.clearTimeout(lightTimer);
      window.clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <main className={`journey-page journey-${phase}`} style={cardStyle(card)}>
      <div className="journey-ambient" aria-hidden="true" />

      <section className="journey-words" aria-live="polite">
        <p>
          现在，我们一起{needsEntering ? '进入' : ''}
          <strong>【{card.name}】</strong>
        </p>
      </section>

      <div className="light-tunnel" aria-hidden="true">
        <span className="tunnel-ring tunnel-ring-one" />
        <span className="tunnel-ring tunnel-ring-two" />
        <span className="tunnel-ring tunnel-ring-three" />
        <span className="tunnel-core" />
        {particles.map((particle) => (
          <span key={particle.id} className="light-particle" style={particle.style} />
        ))}
      </div>

      <button className="skip-journey" type="button" onClick={onComplete}>
        跳过动画 <span aria-hidden="true">→</span>
      </button>
    </main>
  );
}

function Deck({ card, onReturn }: { card: Card; onReturn: () => void }) {
  const initialIndex = Math.max(cards.findIndex((item) => item.id === card.id), 0);
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [cardMotion, setCardMotion] = useState(0);
  const [actionNote, setActionNote] = useState('');
  const activeCard = cards[activeIndex];

  function showCard(nextIndex: number, note: string) {
    setActiveIndex(nextIndex);
    setCardMotion((value) => value + 1);
    setActionNote(note);
  }

  function exchangeCard() {
    const nextIndex = (activeIndex + 2 + (cardMotion % 2)) % cards.length;
    showCard(nextIndex, '已为你换上一张不同的牌');
  }

  function skipCard() {
    showCard((activeIndex + 1) % cards.length, '已跳过，旅程继续');
  }

  function nextCard() {
    showCard((activeIndex + 1) % cards.length, '已进入下一张牌');
  }

  return (
    <main className="deck-page" style={cardStyle(card)}>
      <div className="deck-atmosphere" aria-hidden="true">
        <span className="deck-ambient-glow" />
        {deckMotes.map((mote) => (
          <span key={mote.id} className="deck-mote" style={mote.style} />
        ))}
      </div>

      <header className="topbar deck-topbar">
        <div className="brand">
          <span className="brand-dot" aria-hidden="true" />
          <span>ARCANA</span>
        </div>
        <span className="brand-mark">今日旅程</span>
        <span className="step-label">{String(activeIndex + 1).padStart(2, '0')} / 05</span>
      </header>

      <section className="deck-stage" aria-label={`${card.name}卡组，当前卡牌为${activeCard.name}`}>
        <article className="deck-reading-card" key={cardMotion} style={deckCardStyle(activeCard, card)}>
          <div className="deck-reading-inner">
            <div className="card-kicker">
              <span>{activeCard.index}</span>
              <span>{activeCard.subtitle}</span>
            </div>
            <CardArtwork card={activeCard} />
            <div className="active-card-copy">
              <h1>{activeCard.name}</h1>
              <p>{activeCard.description}</p>
            </div>
          </div>
        </article>

        <aside className="deck-actions">
          <div className="deck-guidance">
            <span className="eyebrow">{card.name} · CARD DECK</span>
            <h2>和这张牌<br />停留一会儿</h2>
            <p>读完此刻的提示后，再决定要继续、跳过，还是换一张牌。</p>
          </div>

          <button className="deck-exchange-button" type="button" onClick={exchangeCard}>
            <span aria-hidden="true">↻</span> 换一张牌
          </button>

          <div className="deck-progress" aria-hidden="true">
            {cards.map((item, index) => (
              <span key={item.id} className={index === activeIndex ? 'is-current' : ''} />
            ))}
          </div>

          <div className="deck-forward-actions">
            <button className="deck-next-button" type="button" onClick={nextCard}>
              下一步 <span aria-hidden="true">→</span>
            </button>
            <button className="deck-skip-button" type="button" onClick={skipCard}>
              跳过这张牌
            </button>
          </div>

          <p className="deck-action-note" aria-live="polite">{actionNote || '\u00a0'}</p>
        </aside>
      </section>

      <footer className="deck-footer">
        <button type="button" onClick={onReturn}>结束今天的旅程</button>
      </footer>
    </main>
  );
}

export default function App() {
  const [selectedId, setSelectedId] = useState(cards[0].id);
  const [screen, setScreen] = useState<Screen>('landing');
  const [used, setUsed] = useState(false);
  const activationTimer = useRef<number | null>(null);

  const selectedCard = cards.find((card) => card.id === selectedId) ?? cards[0];

  useEffect(() => {
    return () => {
      if (activationTimer.current !== null) {
        window.clearTimeout(activationTimer.current);
      }
    };
  }, []);

  function openCard() {
    setUsed(false);
    setScreen('use');
  }

  function startFromBeginning() {
    setSelectedId(cards[0].id);
    openCard();
  }

  function returnToCards() {
    if (activationTimer.current !== null) {
      window.clearTimeout(activationTimer.current);
      activationTimer.current = null;
    }
    setUsed(false);
    setScreen('select');
  }

  function activateCard() {
    if (used) return;

    setUsed(true);
    activationTimer.current = window.setTimeout(() => {
      activationTimer.current = null;
      setScreen('journey');
    }, 900);
  }

  if (screen === 'journey') {
    return <Journey card={selectedCard} onComplete={() => setScreen('deck')} />;
  }

  if (screen === 'deck') {
    return <Deck card={selectedCard} onReturn={returnToCards} />;
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
                ? '正在为你开启这组卡牌……'
                : '确认后，这张卡牌将带你进入对应的五张卡牌卡组。'}
            </p>
            <button
              className="primary-button use-button"
              type="button"
              onClick={activateCard}
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

  if (screen === 'landing') {
    return (
      <LandingDeck
        card={cards[0]}
        onContinue={startFromBeginning}
        onExpand={() => setScreen('select')}
      />
    );
  }

  return (
    <main className="select-page">
      <header className="topbar">
        <div className="brand">
          <span className="brand-dot" aria-hidden="true" />
          <span>ARCANA</span>
        </div>
        <p>你可以从任意一个节点进入旅程</p>
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
