import {
  useEffect,
  useLayoutEffect,
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

type DeckOrigin = {
  top: number;
  left: number;
  width: number;
};

type CardSpreadTransform = {
  x: number;
  y: number;
  scale: number;
  rotation: number;
};

type SpreadPhase = 'idle' | 'measuring' | 'ready' | 'spreading';
type HoldPhase = 'idle' | 'holding' | 'gathering';
type LandingExitPhase = 'idle' | 'fading' | 'lifting' | 'moving';
type DeckLayoutPhase = 'showcase' | 'moving' | 'focused';

type LandingExitTransform = {
  x: number;
  y: number;
  scale: number;
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
    id: 'balance',
    index: '02',
    name: '平衡',
    subtitle: 'THE BALANCE',
    description: '让失序重新归于平静。',
    accent: '#64aa8e',
    soft: '#e4f5ee',
    ink: '#1f5946',
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
    id: 'insight',
    index: '04',
    name: '洞察',
    subtitle: 'THE INSIGHT',
    description: '看见尚未显露的线索。',
    accent: '#8c79dc',
    soft: '#eeeaff',
    ink: '#3d2c7a',
  },
  {
    id: 'new-moon',
    index: '05',
    name: '新月',
    subtitle: 'THE NEW MOON',
    description: '进入日常，享受当下的时光',
    accent: '#5f8fc5',
    soft: '#e6f1fb',
    ink: '#214c79',
  },
];

const beginningDeck: Card[] = [
  {
    id: 'begin-self-gaze',
    index: '01',
    name: '观看自己',
    subtitle: 'SELF GAZE',
    description:
      '脱掉一件衣物，或者松开一处让身体感到束缚的地方。———如果你已经一丝不挂，缓慢呼吸三次，注意空气接触皮肤时，哪里最先有感觉。',
    accent: '#f0b84b',
    soft: '#fff3d8',
    ink: '#5f4000',
  },
  {
    id: 'begin-arousal',
    index: '02',
    name: '回想兴奋',
    subtitle: 'AROUSAL',
    description: '最近最令你性兴奋的时刻是什么？这个时刻里的什么在吸引着你？',
    accent: '#f0b84b',
    soft: '#fff3d8',
    ink: '#5f4000',
  },
  {
    id: 'begin-touch',
    index: '03',
    name: '指尖感知',
    subtitle: 'TOUCH',
    description: '用手指轻轻地在内裤上打圈，感受身体作出的反应。此时，你是否有想到某个画面？',
    accent: '#f0b84b',
    soft: '#fff3d8',
    ink: '#5f4000',
  },
  {
    id: 'begin-intensity',
    index: '04',
    name: '调节强度',
    subtitle: 'INTENSITY',
    description:
      '在安全和舒服的前提下，只提高一个变量：力度、速度或接触面积。保持两次呼吸，再决定继续、恢复或停止。',
    accent: '#f0b84b',
    soft: '#fff3d8',
    ink: '#5f4000',
  },
  {
    id: 'begin-breathe',
    index: '05',
    name: '深度呼吸',
    subtitle: 'BREATHE',
    description:
      '深深地呼吸三次，让空气自由地流入你的身体，慢慢把自己的感知调动起来。每一次都尽量比上一次呼吸得更深，更满。',
    accent: '#f0b84b',
    soft: '#fff3d8',
    ink: '#5f4000',
  },
  {
    id: 'begin-inner-voice',
    index: '06',
    name: '内在声音',
    subtitle: 'INNER VOICE',
    description:
      '闭上眼睛，想象有哪一个声音？或者哪一句话可以点燃你的此刻？在心里轻轻地告诉自己。',
    accent: '#f0b84b',
    soft: '#fff3d8',
    ink: '#5f4000',
  },
];

const insightDeck: Card[] = [
  {
    id: 'insight-unfamiliar-touch',
    index: '01',
    name: '陌生触碰',
    subtitle: 'UNFAMILIAR TOUCH',
    description:
      '用不常使用的那只手触碰身体。留意这一只手带来的陌生感、笨拙感或新的刺激。',
    accent: '#8c79dc',
    soft: '#eeeaff',
    ink: '#3d2c7a',
  },
  {
    id: 'insight-full-attention',
    index: '02',
    name: '充分关注',
    subtitle: 'FULL ATTENTION',
    description:
      '想象自己同时被来自不同方向的目光、声音或触碰包围，观察身体对“被充分关注”的感觉有没有回应。',
    accent: '#8c79dc',
    soft: '#eeeaff',
    ink: '#3d2c7a',
  },
  {
    id: 'insight-close-distance',
    index: '03',
    name: '亲密距离',
    subtitle: 'CLOSE DISTANCE',
    description:
      '想象一个狭小但安全的空间，身体与另一个存在靠得很近。注意空间带来的急迫感、包裹感或限制感。你希望距离更近还是更远？',
    accent: '#8c79dc',
    soft: '#eeeaff',
    ink: '#3d2c7a',
  },
  {
    id: 'insight-lingering-traces',
    index: '04',
    name: '轨迹停留',
    subtitle: 'LINGERING TRACES',
    description:
      '用指尖在皮肤上画三个圆，再画三条短线。可以选择胸口、腹部、大腿或私密部位。哪种轨迹让感觉停留得更久？',
    accent: '#8c79dc',
    soft: '#eeeaff',
    ink: '#3d2c7a',
  },
  {
    id: 'insight-secret-scene',
    index: '05',
    name: '秘密场景',
    subtitle: 'SECRET SCENE',
    description:
      '想象一个你一直有所好奇的亲密场景。想象里完全安全、不会被发现，也不会影响任何人。吸引你的更像是地点、秘密感，还是脱离日常的感觉？',
    accent: '#8c79dc',
    soft: '#eeeaff',
    ink: '#3d2c7a',
  },
];

const courageDeck: Card[] = [
  {
    id: 'courage-adventure',
    index: '01',
    name: '冒险想象',
    subtitle: 'ADVENTURE',
    description:
      '想象一个你最有欲望的性冒险，如果可以，你最想和谁一起开始这场冒险？如果是和自己，你会愿意在什么情况下开始这场冒险？',
    accent: '#e77962',
    soft: '#ffebe6',
    ink: '#72291b',
  },
  {
    id: 'courage-mirror-pose',
    index: '02',
    name: '镜中姿态',
    subtitle: 'MIRROR POSE',
    description:
      '面对镜子，用一个你认为自己最性感的姿势拍一张照片。你最后可以选择留下，或者删除它，都没关系',
    accent: '#e77962',
    soft: '#ffebe6',
    ink: '#72291b',
  },
  {
    id: 'courage-body-desire',
    index: '03',
    name: '身体所想',
    subtitle: 'BODY DESIRE',
    description:
      '将手放在你的大腿内侧，感受你的身体，你接下来想要什么？向内移动？或是静谧的停顿？现在，你可以满足它。',
    accent: '#e77962',
    soft: '#ffebe6',
    ink: '#72291b',
  },
  {
    id: 'courage-three-pressures',
    index: '04',
    name: '三种力度',
    subtitle: 'THREE PRESSURES',
    description:
      '在同一位置分别尝试轻、适中、稍重三种力度，每种保持两次呼吸。身体在哪一次触碰中更想靠近？',
    accent: '#e77962',
    soft: '#ffebe6',
    ink: '#72291b',
  },
  {
    id: 'courage-another-self',
    index: '05',
    name: '另一个身份',
    subtitle: 'ANOTHER SELF',
    description:
      '闭上眼睛，想象自己换了一个名字、一种身份或一种说话方式。身体变得更放松、更有力量，还是没有变化？',
    accent: '#e77962',
    soft: '#ffebe6',
    ink: '#72291b',
  },
];

const balanceDeck: Card[] = [
  {
    id: 'balance-self-gaze',
    index: '01',
    name: '观看自己',
    subtitle: 'SELF GAZE',
    description:
      '再脱掉一件衣物。————如果你已经一丝不挂，深深地呼吸，放松你的肩膀，面部肌肉，和四肢。',
    accent: '#64aa8e',
    soft: '#e4f5ee',
    ink: '#1f5946',
  },
  {
    id: 'balance-body-focus',
    index: '02',
    name: '身体焦点',
    subtitle: 'BODY FOCUS',
    description:
      '想象你的嘴唇，腰腹，手臂内侧，脖颈——有手指轻轻地抚过，最让你在意的部位是哪里？',
    accent: '#64aa8e',
    soft: '#e4f5ee',
    ink: '#1f5946',
  },
  {
    id: 'balance-approach',
    index: '03',
    name: '靠近与离开',
    subtitle: 'ANTICIPATION',
    description:
      '让手缓慢靠近一个敏感位置，在真正碰到之前停下，再移开。重复几次，感受身体的期待。',
    accent: '#64aa8e',
    soft: '#e4f5ee',
    ink: '#1f5946',
  },
  {
    id: 'balance-rising-sensation',
    index: '04',
    name: '感受起伏',
    subtitle: 'RISING SENSATION',
    description:
      '在安全和舒服的前提下，只提高力度、速度或接触面积中的一个。保持两次呼吸，最后缓缓覆盖那个敏感位置。体会此时身体的起伏。',
    accent: '#64aa8e',
    soft: '#e4f5ee',
    ink: '#1f5946',
  },
  {
    id: 'balance-rhythm',
    index: '05',
    name: '掌握节奏',
    subtitle: 'RHYTHM',
    description:
      '想象一个亲密场景，先让自己掌握节奏，再让对方掌握节奏。分别停留几次呼吸。哪一种安排让身体更有感觉？放轻松，你可以不用回答。',
    accent: '#64aa8e',
    soft: '#e4f5ee',
    ink: '#1f5946',
  },
  {
    id: 'balance-private-words',
    index: '06',
    name: '私密表达',
    subtitle: 'PRIVATE WORDS',
    description:
      '在备忘录里写下你能想到的最下流的话，不要有所保留，但也不要发出去。',
    accent: '#64aa8e',
    soft: '#e4f5ee',
    ink: '#1f5946',
  },
];

const newMoonDeck: Card[] = [
  {
    id: 'new-moon-return',
    index: '01',
    name: '回到日常',
    subtitle: 'RETURN',
    description:
      '最后，你可以观察周围一个物品的轮廓，慢慢连接周围的环境，走进日常。',
    accent: '#5f8fc5',
    soft: '#e6f1fb',
    ink: '#214c79',
  },
  {
    id: 'new-moon-resistance',
    index: '02',
    name: '看见阻力',
    subtitle: 'RESISTANCE',
    description:
      '这次旅程让你觉得最有阻力的时刻是什么？不用深入，只是看见ta',
    accent: '#5f8fc5',
    soft: '#e6f1fb',
    ink: '#214c79',
  },
];

function createPlaceholderDeck(deck: Card): Card[] {
  return Array.from({ length: 5 }, (_, cardIndex) => {
    const number = String(cardIndex + 1).padStart(2, '0');

    return {
      id: `${deck.id}-placeholder-${number}`,
      index: number,
      name: `占位卡牌 ${number}`,
      subtitle: `${deck.subtitle.replace('THE ', '')} · CARD ${number}`,
      description: `${deck.name}卡组的第 ${cardIndex + 1} 张占位卡牌，内容将在后续补充。`,
      accent: deck.accent,
      soft: deck.soft,
      ink: deck.ink,
    };
  });
}

const deckCardsById: Record<string, Card[]> = {
  begin: beginningDeck,
  insight: insightDeck,
  courage: courageDeck,
  balance: balanceDeck,
  'new-moon': newMoonDeck,
};

function getDeckCards(card: Card) {
  return deckCardsById[card.id] ?? createPlaceholderDeck(card);
}

function splitCardPrompt(text: string) {
  const dashParts = text.split(/—+/u).map((part) => part.trim()).filter(Boolean);
  if (dashParts.length > 1) return dashParts;

  const sentenceParts = text.match(/[^。！？]+[。！？]?/gu)?.map((part) => part.trim()).filter(Boolean) ?? [];
  if (sentenceParts.length > 1) return sentenceParts;

  const commaIndex = text.indexOf('，');
  if (commaIndex > 0) {
    return [text.slice(0, commaIndex + 1), text.slice(commaIndex + 1)].map((part) => part.trim());
  }

  return [text];
}

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

const journeyExitMotes = Array.from({ length: 132 }, (_, index) => {
  const left = 4 + ((index * 47) % 92);
  const top = 3 + ((index * 71) % 94);
  const angle = (index * 137.508 * Math.PI) / 180;
  const burstReach = 45 + (index % 9) * 4;

  return {
    id: index,
    style: {
      left: `${left}%`,
      top: `${top}%`,
      '--exit-mote-size': `${1.5 + (index % 5) * 0.72}px`,
      '--exit-mote-opacity': `${0.38 + (index % 6) * 0.1}`,
      '--exit-mote-delay': `${3.72 + (index % 19) * 0.045}s`,
      '--exit-gather-x': `${50 - left}vw`,
      '--exit-gather-y': `${50 - top}vh`,
      '--exit-burst-x': `${Math.cos(angle) * burstReach}vw`,
      '--exit-burst-y': `${Math.sin(angle) * burstReach}vh`,
    } as CSSProperties,
  };
});

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

function ContactControl() {
  const [isOpen, setIsOpen] = useState(false);
  const contactRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    function closeOnOutsideClick(event: PointerEvent) {
      const target = event.target;
      if (target instanceof Node && !contactRef.current?.contains(target)) {
        setIsOpen(false);
      }
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    document.addEventListener('pointerdown', closeOnOutsideClick);
    document.addEventListener('keydown', closeOnEscape);

    return () => {
      document.removeEventListener('pointerdown', closeOnOutsideClick);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [isOpen]);

  return (
    <div className="contact-control" ref={contactRef}>
      <button
        className="contact-trigger"
        type="button"
        aria-expanded={isOpen}
        aria-controls="contact-details"
        onClick={() => setIsOpen((value) => !value)}
      >
        联系我们
      </button>

      {isOpen && (
        <div id="contact-details" className="contact-panel" aria-label="联系方式">
          <div className="contact-item">
            <span className="contact-label">邮箱</span>
            <a className="contact-value" href="mailto:mamingyang9975@gmail.com">
              mamingyang9975@gmail.com
            </a>
          </div>
          <div className="contact-item">
            <span className="contact-label">微信</span>
            <span className="contact-value">Yao11Jiu</span>
          </div>
        </div>
      )}
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
  onExpand: (origin: DeckOrigin) => void;
}) {
  const [holdPhase, setHoldPhase] = useState<HoldPhase>('idle');
  const [exitPhase, setExitPhase] = useState<LandingExitPhase>('idle');
  const [exitTransform, setExitTransform] = useState<LandingExitTransform>({
    x: 0,
    y: 0,
    scale: 1,
  });
  const stackRef = useRef<HTMLDivElement | null>(null);
  const frontCardRef = useRef<HTMLElement | null>(null);
  const useTargetRef = useRef<HTMLDivElement | null>(null);
  const pressTimer = useRef<number | null>(null);
  const gatherTimer = useRef<number | null>(null);
  const exitTimers = useRef<number[]>([]);
  const longPressTriggered = useRef(false);

  function clearPressTimer() {
    if (pressTimer.current !== null) {
      window.clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  }

  function clearGatherTimer() {
    if (gatherTimer.current !== null) {
      window.clearTimeout(gatherTimer.current);
      gatherTimer.current = null;
    }
  }

  function clearExitTimers() {
    exitTimers.current.forEach((timer) => window.clearTimeout(timer));
    exitTimers.current = [];
  }

  function queueExitStep(callback: () => void, delay: number) {
    const timer = window.setTimeout(callback, delay);
    exitTimers.current.push(timer);
  }

  useEffect(() => {
    return () => {
      clearPressTimer();
      clearGatherTimer();
      clearExitTimers();
    };
  }, []);

  function startPress(event: ReactPointerEvent<HTMLButtonElement>) {
    if (exitPhase !== 'idle') return;
    if (event.pointerType === 'mouse' && event.button !== 0) return;

    clearPressTimer();
    clearGatherTimer();
    longPressTriggered.current = false;
    setHoldPhase('holding');
    pressTimer.current = window.setTimeout(() => {
      pressTimer.current = null;
      longPressTriggered.current = true;
      const stackBounds = stackRef.current?.getBoundingClientRect();
      const origin = {
        top: stackBounds?.top ?? window.innerHeight / 2,
        left: stackBounds?.left ?? window.innerWidth / 2,
        width: stackBounds?.width ?? 280,
      };
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      setHoldPhase('gathering');
      gatherTimer.current = window.setTimeout(() => {
        gatherTimer.current = null;
        onExpand(origin);
      }, reduceMotion ? 30 : 220);
    }, 620);
  }

  function endPress() {
    if (longPressTriggered.current) return;
    clearPressTimer();
    setHoldPhase('idle');
  }

  function beginContinueTransition() {
    if (exitPhase !== 'idle') return;

    clearPressTimer();
    clearGatherTimer();

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const sourceBounds = frontCardRef.current?.getBoundingClientRect();
    const targetBounds = useTargetRef.current?.getBoundingClientRect();

    if (reduceMotion || !sourceBounds || !targetBounds) {
      onContinue();
      return;
    }

    setExitTransform({
      x: targetBounds.left + targetBounds.width / 2 - (sourceBounds.left + sourceBounds.width / 2),
      y: targetBounds.top + targetBounds.height / 2 - (sourceBounds.top + sourceBounds.height / 2),
      scale: targetBounds.width / sourceBounds.width,
    });
    setExitPhase('fading');

    queueExitStep(() => setExitPhase('lifting'), 260);
    queueExitStep(() => setExitPhase('moving'), 500);
    queueExitStep(onContinue, 1340);
  }

  function continueJourney() {
    if (longPressTriggered.current) {
      longPressTriggered.current = false;
      return;
    }
    beginContinueTransition();
  }

  return (
    <main
      className={`landing-page ${exitPhase !== 'idle' ? 'is-exiting' : ''} exit-${exitPhase}`}
      style={cardStyle(card)}
    >
      <header className="topbar landing-topbar">
        <div className="brand">
          <span className="brand-dot" aria-hidden="true" />
          <span>ARCANA</span>
        </div>
        <span className="brand-mark">今日旅程</span>
        <div className="topbar-meta">
          <span className="step-label">01 / START</span>
          <ContactControl />
        </div>
      </header>

      <section className="landing-stage" aria-label="从启程牌开始今天的旅程">
        <div
          ref={stackRef}
          className={`landing-card-stack is-${holdPhase} is-exit-${exitPhase}`}
          style={{
            '--landing-exit-x': `${exitTransform.x}px`,
            '--landing-exit-y': `${exitTransform.y}px`,
            '--landing-exit-scale': exitTransform.scale,
          } as CSSProperties}
        >
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

          <article
            ref={frontCardRef}
            className="active-card landing-front-card"
            style={cardStyle(card)}
            aria-hidden="true"
          >
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
            disabled={exitPhase !== 'idle'}
          />
        </div>

        <button
          className="landing-hint"
          type="button"
          onClick={beginContinueTransition}
          disabled={exitPhase !== 'idle'}
        >
          点击继续
        </button>
      </section>

      <div className="use-page landing-use-target" aria-hidden="true">
        <div className="topbar use-topbar" />
        <div className="use-stage">
          <div ref={useTargetRef} className="active-card" />
          <div className="use-copy">
            <span className="eyebrow">当前卡牌</span>
            <h2>准备使用「{card.name}」</h2>
            <p>确认后，这张卡牌将带你进入对应的五张卡牌卡组。</p>
            <button className="primary-button use-button" type="button" tabIndex={-1}>
              使用这张卡牌 <span aria-hidden="true">↗</span>
            </button>
          </div>
        </div>
      </div>
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

function JourneyExit({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const completeTimer = window.setTimeout(onComplete, reduceMotion ? 1050 : 8300);

    return () => window.clearTimeout(completeTimer);
  }, [onComplete]);

  return (
    <section className="journey-exit" role="status" aria-live="polite" aria-label="旅程正在结束">
      <p className="journey-exit-words">现在，享受你自己的时刻。</p>
      <div className="journey-exit-motes" aria-hidden="true">
        {journeyExitMotes.map((mote) => (
          <span key={mote.id} className="journey-exit-mote" style={mote.style} />
        ))}
        <span className="journey-exit-core" />
        <span className="journey-exit-wash" />
      </div>
    </section>
  );
}

function Deck({ card, onReturn }: { card: Card; onReturn: () => void }) {
  const initialGroupIndex = Math.max(cards.findIndex((item) => item.id === card.id), 0);
  const groupIndex = initialGroupIndex;
  const [activeIndex, setActiveIndex] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [cardMotion, setCardMotion] = useState(0);
  const [actionNote, setActionNote] = useState('');
  const [isEnding, setIsEnding] = useState(false);
  const [layoutPhase, setLayoutPhase] = useState<DeckLayoutPhase>(() => {
    const shouldAnimate = window.matchMedia('(min-width: 721px)').matches
      && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    return shouldAnimate ? 'showcase' : 'focused';
  });
  const activeGroup = cards[groupIndex];
  const deckCards = getDeckCards(activeGroup);
  const activeCard = deckCards[activeIndex];
  const isLastCard = stepIndex === deckCards.length - 1;
  const promptParts = splitCardPrompt(activeCard.description);

  function finishJourney() {
    if (isEnding) return;
    setIsEnding(true);
  }

  useLayoutEffect(() => {
    const shouldAnimate = window.matchMedia('(min-width: 721px)').matches
      && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!shouldAnimate) {
      setLayoutPhase('focused');
      return undefined;
    }

    setLayoutPhase('showcase');

    const moveTimer = window.setTimeout(() => setLayoutPhase('moving'), 1000);
    const focusTimer = window.setTimeout(() => setLayoutPhase('focused'), 2050);

    return () => {
      window.clearTimeout(moveTimer);
      window.clearTimeout(focusTimer);
    };
  }, [activeCard.id, cardMotion]);

  function showCard(nextIndex: number, note: string) {
    const shouldAnimate = window.matchMedia('(min-width: 721px)').matches
      && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (shouldAnimate) {
      setLayoutPhase('showcase');
    }

    setActiveIndex(nextIndex);
    setCardMotion((value) => value + 1);
    setActionNote(note);
  }

  function exchangeCard() {
    if (deckCards.length < 2) {
      setActionNote('当前卡组暂时只有这一张牌');
      return;
    }

    const offset = 1 + (cardMotion % (deckCards.length - 1));
    const nextIndex = (activeIndex + offset) % deckCards.length;
    showCard(nextIndex, '已为你换上一张不同的牌');
  }

  function skipCard() {
    showCard((activeIndex + 1) % deckCards.length, '已跳过，旅程继续');
  }

  function nextCard() {
    if (isLastCard) {
      finishJourney();
      return;
    }

    setStepIndex((value) => value + 1);
    showCard((activeIndex + 1) % deckCards.length, '已进入下一张牌');
  }

  return (
    <main
      className={`deck-page deck-layout-${layoutPhase} ${isEnding ? 'is-ending' : ''}`}
      style={cardStyle(activeGroup)}
    >
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
        <div className="topbar-meta">
          <span className="step-label">
            {String(stepIndex + 1).padStart(2, '0')} / {String(deckCards.length).padStart(2, '0')}
          </span>
          <ContactControl />
        </div>
      </header>

      <section className="deck-stage" aria-label={`${activeGroup.name}卡组，当前卡牌为${activeCard.name}`}>
        <div className="deck-card-slot">
          <article className="deck-reading-card" key={cardMotion} style={deckCardStyle(activeCard, activeGroup)}>
            <div className="deck-reading-inner">
              <div className="card-kicker">
                <span>{activeCard.index}</span>
                <span>{activeCard.subtitle}</span>
              </div>
              <CardArtwork card={activeCard} />
              <div className="deck-card-prompt">
                <p className="deck-card-prompt-lead">{promptParts[0]}</p>
                {promptParts.slice(1).map((part, index) => (
                  <p key={`${activeCard.id}-prompt-${index}`} className="deck-card-prompt-detail">
                    {part}
                  </p>
                ))}
              </div>
              <div className="active-card-copy">
                <h1>{activeCard.name}</h1>
              </div>
            </div>
          </article>
        </div>

        <aside className="deck-actions">
          <div className="deck-guidance">
            <span className="eyebrow">{activeGroup.name} · CARD DECK</span>
            <h2 className="deck-prompt">{activeCard.description}</h2>
          </div>

          <button className="deck-exchange-button" type="button" onClick={exchangeCard}>
            <span aria-hidden="true">↻</span> 换一张牌
          </button>

          <div className="deck-progress" aria-hidden="true">
            {deckCards.map((item, index) => (
              <span key={item.id} className={index === stepIndex ? 'is-current' : ''} />
            ))}
          </div>

          <div className="deck-forward-actions">
            <button className="deck-next-button" type="button" onClick={nextCard}>
              {isLastCard ? '结束这次旅程' : '下一步'} <span aria-hidden="true">→</span>
            </button>
            {!isLastCard && (
              <button className="deck-skip-button" type="button" onClick={skipCard}>
                跳过这张牌
              </button>
            )}
          </div>

          <p className="deck-action-note" aria-live="polite">{actionNote || '\u00a0'}</p>
        </aside>
      </section>

      <footer className="deck-footer">
        <button type="button" onClick={finishJourney}>结束这次旅程</button>
      </footer>

      {isEnding && <JourneyExit onComplete={onReturn} />}
    </main>
  );
}

export default function App() {
  const [selectedId, setSelectedId] = useState(cards[0].id);
  const [recommendationTipKey, setRecommendationTipKey] = useState(0);
  const [descriptionMessageCardId, setDescriptionMessageCardId] = useState<string | null>(null);
  const [descriptionMessageKey, setDescriptionMessageKey] = useState(0);
  const [journeyEndMessageKey, setJourneyEndMessageKey] = useState(0);
  const [screen, setScreen] = useState<Screen>('landing');
  const [used, setUsed] = useState(false);
  const [arrivingFromLanding, setArrivingFromLanding] = useState(false);
  const [expansionOrigin, setExpansionOrigin] = useState<DeckOrigin | null>(null);
  const [spreadPhase, setSpreadPhase] = useState<SpreadPhase>('idle');
  const [spreadTransforms, setSpreadTransforms] = useState<CardSpreadTransform[]>([]);
  const activationTimer = useRef<number | null>(null);
  const recommendationTipTimer = useRef<number | null>(null);
  const descriptionMessageTimer = useRef<number | null>(null);
  const journeyEndTimer = useRef<number | null>(null);
  const choiceCardRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const selectedCard = cards.find((card) => card.id === selectedId) ?? cards[0];

  useEffect(() => {
    return () => {
      if (activationTimer.current !== null) {
        window.clearTimeout(activationTimer.current);
      }
      if (recommendationTipTimer.current !== null) {
        window.clearTimeout(recommendationTipTimer.current);
      }
      if (descriptionMessageTimer.current !== null) {
        window.clearTimeout(descriptionMessageTimer.current);
      }
      if (journeyEndTimer.current !== null) {
        window.clearTimeout(journeyEndTimer.current);
      }
    };
  }, []);

  useLayoutEffect(() => {
    if (screen !== 'select' || !expansionOrigin) return;

    const compactLayout = window.matchMedia('(max-width: 720px)').matches;
    const transforms = choiceCardRefs.current.map((element, index) => {
      if (!element) {
        return { x: 0, y: 0, scale: 1, rotation: 0 };
      }

      const target = element.getBoundingClientRect();
      const selectedLift = cards[index].id === selectedId ? (compactLayout ? -4 : -7) : 0;
      const stackDepth = index;
      const stackStepX = compactLayout ? 1.5 : 2;
      const stackStepY = compactLayout ? 1.5 : 2;

      return {
        x: expansionOrigin.left + stackDepth * stackStepX - target.left,
        y: expansionOrigin.top - stackDepth * stackStepY - (target.top - selectedLift),
        scale: expansionOrigin.width / target.width,
        rotation: stackDepth === 0 ? 0 : stackDepth * 0.08,
      };
    });

    setSpreadTransforms(transforms);
    setSpreadPhase('ready');

    let secondFrame = 0;
    const firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(() => setSpreadPhase('spreading'));
    });
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const completeTimer = window.setTimeout(() => {
      setSpreadPhase('idle');
      setSpreadTransforms([]);
      setExpansionOrigin(null);
    }, reduceMotion ? 80 : 1540);

    return () => {
      window.cancelAnimationFrame(firstFrame);
      window.cancelAnimationFrame(secondFrame);
      window.clearTimeout(completeTimer);
    };
  }, [screen, expansionOrigin, selectedId]);

  function openCard() {
    setUsed(false);
    setArrivingFromLanding(false);
    setScreen('use');
  }

  function hideRecommendationTip() {
    if (recommendationTipTimer.current !== null) {
      window.clearTimeout(recommendationTipTimer.current);
      recommendationTipTimer.current = null;
    }
    setRecommendationTipKey(0);
  }

  function showRecommendationTip() {
    if (recommendationTipTimer.current !== null) {
      window.clearTimeout(recommendationTipTimer.current);
    }

    setRecommendationTipKey((value) => value + 1);
    recommendationTipTimer.current = window.setTimeout(() => {
      recommendationTipTimer.current = null;
      setRecommendationTipKey(0);
    }, 3720);
  }

  function showJourneyEndMessage() {
    if (descriptionMessageTimer.current !== null) {
      window.clearTimeout(descriptionMessageTimer.current);
      descriptionMessageTimer.current = null;
    }
    if (journeyEndTimer.current !== null) {
      window.clearTimeout(journeyEndTimer.current);
    }

    setDescriptionMessageCardId(null);
    setDescriptionMessageKey(0);
    setJourneyEndMessageKey((value) => value + 1);
    journeyEndTimer.current = window.setTimeout(() => {
      journeyEndTimer.current = null;
      setJourneyEndMessageKey(0);
    }, 3000);
  }

  function showCardDescription(card: Card) {
    if (journeyEndTimer.current !== null) {
      window.clearTimeout(journeyEndTimer.current);
      journeyEndTimer.current = null;
    }
    if (descriptionMessageTimer.current !== null) {
      window.clearTimeout(descriptionMessageTimer.current);
    }

    setJourneyEndMessageKey(0);
    setDescriptionMessageCardId(card.id);
    setDescriptionMessageKey((value) => value + 1);
    descriptionMessageTimer.current = window.setTimeout(() => {
      descriptionMessageTimer.current = null;
      setDescriptionMessageCardId(null);
      setDescriptionMessageKey(0);
    }, 3000);
  }

  function startFromBeginning() {
    setSelectedId(cards[0].id);
    setUsed(false);
    setArrivingFromLanding(true);
    setScreen('use');
  }

  function expandDeck(origin: DeckOrigin) {
    setSpreadTransforms([]);
    setExpansionOrigin(origin);
    setSpreadPhase('measuring');
    setScreen('select');
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
      <main
        className={`use-page ${arrivingFromLanding ? 'is-landing-arrival' : ''}`}
        style={cardStyle(selectedCard)}
      >
        <header className="topbar use-topbar">
          <button className="text-button" type="button" onClick={returnToCards}>
            <span aria-hidden="true">←</span> 返回选择
          </button>
          <span className="brand-mark">ARC / 05</span>
          <div className="topbar-meta">
            <span className="step-label">02 / USE</span>
            <ContactControl />
          </div>
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
        onExpand={expandDeck}
      />
    );
  }

  return (
    <main
      className={`select-page ${expansionOrigin ? 'is-deck-expanding' : ''} spread-${spreadPhase}`}
    >
      <header className="topbar">
        <div className="brand">
          <span className="brand-dot" aria-hidden="true" />
          <span>ARCANA</span>
        </div>
        <p>让此刻的直觉，为你指引下一步</p>
        <div className="topbar-meta">
          <span className="step-label">01 / SELECT</span>
          <ContactControl />
        </div>
      </header>

      <section className="selection-intro">
        <div className="selection-copy">
          <span className="selection-note">整个旅程从左至右依次推进，强度也会逐步提升</span>
          <span className="eyebrow">你可以从任意一个节点进入旅程</span>
        </div>
        <h1>此刻，你需要什么？</h1>
      </section>

      <section className="card-grid" aria-label="可选择的卡牌">
        {cards.map((card, index) => {
          const selected = card.id === selectedId;
          const spreadTransform = spreadTransforms[index];
          const isShowingDescription =
            card.id === descriptionMessageCardId && descriptionMessageKey > 0;

          return (
            <button
              key={card.id}
              ref={(element) => {
                choiceCardRefs.current[index] = element;
              }}
              className={`choice-card ${selected ? 'is-selected' : ''} ${spreadTransform ? 'is-from-stack' : ''}`}
              style={{
                ...cardStyle(card),
                ...(spreadTransform
                  ? {
                      '--spread-x': `${spreadTransform.x}px`,
                      '--spread-y': `${spreadTransform.y}px`,
                      '--spread-scale': spreadTransform.scale,
                      '--spread-rotation': `${spreadTransform.rotation}deg`,
                      '--spread-order': index,
                      zIndex: index === 0 ? 10 : cards.length - index,
                    }
                  : {}),
              } as CSSProperties}
              type="button"
              aria-pressed={selected}
              aria-describedby={
                isShowingDescription
                  ? `card-description-message-${card.id}`
                  : card.id === 'begin' && selected && recommendationTipKey > 0
                    ? 'begin-recommendation-tip'
                  : card.id === 'new-moon' && journeyEndMessageKey > 0
                    ? 'journey-end-message'
                  : undefined
              }
              aria-disabled={Boolean(expansionOrigin)}
              tabIndex={expansionOrigin ? -1 : undefined}
              onClick={() => {
                if (expansionOrigin) return;
                if (card.id === 'new-moon') {
                  hideRecommendationTip();
                  showJourneyEndMessage();
                  return;
                }
                setSelectedId(card.id);
                if (card.id === 'begin') {
                  showRecommendationTip();
                } else {
                  hideRecommendationTip();
                }
                showCardDescription(card);
              }}
              onDoubleClick={() => {
                if (!expansionOrigin && card.id !== 'new-moon') openCard();
              }}
            >
              {card.id === 'begin' && (
                <span className="recommendation-badge">推荐</span>
              )}
              {card.id === 'begin' && selected && recommendationTipKey > 0 && (
                <span
                  key={`recommendation-tip-${recommendationTipKey}`}
                  id="begin-recommendation-tip"
                  className="recommendation-tip"
                  role="status"
                >
                  最深度的体验
                </span>
              )}
              {isShowingDescription && (
                <span
                  key={descriptionMessageKey}
                  id={`card-description-message-${card.id}`}
                  className="card-description-message"
                  role="status"
                >
                  {card.description}
                </span>
              )}
              {card.id === 'new-moon' && journeyEndMessageKey > 0 && (
                <span
                  key={journeyEndMessageKey}
                  id="journey-end-message"
                  className="journey-end-message"
                  role="status"
                >
                  这趟旅程到这里就结束啦
                </span>
              )}
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
