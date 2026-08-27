'use client';

import { useState, type CSSProperties } from 'react';

type Mode = 'solo' | 'pair';
type Cycle = 'period' | 'regular';
type CardKind = 'sense' | 'explore';
type Design = 'moss' | 'clay' | 'mist' | 'plum';

type PromptCard = {
  id: string;
  tier: 0 | 1 | 2 | 3;
  pair: string;
  solo: string;
  period?: string;
  guidance: string;
};

const senseCards: PromptCard[] = [
  {
    id: 'sense-quiet',
    tier: 0,
    pair: '先不急着说话。一起留意，此刻身体里最安静的地方在哪里？',
    solo: '先不急着回答。留意此刻身体里最安静的地方在哪里？',
    period: '把注意力轻轻放回身体。此刻哪里最需要被安放？',
    guidance: '停留十秒，再用一个词描述它。',
  },
  {
    id: 'sense-weather',
    tier: 0,
    pair: '如果此刻的关系是一种天气，它更接近晴朗、起雾，还是将要下雨？',
    solo: '如果此刻的心情是一种天气，它更接近晴朗、起雾，还是将要下雨？',
    period: '如果身体此刻是一种天气，它想要晴朗、微雨，还是一场安静的雪？',
    guidance: '只描述，不需要解释原因。',
  },
  {
    id: 'sense-distance',
    tier: 1,
    pair: '此刻，你希望对方更靠近一点，还是为你留出一点空间？',
    solo: '此刻，你更需要靠近自己的感受，还是暂时留出一点空间？',
    period: '此刻，你更需要照顾自己的感受，还是先让它安静地待一会儿？',
    guidance: '诚实选择，不必让答案显得合理。',
  },
  {
    id: 'sense-pause',
    tier: 1,
    pair: '回想今天让你停顿的那个瞬间。当时最先出现的感受是什么？',
    solo: '回想今天让你停顿的那个瞬间。身体最先给了你什么信号？',
    period: '今天哪一个瞬间，让你最明显地感到需要休息或被照顾？',
    guidance: '从发生了什么开始，慢慢靠近感受。',
  },
  {
    id: 'sense-unsaid',
    tier: 2,
    pair: '有什么是你很希望被理解，却还没有真正说出口的？',
    solo: '有什么是你一直知道，却还没有真正向自己承认的？',
    period: '此刻有什么需要，你还没有允许自己坦然承认？',
    guidance: '可以只说到你感到安全的位置。',
  },
  {
    id: 'sense-protect',
    tier: 2,
    pair: '最近一次你想要推开对方时，你真正想保护的是什么？',
    solo: '最近一次你回避某种感受时，你真正想保护的是什么？',
    period: '当身体变得敏感时，你最想保护自己不受什么影响？',
    guidance: '先描述被保护的部分，不急着改变它。',
  },
  {
    id: 'sense-truth',
    tier: 3,
    pair: '如果不用担心对方的反应，此刻你最想说出的真话是什么？',
    solo: '如果不用担心任何后果，此刻你最想对自己说出的真话是什么？',
    period: '如果身体可以替你说一句真话，它会要求你停止勉强什么？',
    guidance: '让这句话保持原本的样子，不做修饰。',
  },
];

const exploreCards: PromptCard[] = [
  {
    id: 'explore-breath',
    tier: 0,
    pair: '一起做三次缓慢呼吸。每次呼气时，把肩膀再放松一点。',
    solo: '做三次缓慢呼吸。每次呼气时，把肩膀再放松一点。',
    period: '把手轻放在腹部，做三次不费力的呼吸。',
    guidance: '结束后，留意身体发生了什么微小变化。',
  },
  {
    id: 'explore-gesture',
    tier: 1,
    pair: '不用语言，用一个动作示意你希望对方靠近，还是留出空间。',
    solo: '不用语言，用一个动作表达此刻最真实的需要。',
    period: '调整一个姿势，让身体比刚才更舒服一点。',
    guidance: '让动作停留片刻，再决定是否要解释。',
  },
  {
    id: 'explore-sentence',
    tier: 1,
    pair: '看着对方，补完这句话：“此刻，我希望你知道……”',
    solo: '对自己补完这句话：“此刻，我需要知道……”',
    period: '补完这句话：“今天，我可以允许自己……”',
    guidance: '说出最先出现的答案。',
  },
  {
    id: 'explore-request',
    tier: 2,
    pair: '向对方提出一个具体、现在就可以回应的小请求。',
    solo: '为自己做一个具体、现在就可以完成的小照顾。',
    period: '为身体做一件五分钟内可以完成的小照顾。',
    guidance: '请求要足够小，也允许被拒绝。',
  },
  {
    id: 'explore-honest',
    tier: 3,
    pair: '选择一句平常很难直接说的话，用更诚实也更温和的方式表达它。',
    solo: '写下一句你常常回避的话，再把它改写得诚实而温和。',
    period: '写下最近最让你勉强的一件事，并为它重新设定一个边界。',
    guidance: '不追求完美，只让表达比刚才更接近真实。',
  },
];

const intensityStops = [
  { range: '0–2', label: '边缘安抚' },
  { range: '3–5', label: '温和感知' },
  { range: '6–8', label: '深入感受' },
  { range: '9–10', label: '深入探索' },
];

const designs: Array<{
  id: Design;
  number: string;
  label: string;
  note: string;
  accentStart: string;
  accentEnd: string;
}> = [
  {
    id: 'moss',
    number: '01',
    label: '苔夜',
    note: '沉静 · 包裹',
    accentStart: '#718b7c',
    accentEnd: '#a57e88',
  },
  {
    id: 'clay',
    number: '02',
    label: '陶白',
    note: '温润 · 编辑感',
    accentStart: '#91896d',
    accentEnd: '#aa7f77',
  },
  {
    id: 'mist',
    number: '03',
    label: '雾蓝',
    note: '清透 · 留白',
    accentStart: '#6f8992',
    accentEnd: '#898198',
  },
  {
    id: 'plum',
    number: '04',
    label: '藕灰',
    note: '亲密 · 杂志感',
    accentStart: '#847884',
    accentEnd: '#9d7c7c',
  },
];

function getIntensityMeta(value: number) {
  if (value <= 2) return { tier: 0 as const, label: '边缘安抚', note: '轻柔靠近，不要求说得太多。' };
  if (value <= 5) return { tier: 1 as const, label: '温和感知', note: '允许感受出现，也保留足够空间。' };
  if (value <= 8) return { tier: 2 as const, label: '深入感受', note: '开始触碰那些尚未说清的部分。' };
  return { tier: 3 as const, label: '深入探索', note: '更直接地靠近真实需要与边界。' };
}

function mixHex(start: string, end: string, amount: number) {
  const startValue = Number.parseInt(start.slice(1), 16);
  const endValue = Number.parseInt(end.slice(1), 16);
  const channel = (shift: number) => {
    const from = (startValue >> shift) & 255;
    const to = (endValue >> shift) & 255;
    return Math.round(from + (to - from) * amount);
  };
  return `rgb(${channel(16)}, ${channel(8)}, ${channel(0)})`;
}

function pickKind(refinements: number): CardKind {
  const senseWeight = refinements >= 4 ? 1 : refinements >= 2 ? 1 : 2;
  const exploreWeight = refinements >= 4 ? 2 : 1;
  return Math.random() * (senseWeight + exploreWeight) < senseWeight ? 'sense' : 'explore';
}

export default function Home() {
  const [screen, setScreen] = useState<'setup' | 'deck'>('setup');
  const [design, setDesign] = useState<Design>('moss');
  const [mode, setMode] = useState<Mode | null>(null);
  const [cycle, setCycle] = useState<Cycle | null>(null);
  const [intensity, setIntensity] = useState(4);
  const [cardKind, setCardKind] = useState<CardKind>('sense');
  const [currentCard, setCurrentCard] = useState<PromptCard | null>(null);
  const [sequence, setSequence] = useState(1);
  const [senseRefinements, setSenseRefinements] = useState(0);

  const intensityMeta = getIntensityMeta(intensity);
  const activeDesign = designs.find((item) => item.id === design) ?? designs[0];
  const accent = mixHex(activeDesign.accentStart, activeDesign.accentEnd, intensity / 10);
  const sessionStyle = {
    '--accent': accent,
    '--intensity-position': `${intensity * 10}%`,
  } as CSSProperties;

  const canStart = Boolean(mode && (mode === 'pair' || cycle));

  function chooseMode(nextMode: Mode) {
    setMode(nextMode);
    setCycle(null);
  }

  function pickCard(kind: CardKind, excludeId?: string) {
    const pool = kind === 'sense' ? senseCards : exploreCards;
    const eligible = pool.filter((card) => card.tier <= intensityMeta.tier);
    const fresh = eligible.filter((card) => card.id !== excludeId);
    const candidates = fresh.length > 0 ? fresh : eligible;
    return candidates[Math.floor(Math.random() * candidates.length)];
  }

  function cardText(card: PromptCard) {
    if (mode === 'pair') return card.pair;
    if (cycle === 'period' && card.period) return card.period;
    return card.solo;
  }

  function startSession() {
    if (!mode || (mode === 'solo' && !cycle)) return;
    const firstKind = pickKind(0);
    setSenseRefinements(0);
    setCardKind(firstKind);
    setCurrentCard(pickCard(firstKind));
    setSequence(1);
    setScreen('deck');
  }

  function moveTo(kind: CardKind) {
    setCardKind(kind);
    setCurrentCard(pickCard(kind, currentCard?.id));
    setSequence((value) => value + 1);
  }

  function skipCard() {
    moveTo(cardKind === 'sense' ? 'explore' : 'sense');
  }

  function refineCard() {
    if (cardKind === 'sense') {
      setSenseRefinements((value) => value + 1);
    }
    moveTo('explore');
  }

  function completeCard() {
    moveTo(pickKind(senseRefinements));
  }

  if (screen === 'deck' && currentCard) {
    const modeSummary = mode === 'pair'
      ? '双人'
      : cycle === 'period'
        ? '单人 · 经期'
        : '单人 · 非经期';

    return (
      <main className="app-shell deck-screen" data-design={design} style={sessionStyle}>
        <header className="topbar">
          <button className="quiet-button" type="button" onClick={() => setScreen('setup')}>
            <span aria-hidden="true">←</span> 重新设置
          </button>
          <span className="brand-mark">ARCANA</span>
          <span className="step-label">02 / DECK</span>
        </header>

        <section className="deck-stage">
          <div className="session-rail" aria-label="本次游戏设置">
            <span>{modeSummary}</span>
            <span className="rail-dot" />
            <span>强度 {intensity}</span>
            <span className="rail-dot" />
            <span>{intensityMeta.label}</span>
          </div>

          <article className="deck-card" aria-live="polite" key={currentCard.id}>
            <div className="deck-card-inner">
              <div className="deck-card-head">
                <span>{String(sequence).padStart(2, '0')}</span>
                <span>ARC / SESSION</span>
              </div>

              <div className="card-symbol" aria-hidden="true">
                <span className="symbol-orbit symbol-orbit-one" />
                <span className="symbol-orbit symbol-orbit-two" />
                <span className="symbol-core" />
              </div>

              <div className="prompt-copy">
                <p className="prompt-text">{cardText(currentCard)}</p>
                <p className="prompt-guidance">{currentCard.guidance}</p>
              </div>

              <div className="deck-card-foot">
                <span>慢一点</span>
                <span>没有标准答案</span>
              </div>
            </div>
          </article>

          <div className="deck-controls">
            <div className="branch-actions">
              <button className="branch-button" type="button" onClick={skipCard}>
                <span className="button-title">跳过</span>
                <span className="button-note">换一种方向</span>
                <span className="button-arrow" aria-hidden="true">↗</span>
              </button>
              <button className="branch-button is-accent" type="button" onClick={refineCard}>
                <span className="button-title">细化</span>
                <span className="button-note">再向里走一步</span>
                <span className="button-arrow" aria-hidden="true">＋</span>
              </button>
            </div>
            <button className="continue-button" type="button" onClick={completeCard}>
              完成，下一张 <span aria-hidden="true">→</span>
            </button>
            <p className="control-hint">任何时候感到不适，都可以停在这里。</p>
          </div>
        </section>
      </main>
    );
  }

  const summary = mode === 'pair'
    ? '双人模式'
    : mode === 'solo' && cycle
      ? `单人模式 · ${cycle === 'period' ? '经期' : '非经期'}`
      : mode === 'solo'
        ? '单人模式 · 请选择状态'
        : '请选择游戏模式';

  return (
    <main className="app-shell setup-screen" data-design={design} style={sessionStyle}>
      <header className="topbar">
        <div className="brand">
          <span className="brand-dot" aria-hidden="true" />
          <span>ARCANA</span>
        </div>
        <p>给当下留一点空间</p>
        <span className="step-label">01 / SETUP</span>
      </header>

      <nav className="concept-picker" aria-label="选择首页界面方案">
        <div className="concept-picker-title">
          <span>界面方案</span>
          <small>{activeDesign.note}</small>
        </div>
        <div className="concept-options">
          {designs.map((item) => (
            <button
              className={design === item.id ? 'is-selected' : ''}
              type="button"
              key={item.id}
              aria-pressed={design === item.id}
              onClick={() => setDesign(item.id)}
            >
              <span className={`concept-swatch swatch-${item.id}`} aria-hidden="true" />
              <span className="concept-number">{item.number}</span>
              <strong>{item.label}</strong>
            </button>
          ))}
        </div>
      </nav>

      <section className="setup-layout">
        <div className="setup-intro">
          <span className="eyebrow">进入之前</span>
          <h1>先决定，<br />这次要走多远。</h1>
          <p>没有正确的选择。强度只是为这一次对话划出一个让人安心的范围。</p>
          <span className="concept-caption">{activeDesign.number} / {activeDesign.label} · {activeDesign.note}</span>
          <div className="ambient-mark" aria-hidden="true">
            <span className="ambient-ring ring-one" />
            <span className="ambient-ring ring-two" />
            <span className="ambient-dot" />
          </div>
        </div>

        <div className={`settings-panel ${mode === 'solo' ? 'has-cycle' : ''}`}>
          <fieldset className="setting-group">
            <legend>
              <span className="setting-index">01</span>
              <span>选择模式</span>
            </legend>
            <div className="mode-options">
              <button
                className={`mode-card ${mode === 'solo' ? 'is-selected' : ''}`}
                type="button"
                aria-pressed={mode === 'solo'}
                onClick={() => chooseMode('solo')}
              >
                <span className="mode-icon solo-icon" aria-hidden="true"><i /></span>
                <span className="mode-copy"><strong>单人</strong><small>和自己待一会儿</small></span>
                <span className="option-check" aria-hidden="true">✓</span>
              </button>
              <button
                className={`mode-card ${mode === 'pair' ? 'is-selected' : ''}`}
                type="button"
                aria-pressed={mode === 'pair'}
                onClick={() => chooseMode('pair')}
              >
                <span className="mode-icon pair-icon" aria-hidden="true"><i /><i /></span>
                <span className="mode-copy"><strong>双人</strong><small>共同完成一次探索</small></span>
                <span className="option-check" aria-hidden="true">✓</span>
              </button>
            </div>
          </fieldset>

          {mode === 'solo' && (
            <fieldset className="setting-group cycle-group">
              <legend>
                <span className="setting-index">02</span>
                <span>此刻的身体状态</span>
              </legend>
              <div className="segmented-control">
                <button
                  className={cycle === 'period' ? 'is-selected' : ''}
                  type="button"
                  aria-pressed={cycle === 'period'}
                  onClick={() => setCycle('period')}
                >
                  经期
                </button>
                <button
                  className={cycle === 'regular' ? 'is-selected' : ''}
                  type="button"
                  aria-pressed={cycle === 'regular'}
                  onClick={() => setCycle('regular')}
                >
                  非经期
                </button>
              </div>
            </fieldset>
          )}

          <fieldset className="setting-group intensity-group">
            <legend>
              <span className="setting-index">{mode === 'solo' ? '03' : '02'}</span>
              <span>选择这次游戏的强度</span>
            </legend>
            <div className="intensity-heading">
              <div>
                <strong>{intensityMeta.label}</strong>
                <p>{intensityMeta.note}</p>
              </div>
              <output htmlFor="intensity">{intensity}<small>/10</small></output>
            </div>
            <div className="range-wrap">
              <input
                id="intensity"
                type="range"
                min="0"
                max="10"
                step="1"
                value={intensity}
                aria-label={`游戏强度：${intensity}`}
                onChange={(event) => setIntensity(Number(event.target.value))}
              />
              <span className="range-marker" aria-hidden="true" />
            </div>
            <div className="intensity-stops" aria-hidden="true">
              {intensityStops.map((stop) => (
                <span key={stop.range}>
                  <strong>{stop.range}</strong>
                  <small>{stop.label}</small>
                </span>
              ))}
            </div>
            <div className="range-ends">
              <span>边缘安抚</span>
              <span>深入探索</span>
            </div>
          </fieldset>
        </div>
      </section>

      <footer className="setup-footer">
        <div className="setup-summary">
          <span>本次设置</span>
          <strong>{summary}</strong>
          <span className="summary-divider" />
          <strong>强度 {intensity}</strong>
          <span>{intensityMeta.label}</span>
        </div>
        <button className="enter-button" type="button" disabled={!canStart} onClick={startSession}>
          进入卡组 <span aria-hidden="true">→</span>
        </button>
      </footer>
    </main>
  );
}
