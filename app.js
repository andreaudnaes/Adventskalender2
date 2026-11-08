// =============================================================
//  Adventskalender
// =============================================================

// Hvilket spill som ligger bak hver luke
const GAMES = {
  1: 'Wordle', 2: 'Zip', 3: 'Connies', 4: 'Pyralinks',
  5: 'Nonogram', 6: 'Strands', 7: 'Kryssord', 8: 'Pips',
  9: 'Wordle', 10: 'Zip', 11: 'Pyralinks', 12: 'Connies',
  13: 'Stort nonogram', 14: 'Strands', 15: 'Sudoku', 16: 'Kryssord',
  17: 'Pyralinks', 18: 'Wordle', 19: 'Zip', 20: 'Dobbel runde: Connies',
  21: 'Nonogram', 22: 'Sudoku', 23: 'Strands', 24: 'Finalen'
};

// Plassering på forsiden: [luke, kolonne, rad]
const LAYOUT = [
  [7, '1', '1'], [15, '2', '1'], [3, '3', '1 / span 2'], [20, '4', '1'],
  [11, '1', '2'], [1, '2', '2'], [18, '4', '2 / span 2'],
  [9, '1 / span 2', '3'], [22, '3', '3'],
  [5, '1', '4 / span 2'], [13, '2', '4'], [24, '3 / span 2', '4'],
  [17, '2', '5'], [2, '3', '5'], [10, '4', '5'],
  [19, '1', '6'], [6, '2 / span 2', '6'], [14, '4', '6 / span 2'],
  [23, '1', '7'], [12, '2', '7 / span 2'], [4, '3', '7'],
  [16, '1', '8'], [21, '3', '8'], [8, '4', '8']
];

// Innholdet i hver luke. Svarene er kodet (base64) så de ikke står i klartekst.
const PUZZLES = {
  1: { type: 'ordgjetting', answer: 'S0FLQU8=' },
  2: {
    type: 'zip',
    size: 8,
    numbers: [[2, 1, 1], [4, 7, 2], [0, 1, 3], [1, 6, 4], [4, 1, 5], [5, 2, 6], [6, 1, 7], [5, 6, 8], [4, 3, 9], [5, 4, 10], [4, 5, 11], [5, 5, 12]],
    solution: 'WzE3LCAxNiwgMjQsIDMyLCA0MCwgNDgsIDU2LCA1NywgNTgsIDU5LCA2MCwgNjEsIDYyLCA2MywgNTUsIDQ3LCAzOSwgMzEsIDIzLCAxNSwgNywgNiwgNSwgNCwgMywgMiwgMSwgMCwgOCwgOSwgMTAsIDExLCAxMiwgMTMsIDE0LCAyMiwgMjEsIDIwLCAxOSwgMTgsIDI2LCAyNSwgMzMsIDM0LCA0MiwgNDEsIDQ5LCA1MCwgNTEsIDUyLCA1MywgNTQsIDQ2LCAzOCwgMzAsIDI5LCAyOCwgMjcsIDM1LCA0MywgNDQsIDM2LCAzNywgNDVd' // kun for testknappen
  },
  5: {
    type: 'nonogram',
    data: 'WyIuLi4uLi5BQUEuLi4uLi4iLCAiLi4uLlJSUlJSUlIuLi4uIiwgIi4uQlIuLi5TLi4uUkUuLiIsICIuQkJSUy4uUy4uU1JFRS4iLCAiLi5SLi5TLlMuUy4uUi4uIiwgIi5SLi4uLlNIUy4uLi5SLiIsICJGUlNTU1NISEhTU1NTUkQiLCAiRlIuLi4uU0hTLi4uLlJEIiwgIi5SLi4uLkxTTC4uLi5SLiIsICIuLlIuLkwuUy5MLi5SLi4iLCAiLktLUi5MLlMuTC5STU0uIiwgIi5LS1JMLi5TLi5MUk1NLiIsICIuLi5MUlJSUlJSUkwuLi4iLCAiLi5MLi4uTk5OLi4uTC4uIiwgIkdHR0dHR0dHR0dHR0dHRyJd',
    colors: {
      R: '#D6AE68', // felg
      S: '#E9D6BF', // eiker
      H: '#B8893F', // nav
      L: '#9C7FA8', // ben
      G: '#4E8A3E', // gress
      A: '#D2402C', // gondol rød
      B: '#3E7CB1', // gondol blå
      E: '#E46A8C', // gondol rosa
      F: '#F2C14E', // gondol gul
      D: '#5E9E4A', // gondol grønn
      K: '#3BA7A0', // gondol turkis
      M: '#F08A24', // gondol oransje
      N: '#8E6CC9'  // gondol lilla
    }
  }
};

// Belønningen som vises når luken er løst.
// Alle luker får «Du klarte det ★». Legg til en luke her for å ha en ekstra tekst under.
const REWARDS = {
};

const TONES = ['#521C50', '#4B1949', '#5A2058'];
const YEAR = 2026;

// -------------------------------------------------------------
//  Dato: hvor mange luker er åpne i dag (norsk tid)?
//  For testing: legg til ?test=6 i adressen for å late som det er 6. desember.
//  HUSK: sett TEST_MODE til false før kalenderen sendes!
// -------------------------------------------------------------
const TEST_MODE = true;

function unlockedDays() {
  if (TEST_MODE) {
    const t = parseInt(new URLSearchParams(location.search).get('test'), 10);
    if (t >= 0 && t <= 24) return t;
  }
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Oslo', year: 'numeric', month: 'numeric', day: 'numeric'
  }).formatToParts(new Date());
  const get = (type) => parseInt(parts.find((p) => p.type === type).value, 10);
  const y = get('year'), m = get('month'), d = get('day');
  if (y > YEAR) return 24;
  if (y < YEAR || m < 12) return 0;
  return Math.min(d, 24);
}

// -------------------------------------------------------------
const $ = (id) => document.getElementById(id);
const today = unlockedDays();
let busy = false;
let toastTimer;

const STAR = '<svg class="star" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l2.6 6.9L22 9.3l-5.8 4.6L18.2 21 12 17l-6.2 4 2-7.1L2 9.3l7.4-.4z"/></svg>';
const LOCK = '<svg class="lock" viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>';

function buildGrid() {
  const grid = $('grid');
  grid.innerHTML = '';
  LAYOUT.forEach(([n, col, row], i) => {
    const locked = n > today;
    const big = col.includes('span') || row.includes('span');

    const slot = document.createElement('div');
    slot.className = 'slot';
    if (big) slot.classList.add('big');
    if (locked) slot.classList.add('locked');
    if (n === today) slot.classList.add('today');
    slot.style.gridColumn = col;
    slot.style.gridRow = row;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'door-btn';
    btn.setAttribute('aria-label', locked
      ? `Luke ${n}, låst til ${n}. desember`
      : `Luke ${n}, ${GAMES[n]}`);

    const inner = document.createElement('span');
    inner.className = 'inner';
    inner.setAttribute('aria-hidden', 'true');

    const door = document.createElement('span');
    door.className = 'door';
    if (n < today) door.classList.add('ajar');
    door.style.background = TONES[i % TONES.length];
    door.innerHTML = (n === 24 ? STAR : '') + `<span class="num">${n}</span>` + (locked ? LOCK : '');

    btn.append(inner, door);
    btn.addEventListener('click', () => pick(n, slot, door));
    slot.append(btn);
    grid.append(slot);
  });

  $('today-label').textContent = today === 0
    ? 'Første luke åpner 1. desember'
    : `I dag: ${today}. desember`;
  $('progress-label').textContent = `${today} av 24 luker klare`;
  requestAnimationFrame(() => { $('bar-fill').style.width = `${(today / 24) * 100}%`; });
}

function pick(n, slot, door) {
  if (busy) return;
  if (n > today) {
    slot.classList.remove('shake');
    void slot.offsetWidth; // start animasjonen på nytt
    slot.classList.add('shake');
    showToast(`Tålmodighet! Luke ${n} åpner ${n}. desember`);
    return;
  }
  busy = true;
  slot.classList.remove('today');
  door.classList.remove('ajar');
  door.classList.add('open');
  setTimeout(() => { location.hash = `luke-${n}`; }, 950);
}

function showToast(text) {
  const t = $('toast');
  t.textContent = text;
  t.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { t.hidden = true; }, 2200);
}

let cleanup = null;
const PLACEHOLDER = $('game-area').innerHTML;

// -------------------------------------------------------------
//  Forklaring av hvert spill (?-knappen). Bare reglene, ikke løsningen.
// -------------------------------------------------------------
const HELP = {
  ordgjetting: {
    intro: 'Gjett ordet på fem bokstaver. Du har seks forsøk.',
    points: [
      'Hvert gjett må være et ekte norsk ord.',
      'Etter hvert gjett farges bokstavene: rosa betyr riktig bokstav på riktig plass, gul betyr at bokstaven finnes i ordet, men på en annen plass, og mørk betyr at den ikke er med.',
      'Samme bokstav kan forekomme flere ganger i ordet.'
    ]
  },
  zip: {
    intro: 'Tegn én sammenhengende linje som fyller hele brettet.',
    points: [
      'Start på 1 og gå innom tallene i rekkefølge. Linjen skal slutte på det høyeste tallet.',
      'Linjen går bare opp, ned eller til siden, aldri på skrå.',
      'Hver rute skal brukes nøyaktig én gang, og linjen kan ikke krysse seg selv.',
      'Dra tilbake eller trykk «Angre» for å fjerne et steg.'
    ]
  },
  connies: {
    intro: 'Finn fire grupper med fire ord som har noe til felles.',
    points: [
      'Marker fire ord du tror hører sammen, og trykk «Send inn».',
      'Pass på feller: noen ord ser ut til å passe i flere grupper, men hvert ord hører bare til én.',
      'Kategoriene kan være alt fra temaer til ordlek, som ord som gjemmer andre ord.',
      '«En unna» betyr at tre av de fire ordene er riktige.',
      'Du kan gjøre fire feil.'
    ]
  },
  pyralinks: {
    intro: 'Sett brikkene sammen til en pyramide der alle koblingene danner ord.',
    points: [
      'Hver brikke danner et ord sammen med brikken rett over seg, og den øverste delen kommer først. JUL over TRE blir for eksempel JULETRE.',
      'Bytt plass på brikker ved å trykke på to brikker etter hverandre, eller ved å dra den ene oppå den andre.',
      'Trykk «Sjekk» for å se hvilke koblinger som er riktige. De blir rosa og henger sammen som en bolk du kan flytte samlet.',
      'Du har fem forsøk.'
    ]
  },
  nonogram: {
    intro: 'Fyll inn ruter slik at et skjult bilde kommer frem.',
    points: [
      'Tallene ved hver rad og kolonne viser hvor lange rekker med fylte ruter det er der, i riktig rekkefølge.',
      'Mellom to rekker er det alltid minst én tom rute.',
      'Bruk «Kryss» til å merke ruter du vet skal være tomme.',
      'Du har tre liv. En feil rute koster ett liv.'
    ]
  },
  strands: {
    intro: 'Finn ordene som passer til dagens tema.',
    points: [
      'Dra over bokstaver som ligger ved siden av hverandre, også på skrå. Ordene kan svinge i alle retninger.',
      'Temaordene fyller hele brettet, og hver bokstav brukes nøyaktig én gang.',
      'Spangrammet beskriver selve temaet og går fra den ene siden av brettet til den motsatte.',
      'Andre ord på minst fire bokstaver fyller opp hint-knappen.'
    ]
  },
  pips: {
    intro: 'Legg alle dominobrikkene på brettet slik at hver rute blir dekket.',
    points: [
      'Fargede soner har en regel: et tall betyr at prikkene i sonen til sammen skal bli akkurat det tallet. < og > betyr mindre eller større enn.',
      '= betyr at alle rutene i sonen skal ha like mange prikker, og ≠ betyr at alle skal være forskjellige.',
      'Ruter uten farge har ingen regel.',
      'Dra brikkene på plass, og trykk på en brikke for å rotere den.'
    ]
  },
  kryssord: {
    intro: 'Løs det lille kryssordet.',
    points: [
      'Trykk på en rute for å velge den. Trykk på samme rute igjen for å bytte mellom vannrett og loddrett.',
      'Hintet for ordet du står på vises øverst. Pilene ved siden av hopper til forrige eller neste hint.',
      'Du kan også trykke på et hint i listen under tastaturet.',
      'Når alle rutene er fylt, sjekkes kryssordet automatisk.'
    ]
  }
};

let lastFocus = null;
function openHelp() {
  const p = PUZZLES[currentDay()];
  const h = p && HELP[p.type];
  if (!h) return;
  $('help-title').textContent = GAMES[currentDay()];
  $('help-intro').textContent = h.intro;
  const list = $('help-list');
  list.innerHTML = '';
  h.points.forEach((t) => { const li = document.createElement('li'); li.textContent = t; list.append(li); });
  lastFocus = document.activeElement;
  $('help').hidden = false;
  $('help-ok').focus();
}
function closeHelp() {
  $('help').hidden = true;
  if (lastFocus) lastFocus.focus();
}
const currentDay = () => { const m = location.hash.match(/^#luke-(\d+)$/); return m ? +m[1] : 0; };
$('help-btn').addEventListener('click', openHelp);
$('help-close').addEventListener('click', closeHelp);
$('help-ok').addEventListener('click', closeHelp);
$('help').addEventListener('click', (e) => { if (e.target === $('help')) closeHelp(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !$('help').hidden) closeHelp(); });

function openGame(n) {
  $('game-date').textContent = `Luke ${n} · ${n}. desember`;
  $('game-day').textContent = n;
  $('game-name').textContent = GAMES[n];

  const area = $('game-area');
  const puzzle = PUZZLES[n];
  const game = puzzle && window.Games && window.Games[puzzle.type];
  if (cleanup) { cleanup(); cleanup = null; }
  $('game').classList.toggle('compact', !!game);
  $('help-btn').hidden = !(game && HELP[puzzle.type]);
  $('help').hidden = true;
  if (game) {
    area.className = 'game-area playing';
    cleanup = game.mount(area, puzzle, n, (won) => showReward(n, won !== false));
  } else {
    area.className = 'game-area';
    area.innerHTML = PLACEHOLDER;
  }

  $('home').hidden = true;
  $('game').hidden = false;
  window.scrollTo(0, 0);
}

// won = false betyr at spillet ble tapt (f.eks. Wordle uten riktig ord)
function showReward(n, won = true) {
  const r = won ? (REWARDS[n] || { title: 'Du klarte det \u2605', text: '' }) : { title: 'Det gikk ikke denne gang. Bedre lykke til i morgen \u2605', text: '' };
  if (!r) return;
  if ($('game-area').querySelector('.reward')) return; // allerede vist
  const card = document.createElement('div');
  card.className = 'reward';
  card.innerHTML = `
    <svg class="reward-star" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l2.6 6.9L22 9.3l-5.8 4.6L18.2 21 12 17l-6.2 4 2-7.1L2 9.3l7.4-.4z"/></svg>
    <p class="reward-title"></p>
    <p class="reward-text"></p>`;
  card.querySelector('.reward-title').textContent = r.title || 'Du klarte det \u2605';
  card.querySelector('.reward-text').textContent = r.text;
  if (!r.text) card.querySelector('.reward-text').remove();
  if (!won) card.classList.add('lost');
  $('game-area').append(card);
  setTimeout(() => card.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 50);
}

function showHome() {
  busy = false;
  if (cleanup) { cleanup(); cleanup = null; }
  $('game').hidden = true;
  $('home').hidden = false;
  buildGrid();
}

function route() {
  const m = location.hash.match(/^#luke-(\d+)$/);
  const n = m ? parseInt(m[1], 10) : 0;
  if (n >= 1 && n <= today) {
    openGame(n);
  } else {
    if (location.hash) history.replaceState(null, '', location.pathname + location.search);
    showHome();
  }
}

$('back').addEventListener('click', () => {
  history.replaceState(null, '', location.pathname + location.search);
  showHome();
});
window.addEventListener('hashchange', route);

// -------------------------------------------------------------
//  Kun for testing: knapper for å starte på nytt og vise løsningen.
//  Vises bare når TEST_MODE er på og adressen har ?test=
//  Forsvinner automatisk når TEST_MODE settes til false.
// -------------------------------------------------------------
if (TEST_MODE && new URLSearchParams(location.search).has('test')) {
  const bar = document.createElement('div');
  bar.className = 'test-bar';
  const reset = document.createElement('button');
  reset.type = 'button';
  reset.className = 'test-btn';
  const solve = document.createElement('button');
  solve.type = 'button';
  solve.className = 'test-btn';
  solve.textContent = 'Test: vis løsning';
  bar.append(solve, reset);
  document.body.append(bar);

  const currentDay = () => {
    const m = location.hash.match(/^#luke-(\d+)$/);
    return m ? parseInt(m[1], 10) : 0;
  };

  const label = () => {
    const n = currentDay();
    reset.textContent = n ? `Test: start luke ${n} på nytt` : 'Test: nullstill alle luker';
    const p = n && PUZZLES[n];
    const g = p && window.Games && window.Games[p.type];
    solve.hidden = !(g && g.solvedState);
  };

  reset.addEventListener('click', () => {
    const n = currentDay();
    try {
      if (n) {
        localStorage.removeItem(`pappa-${n}`);
      } else {
        Object.keys(localStorage)
          .filter((k) => k.startsWith('pappa-'))
          .forEach((k) => localStorage.removeItem(k));
      }
    } catch (e) { /* ignorer */ }
    if (n) openGame(n);
    else showToast('Alle luker er nullstilt');
  });

  solve.addEventListener('click', () => {
    const n = currentDay();
    const p = PUZZLES[n];
    const g = p && window.Games[p.type];
    if (!g || !g.solvedState) return;
    try { localStorage.setItem(`pappa-${n}`, JSON.stringify(g.solvedState(p))); } catch (e) { /* ignorer */ }
    openGame(n);
  });

  window.addEventListener('hashchange', label);
  $('back').addEventListener('click', label);
  label();
}

route();
