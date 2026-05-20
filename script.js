/**
 * LearnHub — script.js
 * Handles: routing, data, lessons, quizzes, progress, settings, search
 * All data persists in localStorage. No external dependencies.
 */

// ═══════════════════════════════════════════════════
// DATA — Lessons
// ═══════════════════════════════════════════════════
const LESSONS = [
  {
    id: 'math-1', category: 'math', title: 'Introduction to Algebra',
    emoji: '📐', difficulty: 'beginner', duration: '12 min', xp: 50,
    description: 'Learn the foundational concepts of algebra including variables, expressions, and equations.',
    content: [
      {
        type: 'text', heading: 'What is Algebra?',
        body: `Algebra is a branch of mathematics dealing with symbols and the rules for manipulating those symbols. These symbols represent quantities without fixed values, known as <em>variables</em>.

At its core, algebra gives us a language to describe relationships and solve problems where some values are unknown.`
      },
      {
        type: 'concept',
        text: '<strong>Key Insight:</strong> A variable is simply a placeholder for a number we don't yet know. We typically use letters like x, y, or z.'
      },
      {
        type: 'text', heading: 'Expressions vs. Equations',
        body: `An <strong>expression</strong> is a combination of numbers, variables, and operations — but no equals sign. Example: <code>3x + 5</code>

An <strong>equation</strong> asserts that two expressions are equal. Example: <code>3x + 5 = 14</code>

The goal in algebra is often to <em>solve</em> an equation — to find the value of the variable that makes it true.`
      },
      {
        type: 'text', heading: 'Solving a Simple Equation',
        body: 'Let\'s solve: 3x + 5 = 14\n\nStep 1: Subtract 5 from both sides → 3x = 9\nStep 2: Divide both sides by 3 → x = 3\n\nAlways perform the same operation on both sides to keep the equation balanced.'
      }
    ]
  },
  {
    id: 'math-2', category: 'math', title: 'Geometry Basics',
    emoji: '🔺', difficulty: 'beginner', duration: '10 min', xp: 50,
    description: 'Explore shapes, angles, and the properties that define them.',
    content: [
      {
        type: 'text', heading: 'Points, Lines & Planes',
        body: 'Geometry begins with three undefined terms: a <strong>point</strong> (a location), a <strong>line</strong> (extends infinitely in two directions), and a <strong>plane</strong> (a flat surface extending infinitely).'
      },
      {
        type: 'concept',
        text: '<strong>Remember:</strong> Two points define exactly one line. Three non-collinear points define exactly one plane.'
      },
      {
        type: 'text', heading: 'Types of Angles',
        body: 'Angles are measured in degrees:\n• Acute angle: less than 90°\n• Right angle: exactly 90°\n• Obtuse angle: between 90° and 180°\n• Straight angle: exactly 180°'
      }
    ]
  },
  {
    id: 'science-1', category: 'science', title: 'Newton\'s Laws of Motion',
    emoji: '🍎', difficulty: 'intermediate', duration: '15 min', xp: 75,
    description: 'Understand the three fundamental laws that govern how objects move.',
    content: [
      {
        type: 'text', heading: 'First Law: Inertia',
        body: 'An object at rest stays at rest, and an object in motion stays in motion at the same speed and in the same direction, unless acted upon by an unbalanced force.\n\nThis tendency of objects to resist changes in their state of motion is called <strong>inertia</strong>.'
      },
      {
        type: 'concept',
        text: '<strong>Real-world example:</strong> When a car brakes suddenly, passengers lurch forward. Their bodies want to continue moving at the original speed.'
      },
      {
        type: 'text', heading: 'Second Law: Force = Mass × Acceleration',
        body: 'The acceleration of an object depends on two things: the net force applied and the object\'s mass.\n\nFormula: F = ma\n\nA larger force produces greater acceleration. A larger mass requires more force to achieve the same acceleration.'
      },
      {
        type: 'text', heading: 'Third Law: Action-Reaction',
        body: 'For every action, there is an equal and opposite reaction. Forces always come in pairs — action and reaction act on different objects.\n\nExample: A rocket pushes exhaust downward (action), and the exhaust pushes the rocket upward (reaction).'
      }
    ]
  },
  {
    id: 'science-2', category: 'science', title: 'The Periodic Table',
    emoji: '⚗️', difficulty: 'beginner', duration: '14 min', xp: 60,
    description: 'Discover how elements are organized and what their arrangement tells us.',
    content: [
      {
        type: 'text', heading: 'Organisation of Elements',
        body: 'The periodic table arranges all known chemical elements in rows (periods) and columns (groups) based on their atomic number and properties.\n\nElements in the same group share similar chemical properties because they have the same number of valence electrons.'
      },
      {
        type: 'concept',
        text: '<strong>Key fact:</strong> The atomic number equals the number of protons in an atom\'s nucleus, which defines what element it is.'
      },
      {
        type: 'text', heading: 'Metals, Metalloids & Nonmetals',
        body: 'About 75% of elements are metals (left side). Nonmetals sit on the upper-right. Metalloids form a diagonal staircase between them, sharing properties of both.\n\nMetals conduct electricity well; nonmetals generally do not.'
      }
    ]
  },
  {
    id: 'code-1', category: 'code', title: 'JavaScript Fundamentals',
    emoji: '⚡', difficulty: 'beginner', duration: '20 min', xp: 80,
    description: 'Learn variables, functions, and control flow in modern JavaScript.',
    content: [
      {
        type: 'text', heading: 'Variables in JavaScript',
        body: 'JavaScript has three ways to declare variables: <code>var</code> (old, avoid), <code>let</code> (block-scoped, reassignable), and <code>const</code> (block-scoped, not reassignable).'
      },
      {
        type: 'code',
        text: `// Prefer const by default\nconst name = 'LearnHub';\n\n// Use let when you need to reassign\nlet score = 0;\nscore = score + 10;\n\nconsole.log(name, score); // "LearnHub" 10`
      },
      {
        type: 'text', heading: 'Functions',
        body: 'Functions encapsulate reusable logic. Modern JavaScript supports both function declarations and arrow functions.'
      },
      {
        type: 'code',
        text: `// Arrow function (modern)\nconst greet = (user) => {\n  return \`Hello, \${user}!\`;\n};\n\nconsole.log(greet('World')); // "Hello, World!"`
      },
      {
        type: 'concept',
        text: '<strong>Best practice:</strong> Use <code>const</code> for everything by default. Only switch to <code>let</code> when you know the value will change.'
      }
    ]
  },
  {
    id: 'code-2', category: 'code', title: 'CSS Layout with Flexbox',
    emoji: '🎨', difficulty: 'intermediate', duration: '18 min', xp: 75,
    description: 'Master the Flexbox model to build responsive, modern layouts.',
    content: [
      {
        type: 'text', heading: 'What is Flexbox?',
        body: 'Flexbox (Flexible Box Layout) is a CSS layout model designed to distribute space along a single axis — either row or column — making alignment and distribution of items intuitive.'
      },
      {
        type: 'code',
        text: `.container {\n  display: flex;\n  justify-content: space-between; /* main axis */\n  align-items: center;            /* cross axis */\n  gap: 16px;\n}`
      },
      {
        type: 'concept',
        text: '<strong>Key concept:</strong> <code>justify-content</code> aligns items along the main axis; <code>align-items</code> aligns them on the cross axis.'
      },
      {
        type: 'text', heading: 'Common Properties',
        body: '• flex-direction: row | column\n• flex-wrap: nowrap | wrap\n• justify-content: flex-start | center | space-between | space-around\n• align-items: stretch | center | flex-start | flex-end\n• flex: shorthand for flex-grow, flex-shrink, flex-basis'
      }
    ]
  },
  {
    id: 'history-1', category: 'history', title: 'The Renaissance',
    emoji: '🏛️', difficulty: 'intermediate', duration: '16 min', xp: 70,
    description: 'Explore the cultural rebirth that transformed Europe from the 14th to 17th century.',
    content: [
      {
        type: 'text', heading: 'What Was the Renaissance?',
        body: 'The Renaissance — French for "rebirth" — was a period of European cultural, artistic, political, and scientific flourishing that began in Italy in the 14th century before spreading across Europe.'
      },
      {
        type: 'concept',
        text: '<strong>Core idea:</strong> Renaissance thinkers championed <em>humanism</em> — a focus on human potential and achievement rather than purely religious themes.'
      },
      {
        type: 'text', heading: 'Key Figures',
        body: 'Leonardo da Vinci embodied the "Renaissance man" ideal — excelling in painting, sculpture, architecture, science, and engineering.\n\nMichelangelo created iconic works like the Sistine Chapel ceiling and the statue of David.\n\nNiccolò Machiavelli wrote "The Prince," laying groundwork for modern political thought.'
      },
      {
        type: 'text', heading: 'Legacy',
        body: 'The Renaissance led directly to the Scientific Revolution and Enlightenment. It fundamentally changed how people understood humanity\'s place in the universe, shifting from purely theological frameworks toward empirical observation and individual reason.'
      }
    ]
  },
  {
    id: 'language-1', category: 'language', title: 'How Languages Are Structured',
    emoji: '🗣️', difficulty: 'beginner', duration: '13 min', xp: 55,
    description: 'Discover phonetics, morphology, and syntax — the building blocks of every language.',
    content: [
      {
        type: 'text', heading: 'Linguistics: The Science of Language',
        body: 'Linguistics studies the structure, meaning, and use of human language. Every known human language — all 7,000+ of them — shares certain structural features, suggesting an innate human capacity for language.'
      },
      {
        type: 'text', heading: 'Phonetics & Phonology',
        body: '<strong>Phonetics</strong> studies the physical sounds of speech. English uses about 44 distinct sounds (phonemes) despite having only 26 letters.\n\n<strong>Phonology</strong> studies how sounds function within a particular language system.'
      },
      {
        type: 'concept',
        text: '<strong>Fascinating fact:</strong> Babies are born capable of distinguishing every sound in every human language. By 12 months, they\'ve specialized to the sounds of their native language.'
      },
      {
        type: 'text', heading: 'Syntax: Building Sentences',
        body: 'Syntax governs how words combine into sentences. English follows Subject-Verb-Object order: "The cat [S] chased [V] the mouse [O]."\n\nJapanese uses Subject-Object-Verb. Arabic often uses Verb-Subject-Object. The order differs, but all languages have systematic rules.'
      }
    ]
  },
  {
    id: 'math-3', category: 'math', title: 'Probability & Statistics',
    emoji: '🎲', difficulty: 'intermediate', duration: '17 min', xp: 75,
    description: 'Understand chance, data distributions, and how to draw conclusions from data.',
    content: [
      {
        type: 'text', heading: 'What is Probability?',
        body: 'Probability measures the likelihood of an event occurring, expressed as a number between 0 (impossible) and 1 (certain).\n\nFormula: P(event) = favorable outcomes ÷ total possible outcomes'
      },
      {
        type: 'concept',
        text: '<strong>Example:</strong> Rolling a 6 on a fair die: P(6) = 1/6 ≈ 0.167 (16.7% chance).'
      },
      {
        type: 'text', heading: 'Mean, Median & Mode',
        body: 'These three measures describe the "center" of a dataset:\n\n• Mean: sum of all values ÷ count (sensitive to outliers)\n• Median: the middle value when sorted (robust to outliers)\n• Mode: the most frequently occurring value'
      }
    ]
  },
  {
    id: 'code-3', category: 'code', title: 'Data Structures: Arrays & Objects',
    emoji: '🗂️', difficulty: 'advanced', duration: '22 min', xp: 100,
    description: 'Deep dive into arrays and objects — the backbone of data in programming.',
    content: [
      {
        type: 'text', heading: 'Arrays',
        body: 'An array is an ordered collection of values, accessed by numeric index (starting at 0). Arrays can hold any type of value — numbers, strings, objects, even other arrays.'
      },
      {
        type: 'code',
        text: `const fruits = ['apple', 'banana', 'cherry'];\n\nconsole.log(fruits[0]); // 'apple'\nconsole.log(fruits.length); // 3\n\n// Common methods\nfruits.push('date');         // add to end\nfruits.pop();                // remove from end\nconst upper = fruits.map(f => f.toUpperCase());`
      },
      {
        type: 'text', heading: 'Objects',
        body: 'An object stores key-value pairs. Keys are strings (or Symbols); values can be anything. Objects model real-world entities with properties.'
      },
      {
        type: 'code',
        text: `const user = {\n  name: 'Alex',\n  score: 420,\n  isActive: true\n};\n\nconsole.log(user.name);       // 'Alex'\nconsole.log(user['score']);   // 420\n\n// Destructuring\nconst { name, score } = user;`
      },
      {
        type: 'concept',
        text: '<strong>Rule of thumb:</strong> Use arrays for ordered lists of similar items. Use objects to describe an entity with named properties.'
      }
    ]
  }
];

// ═══════════════════════════════════════════════════
// DATA — Quizzes
// ═══════════════════════════════════════════════════
const QUIZZES = [
  {
    id: 'quiz-math', title: 'Algebra & Numbers', icon: '📐',
    description: 'Test your mathematical reasoning across algebra and number theory.',
    questions: 5, xp: 100,
    items: [
      {
        q: 'What is the value of x in the equation: 2x + 4 = 14?',
        options: ['x = 3', 'x = 5', 'x = 9', 'x = 7'],
        answer: 1,
        explanation: 'Subtract 4 from both sides: 2x = 10. Then divide by 2: x = 5.'
      },
      {
        q: 'Which of these is NOT a prime number?',
        options: ['7', '11', '15', '17'],
        answer: 2,
        explanation: '15 = 3 × 5, so it has factors other than 1 and itself.'
      },
      {
        q: 'What is the area of a rectangle with width 6 and height 9?',
        options: ['15', '30', '54', '45'],
        answer: 2,
        explanation: 'Area = width × height = 6 × 9 = 54.'
      },
      {
        q: 'Simplify: 3(x + 4) − 2x',
        options: ['x + 4', 'x + 12', '5x + 12', 'x − 12'],
        answer: 1,
        explanation: '3x + 12 − 2x = x + 12.'
      },
      {
        q: 'What is 25% of 80?',
        options: ['15', '20', '25', '40'],
        answer: 1,
        explanation: '25% = 0.25. 0.25 × 80 = 20.'
      }
    ]
  },
  {
    id: 'quiz-science', title: 'Physics & Chemistry', icon: '🔬',
    description: 'Challenge your understanding of the physical world.',
    questions: 5, xp: 100,
    items: [
      {
        q: 'According to Newton\'s Second Law, if force doubles and mass stays constant, acceleration:',
        options: ['Stays the same', 'Doubles', 'Halves', 'Quadruples'],
        answer: 1,
        explanation: 'F = ma → a = F/m. If F doubles and m is constant, a doubles.'
      },
      {
        q: 'What is the chemical symbol for Gold?',
        options: ['Go', 'Gd', 'Au', 'Ag'],
        answer: 2,
        explanation: 'Gold\'s symbol Au comes from the Latin "Aurum".'
      },
      {
        q: 'Which of these is a noble gas?',
        options: ['Oxygen', 'Nitrogen', 'Neon', 'Hydrogen'],
        answer: 2,
        explanation: 'Neon (Ne) is a noble gas — group 18 of the periodic table.'
      },
      {
        q: 'What is the approximate speed of light?',
        options: ['300 km/s', '3,000 km/s', '300,000 km/s', '3,000,000 km/s'],
        answer: 2,
        explanation: 'Light travels at approximately 299,792 km/s — roughly 300,000 km/s.'
      },
      {
        q: 'What type of bond involves sharing electrons between atoms?',
        options: ['Ionic bond', 'Covalent bond', 'Hydrogen bond', 'Metallic bond'],
        answer: 1,
        explanation: 'A covalent bond is formed when atoms share electron pairs.'
      }
    ]
  },
  {
    id: 'quiz-code', title: 'JavaScript & Web Dev', icon: '💻',
    description: 'Prove your programming knowledge with real coding questions.',
    questions: 5, xp: 120,
    items: [
      {
        q: 'Which keyword declares a block-scoped variable that CAN be reassigned?',
        options: ['var', 'let', 'const', 'def'],
        answer: 1,
        explanation: '`let` is block-scoped and allows reassignment. `const` is block-scoped but not reassignable.'
      },
      {
        q: 'What does `console.log(typeof [])` output in JavaScript?',
        options: ['"array"', '"list"', '"object"', '"undefined"'],
        answer: 2,
        explanation: 'Arrays in JavaScript are objects. typeof [] returns "object".'
      },
      {
        q: 'Which CSS property controls alignment along the main Flexbox axis?',
        options: ['align-items', 'align-content', 'justify-content', 'flex-direction'],
        answer: 2,
        explanation: 'justify-content aligns items along the main axis (horizontal by default).'
      },
      {
        q: 'What is the output of: [1,2,3].map(x => x * 2)?',
        options: ['[2,4,6]', '6', '[1,2,3,2]', 'undefined'],
        answer: 0,
        explanation: '.map() returns a new array. Each element is multiplied by 2: [2, 4, 6].'
      },
      {
        q: 'Which method converts a JSON string to a JavaScript object?',
        options: ['JSON.stringify()', 'JSON.parse()', 'JSON.decode()', 'JSON.convert()'],
        answer: 1,
        explanation: 'JSON.parse() converts a JSON string into a JavaScript object. JSON.stringify() does the reverse.'
      }
    ]
  },
  {
    id: 'quiz-history', title: 'World History', icon: '🏛️',
    description: 'Test your knowledge of historical events and civilizations.',
    questions: 4, xp: 90,
    items: [
      {
        q: 'In which century did the Renaissance begin?',
        options: ['12th century', '13th century', '14th century', '16th century'],
        answer: 2,
        explanation: 'The Renaissance began in Italy in the 14th century (1300s).'
      },
      {
        q: 'Who wrote "The Prince," a foundational text of political theory?',
        options: ['Dante Alighieri', 'Leonardo da Vinci', 'Niccolò Machiavelli', 'Galileo Galilei'],
        answer: 2,
        explanation: 'Niccolò Machiavelli wrote "The Prince" in 1513.'
      },
      {
        q: 'What does "Renaissance" mean in French?',
        options: ['Revolution', 'Rebirth', 'Renewal of faith', 'Age of reason'],
        answer: 1,
        explanation: 'Renaissance is French for "rebirth," reflecting the period\'s revival of classical learning.'
      },
      {
        q: 'Which artist painted the Sistine Chapel ceiling?',
        options: ['Leonardo da Vinci', 'Raphael', 'Donatello', 'Michelangelo'],
        answer: 3,
        explanation: 'Michelangelo painted the Sistine Chapel ceiling between 1508 and 1512.'
      }
    ]
  }
];

// ═══════════════════════════════════════════════════
// STATE & STORAGE
// ═══════════════════════════════════════════════════
const DEFAULT_STATE = {
  theme: 'dark',
  accent: 'cyan',
  reduceMotion: false,
  xpAnimations: true,
  dailyGoal: 3,
  displayName: 'Learner',
  avatarEmoji: '🧠',
  completedLessons: [],   // lesson ids
  lessonProgress: {},     // id -> 0-100
  quizHistory: [],        // { quizId, score, total, date }
  totalXP: 0,
  streak: 0,
  lastActiveDate: null,
};

function loadState() {
  try {
    const saved = localStorage.getItem('learnhub_state');
    return saved ? { ...DEFAULT_STATE, ...JSON.parse(saved) } : { ...DEFAULT_STATE };
  } catch { return { ...DEFAULT_STATE }; }
}

function saveState() {
  try { localStorage.setItem('learnhub_state', JSON.stringify(state)); } catch {}
}

let state = loadState();

// ═══════════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  applyTheme();
  applyAccent();
  applyReduceMotion();
  updateStreak();
  renderDashboard();
  renderLessonsGrid('all');
  renderQuizList();
  renderProgress();
  renderProfile();
  syncSettingsUI();
  wireNavigation();
  wireSearch();
  wireMobileMenu();
  wireSettings();
  setDashboardGreeting();
});

// ═══════════════════════════════════════════════════
// THEME & APPEARANCE
// ═══════════════════════════════════════════════════
function applyTheme() {
  document.documentElement.setAttribute('data-theme', state.theme);
  document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.theme === state.theme);
  });
}

function applyAccent() {
  document.documentElement.setAttribute('data-accent', state.accent);
  document.querySelectorAll('.swatch').forEach(s => {
    s.classList.toggle('active', s.dataset.accent === state.accent);
  });
}

function applyReduceMotion() {
  document.body.classList.toggle('reduce-motion', state.reduceMotion);
}

// ═══════════════════════════════════════════════════
// STREAK & XP HELPERS
// ═══════════════════════════════════════════════════
function updateStreak() {
  const today = new Date().toDateString();
  if (state.lastActiveDate === today) return;
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  if (state.lastActiveDate === yesterday) {
    state.streak = (state.streak || 0) + 1;
  } else if (state.lastActiveDate !== today) {
    state.streak = state.lastActiveDate ? 0 : (state.streak || 0);
  }
  state.lastActiveDate = today;
  saveState();
}

function awardXP(amount, label) {
  state.totalXP = (state.totalXP || 0) + amount;
  saveState();
  if (state.xpAnimations) showXPToast(`+${amount} XP — ${label}`);
  // Update stat displays
  const el = document.getElementById('statXP');
  if (el) animateCount(el, state.totalXP - amount, state.totalXP);
}

function animateCount(el, from, to) {
  const dur = 600;
  const start = performance.now();
  function step(now) {
    const t = Math.min((now - start) / dur, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.round(from + (to - from) * eased);
    if (t < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function showXPToast(message) {
  const toast = document.getElementById('xpToast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2800);
}

// ═══════════════════════════════════════════════════
// GREETING
// ═══════════════════════════════════════════════════
function setDashboardGreeting() {
  const h = new Date().getHours();
  const tod = h < 12 ? 'morning' : h < 17 ? 'afternoon' : 'evening';
  const name = state.displayName || 'Learner';
  const el = document.getElementById('dashGreeting');
  if (el) el.textContent = `Good ${tod}, ${name}`;
}

// ═══════════════════════════════════════════════════
// NAVIGATION
// ═══════════════════════════════════════════════════
function wireNavigation() {
  document.querySelectorAll('[data-page]').forEach(btn => {
    btn.addEventListener('click', () => {
      const page = btn.dataset.page;
      navigateTo(page);
      // Close mobile menu
      closeMobileMenu();
    });
  });

  document.getElementById('backToLearning').addEventListener('click', () => navigateTo('learning'));
  document.getElementById('dailyChallengeBtn').addEventListener('click', () => {
    navigateTo('quiz');
    setTimeout(() => {
      const firstCard = document.querySelector('.quiz-card');
      if (firstCard) firstCard.click();
    }, 100);
  });
}

function navigateTo(page) {
  // Update pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById(`page-${page}`);
  if (target) target.classList.add('active');

  // Update nav items
  document.querySelectorAll('.nav-item').forEach(n => {
    n.classList.toggle('active', n.dataset.page === page);
  });

  // Re-render dynamic pages
  if (page === 'home') { renderDashboard(); setDashboardGreeting(); }
  if (page === 'progress') renderProgress();
  if (page === 'profile') renderProfile();
  if (page === 'settings') syncSettingsUI();

  // Scroll to top
  document.getElementById('mainContent').scrollTop = 0;
  window.scrollTo(0, 0);
}

// ═══════════════════════════════════════════════════
// MOBILE MENU
// ═══════════════════════════════════════════════════
function wireMobileMenu() {
  const btn = document.getElementById('hamburgerBtn');
  const overlay = document.getElementById('sidebarOverlay');
  const mobileSearch = document.getElementById('mobileSearchBtn');

  btn.addEventListener('click', toggleMobileMenu);
  overlay.addEventListener('click', closeMobileMenu);
  mobileSearch.addEventListener('click', openSearch);
}

function toggleMobileMenu() {
  const sidebar = document.getElementById('sidebar');
  const btn = document.getElementById('hamburgerBtn');
  const overlay = document.getElementById('sidebarOverlay');
  sidebar.classList.toggle('open');
  btn.classList.toggle('open');
  overlay.classList.toggle('visible');
}

function closeMobileMenu() {
  const sidebar = document.getElementById('sidebar');
  const btn = document.getElementById('hamburgerBtn');
  const overlay = document.getElementById('sidebarOverlay');
  sidebar.classList.remove('open');
  btn.classList.remove('open');
  overlay.classList.remove('visible');
}

// ═══════════════════════════════════════════════════
// SEARCH
// ═══════════════════════════════════════════════════
function wireSearch() {
  const wrap = document.getElementById('searchBarWrap');
  const input = document.getElementById('searchInput');
  const results = document.getElementById('searchResults');

  document.getElementById('searchToggle').addEventListener('click', openSearch);
  document.getElementById('searchToggle2')?.addEventListener('click', openSearch);

  // Close on overlay click or Escape
  wrap.addEventListener('click', (e) => { if (e.target === wrap) closeSearch(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeSearch();
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); openSearch(); }
  });

  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    if (!q) { results.innerHTML = ''; return; }

    const hits = LESSONS.filter(l =>
      l.title.toLowerCase().includes(q) ||
      l.description.toLowerCase().includes(q) ||
      l.category.toLowerCase().includes(q)
    ).slice(0, 6);

    const quizHits = QUIZZES.filter(qz =>
      qz.title.toLowerCase().includes(q) ||
      qz.description.toLowerCase().includes(q)
    ).slice(0, 3);

    if (!hits.length && !quizHits.length) {
      results.innerHTML = `<div class="search-result-item"><div class="search-result-text"><div class="search-result-title">No results found</div></div></div>`;
      return;
    }

    results.innerHTML = [
      ...hits.map(l => `
        <div class="search-result-item" data-action="lesson" data-id="${l.id}">
          <div class="search-result-icon">${l.emoji}</div>
          <div class="search-result-text">
            <div class="search-result-title">${l.title}</div>
            <div class="search-result-sub">Lesson · ${l.category}</div>
          </div>
        </div>`),
      ...quizHits.map(qz => `
        <div class="search-result-item" data-action="quiz" data-id="${qz.id}">
          <div class="search-result-icon">${qz.icon}</div>
          <div class="search-result-text">
            <div class="search-result-title">${qz.title}</div>
            <div class="search-result-sub">Quiz · ${qz.questions} questions</div>
          </div>
        </div>`)
    ].join('');

    results.querySelectorAll('.search-result-item').forEach(item => {
      item.addEventListener('click', () => {
        closeSearch();
        if (item.dataset.action === 'lesson') openLesson(item.dataset.id);
        if (item.dataset.action === 'quiz') startQuiz(item.dataset.id);
      });
    });
  });
}

function openSearch() {
  const wrap = document.getElementById('searchBarWrap');
  wrap.classList.add('open');
  setTimeout(() => document.getElementById('searchInput').focus(), 50);
}

function closeSearch() {
  const wrap = document.getElementById('searchBarWrap');
  wrap.classList.remove('open');
  document.getElementById('searchInput').value = '';
  document.getElementById('searchResults').innerHTML = '';
}

// ═══════════════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════════════
function renderDashboard() {
  // Stats
  document.getElementById('statLessons').textContent = state.completedLessons.length;
  document.getElementById('statQuizzes').textContent = state.quizHistory.length;
  document.getElementById('statStreak').textContent = state.streak;
  document.getElementById('statXP').textContent = state.totalXP;

  // Continue learning: show in-progress or first few lessons
  const grid = document.getElementById('continueLearningGrid');
  const toShow = LESSONS.filter(l => !state.completedLessons.includes(l.id)).slice(0, 3);
  if (!toShow.length) {
    grid.innerHTML = `<div class="empty-state"><div class="empty-state-icon">✨</div><p>All lessons complete! You're amazing.</p></div>`;
    return;
  }
  grid.innerHTML = toShow.map(l => lessonCardHTML(l)).join('');
  grid.querySelectorAll('.lesson-card').forEach(card => {
    card.addEventListener('click', () => openLesson(card.dataset.id));
  });
}

// ═══════════════════════════════════════════════════
// LESSONS
// ═══════════════════════════════════════════════════
function renderLessonsGrid(filter) {
  const grid = document.getElementById('lessonsGrid');
  const filtered = filter === 'all' ? LESSONS : LESSONS.filter(l => l.category === filter);
  grid.innerHTML = filtered.map(l => lessonCardHTML(l)).join('');
  grid.querySelectorAll('.lesson-card').forEach(card => {
    card.addEventListener('click', () => openLesson(card.dataset.id));
  });
}

function lessonCardHTML(lesson) {
  const prog = state.lessonProgress[lesson.id] || 0;
  const done = state.completedLessons.includes(lesson.id);
  const bannerColors = {
    math: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)',
    science: 'linear-gradient(135deg, #0f1f1a 0%, #064e3b 100%)',
    code: 'linear-gradient(135deg, #1a0f2e 0%, #3b1f6e 100%)',
    history: 'linear-gradient(135deg, #1f1008 0%, #5f2b05 100%)',
    language: 'linear-gradient(135deg, #1a0f1f 0%, #6e1f5c 100%)',
  };
  const bg = bannerColors[lesson.category] || bannerColors.math;

  return `
    <div class="lesson-card" data-id="${lesson.id}">
      <div class="lesson-card-banner" style="background: ${bg}">
        ${lesson.emoji}
        ${done ? '<div style="position:absolute;top:10px;right:10px;background:rgba(16,185,129,0.9);color:#fff;font-size:11px;font-weight:700;padding:3px 8px;border-radius:99px;z-index:1">✓ Done</div>' : ''}
      </div>
      <div class="lesson-card-body">
        <p class="lesson-card-category">${lesson.category}</p>
        <h3 class="lesson-card-title">${lesson.title}</h3>
        <div class="lesson-card-meta">
          <span class="difficulty-badge diff-${lesson.difficulty}">${lesson.difficulty}</span>
          <span>${lesson.duration} · ${lesson.xp} XP</span>
        </div>
        <div class="lesson-progress-bar">
          <div class="lesson-progress-fill" style="width: ${done ? 100 : prog}%"></div>
        </div>
      </div>
    </div>`;
}

// Category filter
document.getElementById('categoryFilter').addEventListener('click', (e) => {
  const chip = e.target.closest('.filter-chip');
  if (!chip) return;
  document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
  chip.classList.add('active');
  renderLessonsGrid(chip.dataset.filter);
});

// ─── LESSON VIEWER ───
function openLesson(id) {
  const lesson = LESSONS.find(l => l.id === id);
  if (!lesson) return;

  const viewer = document.getElementById('lessonViewer');
  const done = state.completedLessons.includes(id);

  const contentHTML = lesson.content.map(block => {
    if (block.type === 'text') {
      return `<div class="lesson-content-block">
        ${block.heading ? `<h3>${block.heading}</h3>` : ''}
        ${block.body.split('\n\n').map(p => `<p>${p}</p>`).join('')}
      </div>`;
    }
    if (block.type === 'concept') {
      return `<div class="lesson-content-block">
        <div class="lesson-key-concept">${block.text}</div>
      </div>`;
    }
    if (block.type === 'code') {
      return `<div class="lesson-content-block">
        <div class="lesson-code-block">${escapeHTML(block.text)}</div>
      </div>`;
    }
    return '';
  }).join('');

  viewer.innerHTML = `
    <div class="lesson-viewer-header">
      <div class="lesson-viewer-banner-emoji">${lesson.emoji}</div>
      <p class="lesson-viewer-category">${lesson.category}</p>
      <h1 class="lesson-viewer-title">${lesson.title}</h1>
      <div class="lesson-viewer-meta">
        <span>⏱ ${lesson.duration}</span>
        <span class="difficulty-badge diff-${lesson.difficulty}">${lesson.difficulty}</span>
        <span>⬡ ${lesson.xp} XP</span>
      </div>
    </div>
    ${contentHTML}
    <div class="lesson-complete-bar">
      <p>${done ? '<strong>✓ Lesson completed!</strong> You\'ve already earned the XP.' : 'Ready to mark this lesson as complete?'}</p>
      <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap">
        ${!done ? `<button class="btn-primary" id="markCompleteBtn">Mark Complete · +${lesson.xp} XP</button>` : '<span style="color:var(--accent);font-size:14px;font-weight:600">✓ Complete</span>'}
        <button class="btn-secondary" id="goToRelatedQuiz">Take a Quiz →</button>
      </div>
    </div>`;

  if (!done) {
    document.getElementById('markCompleteBtn').addEventListener('click', () => {
      completeLesson(id);
      openLesson(id); // re-render to show complete state
    });
  }
  document.getElementById('goToRelatedQuiz').addEventListener('click', () => navigateTo('quiz'));

  navigateTo('lesson');
}

function completeLesson(id) {
  const lesson = LESSONS.find(l => l.id === id);
  if (!lesson || state.completedLessons.includes(id)) return;
  state.completedLessons.push(id);
  state.lessonProgress[id] = 100;
  saveState();
  awardXP(lesson.xp, lesson.title);
}

function escapeHTML(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ═══════════════════════════════════════════════════
// QUIZZES
// ═══════════════════════════════════════════════════
function renderQuizList() {
  const container = document.getElementById('quizContainer');
  container.innerHTML = QUIZZES.map(qz => {
    const taken = state.quizHistory.filter(h => h.quizId === qz.id).length;
    const best = state.quizHistory
      .filter(h => h.quizId === qz.id)
      .reduce((acc, h) => Math.max(acc, Math.round(h.score / h.total * 100)), 0);
    return `
      <div class="quiz-card" data-quiz-id="${qz.id}">
        <div class="quiz-card-icon">${qz.icon}</div>
        <h3 class="quiz-card-title">${qz.title}</h3>
        <p class="quiz-card-desc">${qz.description}</p>
        <div class="quiz-card-meta">
          <span>◎ ${qz.questions} questions</span>
          <span>⬡ ${qz.xp} XP</span>
          ${taken ? `<span style="color:var(--accent)">Best: ${best}%</span>` : ''}
        </div>
      </div>`;
  }).join('');

  container.querySelectorAll('.quiz-card').forEach(card => {
    card.addEventListener('click', () => startQuiz(card.dataset.quizId));
  });
}

// ─── QUIZ RUNNER ───
let currentQuiz = null;
let currentQIndex = 0;
let currentAnswers = [];

function startQuiz(quizId) {
  currentQuiz = QUIZZES.find(q => q.id === quizId);
  if (!currentQuiz) return;
  currentQIndex = 0;
  currentAnswers = new Array(currentQuiz.items.length).fill(null);
  navigateTo('quiz-active');
  renderQuizQuestion();
}

function renderQuizQuestion() {
  const wrap = document.getElementById('quizActiveWrap');
  const q = currentQuiz.items[currentQIndex];
  const total = currentQuiz.items.length;
  const pct = (currentQIndex / total) * 100;
  const answered = currentAnswers[currentQIndex];

  wrap.innerHTML = `
    <div class="quiz-progress-header">
      <button class="back-btn" id="quizBackBtn">← Quit Quiz</button>
      <span>Question ${currentQIndex + 1} of ${total}</span>
    </div>
    <div class="quiz-progress-track">
      <div class="quiz-progress-fill" style="width:${pct}%"></div>
    </div>
    <div class="quiz-question-card">
      <p class="quiz-q-num">${currentQuiz.title}</p>
      <h2 class="quiz-question">${q.q}</h2>
      <div class="quiz-options">
        ${q.options.map((opt, i) => `
          <button class="quiz-option ${answered !== null ? (i === q.answer ? 'correct' : (i === answered ? 'wrong' : '')) : ''}"
            data-index="${i}" ${answered !== null ? 'disabled' : ''}>
            ${opt}
          </button>`).join('')}
      </div>
      ${answered !== null ? `
        <div class="quiz-feedback ${answered === q.answer ? 'correct' : 'wrong'}">
          ${answered === q.answer ? '✓ Correct! ' : '✗ Incorrect. '} ${q.explanation}
        </div>` : ''}
    </div>
    <div class="quiz-nav">
      ${answered !== null ? `
        <button class="btn-primary" id="quizNextBtn">
          ${currentQIndex < total - 1 ? 'Next Question →' : 'See Results →'}
        </button>` : ''}
    </div>`;

  document.getElementById('quizBackBtn').addEventListener('click', () => navigateTo('quiz'));

  if (answered === null) {
    wrap.querySelectorAll('.quiz-option').forEach(opt => {
      opt.addEventListener('click', () => {
        const idx = parseInt(opt.dataset.index);
        currentAnswers[currentQIndex] = idx;
        renderQuizQuestion();
      });
    });
  } else {
    document.getElementById('quizNextBtn')?.addEventListener('click', () => {
      if (currentQIndex < currentQuiz.items.length - 1) {
        currentQIndex++;
        renderQuizQuestion();
      } else {
        showQuizResults();
      }
    });
  }
}

function showQuizResults() {
  const correct = currentAnswers.filter((ans, i) => ans === currentQuiz.items[i].answer).length;
  const total = currentQuiz.items.length;
  const pct = Math.round((correct / total) * 100);
  const earnedXP = Math.round(currentQuiz.xp * (correct / total));

  // Save history
  state.quizHistory.push({
    quizId: currentQuiz.id,
    score: correct,
    total,
    date: new Date().toISOString()
  });
  saveState();
  awardXP(earnedXP, `${currentQuiz.title} Quiz`);

  const wrap = document.getElementById('quizActiveWrap');
  wrap.innerHTML = `
    <div class="quiz-results">
      <div class="quiz-results-score">${pct}%</div>
      <div class="quiz-results-label">${correct} out of ${total} correct</div>
      <div class="quiz-results-detail">You earned <strong style="color:var(--accent)">${earnedXP} XP</strong></div>
      <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
        <button class="btn-primary" id="retryQuizBtn">Try Again</button>
        <button class="btn-secondary" id="backToQuizzesBtn">All Quizzes</button>
      </div>
    </div>`;

  document.getElementById('retryQuizBtn').addEventListener('click', () => startQuiz(currentQuiz.id));
  document.getElementById('backToQuizzesBtn').addEventListener('click', () => {
    renderQuizList();
    navigateTo('quiz');
  });
}

// ═══════════════════════════════════════════════════
// PROGRESS PAGE
// ═══════════════════════════════════════════════════
function renderProgress() {
  const container = document.getElementById('progressContent');
  const totalLessons = LESSONS.length;
  const done = state.completedLessons.length;
  const pct = totalLessons ? Math.round((done / totalLessons) * 100) : 0;
  const quizzesTaken = state.quizHistory.length;
  const avgScore = quizzesTaken
    ? Math.round(state.quizHistory.reduce((a, h) => a + h.score / h.total * 100, 0) / quizzesTaken)
    : 0;

  // Progress by category
  const categories = ['math', 'science', 'code', 'history', 'language'];
  const catLabels = { math: 'Mathematics', science: 'Science', code: 'Programming', history: 'History', language: 'Language' };

  const topicBars = categories.map(cat => {
    const catLessons = LESSONS.filter(l => l.category === cat);
    const catDone = catLessons.filter(l => state.completedLessons.includes(l.id)).length;
    const catPct = catLessons.length ? Math.round(catDone / catLessons.length * 100) : 0;
    return `
      <div class="topic-progress-item">
        <div class="topic-progress-header">
          <span class="topic-progress-name">${catLabels[cat]}</span>
          <span class="topic-progress-pct">${catPct}%</span>
        </div>
        <div class="topic-bar">
          <div class="topic-bar-fill" style="width:${catPct}%" data-target="${catPct}"></div>
        </div>
      </div>`;
  }).join('');

  const achievements = [
    { icon: '🎯', title: 'First Lesson', desc: 'Complete your first lesson', unlocked: done >= 1 },
    { icon: '🔥', title: 'On Fire', desc: '3-day streak', unlocked: state.streak >= 3 },
    { icon: '🏆', title: 'Quiz Master', desc: 'Score 100% on a quiz', unlocked: state.quizHistory.some(h => h.score === h.total) },
    { icon: '📚', title: 'Bookworm', desc: 'Complete 5 lessons', unlocked: done >= 5 },
    { icon: '⚡', title: 'Speed Learner', desc: 'Earn 500 XP', unlocked: state.totalXP >= 500 },
    { icon: '🌟', title: 'All-Rounder', desc: 'Try every category', unlocked: categories.every(cat => LESSONS.some(l => l.category === cat && state.completedLessons.includes(l.id))) },
    { icon: '🧠', title: 'Knowledge Seeker', desc: 'Complete 10 lessons', unlocked: done >= 10 },
    { icon: '🚀', title: 'Launched', desc: 'Take your first quiz', unlocked: quizzesTaken >= 1 },
  ];

  container.innerHTML = `
    <div class="progress-overview">
      <div class="progress-big-card">
        <p class="progress-big-label">Overall Progress</p>
        <div class="progress-big-value">${pct}%</div>
        <p class="progress-big-sub">${done} / ${totalLessons} lessons</p>
      </div>
      <div class="progress-big-card">
        <p class="progress-big-label">Total XP</p>
        <div class="progress-big-value">${state.totalXP}</div>
        <p class="progress-big-sub">Level ${Math.floor(state.totalXP / 200) + 1}</p>
      </div>
      <div class="progress-big-card">
        <p class="progress-big-label">Quiz Average</p>
        <div class="progress-big-value">${quizzesTaken ? avgScore + '%' : '—'}</div>
        <p class="progress-big-sub">${quizzesTaken} quizzes taken</p>
      </div>
      <div class="progress-big-card">
        <p class="progress-big-label">Current Streak</p>
        <div class="progress-big-value">${state.streak}</div>
        <p class="progress-big-sub">days in a row</p>
      </div>
    </div>

    <h2 class="progress-section-title">Progress by Topic</h2>
    <div class="topic-progress-list">${topicBars}</div>

    <h2 class="progress-section-title">Achievements</h2>
    <div class="achievements-grid">
      ${achievements.map(a => `
        <div class="achievement-card ${a.unlocked ? '' : 'locked'}">
          <div class="achievement-icon">${a.icon}</div>
          <div class="achievement-title">${a.title}</div>
          <div class="achievement-desc">${a.desc}</div>
        </div>`).join('')}
    </div>`;

  // Animate bars after render
  requestAnimationFrame(() => {
    container.querySelectorAll('.topic-bar-fill').forEach(el => {
      el.style.width = el.dataset.target + '%';
    });
  });
}

// ═══════════════════════════════════════════════════
// PROFILE PAGE
// ═══════════════════════════════════════════════════
function renderProfile() {
  const container = document.getElementById('profileContent');
  const done = state.completedLessons.length;
  const xp = state.totalXP;
  const level = Math.floor(xp / 200) + 1;
  const xpInLevel = xp % 200;
  const quizzesTaken = state.quizHistory.length;

  container.innerHTML = `
    <div class="profile-hero">
      <div class="profile-avatar">${state.avatarEmoji}</div>
      <div style="flex:1">
        <h1 class="profile-name">${state.displayName || 'Learner'}</h1>
        <div class="profile-level">Level ${level} Scholar</div>
        <div class="profile-xp-bar-wrap">
          <p class="profile-xp-label">${xpInLevel} / 200 XP to next level</p>
          <div class="profile-xp-bar">
            <div class="profile-xp-fill" style="width:${(xpInLevel / 200) * 100}%"></div>
          </div>
        </div>
      </div>
      <button class="btn-secondary" onclick="navigateTo('settings')">Edit Profile →</button>
    </div>

    <div class="profile-stats-grid">
      <div class="profile-stat-card">
        <div class="profile-stat-val">${done}</div>
        <div class="profile-stat-label">Lessons Complete</div>
      </div>
      <div class="profile-stat-card">
        <div class="profile-stat-val">${xp}</div>
        <div class="profile-stat-label">Total XP</div>
      </div>
      <div class="profile-stat-card">
        <div class="profile-stat-val">${quizzesTaken}</div>
        <div class="profile-stat-label">Quizzes Taken</div>
      </div>
      <div class="profile-stat-card">
        <div class="profile-stat-val">${state.streak}</div>
        <div class="profile-stat-label">Day Streak</div>
      </div>
    </div>

    <h2 class="progress-section-title">Recent Activity</h2>
    ${renderRecentActivity()}`;
}

function renderRecentActivity() {
  const activities = [];

  // Merge completed lessons and quiz history, sort by recency (use index as proxy)
  state.completedLessons.slice(-5).reverse().forEach(id => {
    const l = LESSONS.find(les => les.id === id);
    if (l) activities.push({ icon: l.emoji, title: l.title, sub: `Lesson · ${l.xp} XP`, type: 'lesson' });
  });

  state.quizHistory.slice(-5).reverse().forEach(h => {
    const qz = QUIZZES.find(q => q.id === h.quizId);
    if (qz) activities.push({
      icon: qz.icon,
      title: qz.title,
      sub: `Quiz · ${h.score}/${h.total} correct`,
      type: 'quiz'
    });
  });

  if (!activities.length) {
    return `<div class="empty-state"><div class="empty-state-icon">◑</div><p>No activity yet. Start learning!</p></div>`;
  }

  return `<div class="topic-progress-list">
    ${activities.slice(0, 6).map(a => `
      <div class="topic-progress-item" style="display:flex;align-items:center;gap:16px;padding:16px 20px">
        <span style="font-size:24px">${a.icon}</span>
        <div>
          <p style="font-size:14px;font-weight:500">${a.title}</p>
          <p style="font-size:12px;color:var(--text-3);margin-top:3px">${a.sub}</p>
        </div>
      </div>`).join('')}
  </div>`;
}

// ═══════════════════════════════════════════════════
// SETTINGS
// ═══════════════════════════════════════════════════
function syncSettingsUI() {
  // Theme buttons
  document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.theme === state.theme);
  });
  // Accent swatches
  document.querySelectorAll('.swatch').forEach(s => {
    s.classList.toggle('active', s.dataset.accent === state.accent);
  });
  // Toggles
  document.getElementById('reduceMotionToggle').checked = state.reduceMotion;
  document.getElementById('xpAnimToggle').checked = state.xpAnimations;
  // Inputs
  document.getElementById('displayNameInput').value = state.displayName || '';
  document.getElementById('dailyGoalSelect').value = state.dailyGoal;
  // Emoji
  document.querySelectorAll('.emoji-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.emoji === state.avatarEmoji);
  });
}

function wireSettings() {
  // Theme
  document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.theme = btn.dataset.theme;
      saveState();
      applyTheme();
    });
  });

  // Accent
  document.getElementById('accentSwatches').addEventListener('click', (e) => {
    const swatch = e.target.closest('.swatch');
    if (!swatch) return;
    state.accent = swatch.dataset.accent;
    saveState();
    applyAccent();
  });

  // Reduce motion
  document.getElementById('reduceMotionToggle').addEventListener('change', (e) => {
    state.reduceMotion = e.target.checked;
    saveState();
    applyReduceMotion();
  });

  // XP anim
  document.getElementById('xpAnimToggle').addEventListener('change', (e) => {
    state.xpAnimations = e.target.checked;
    saveState();
  });

  // Display name
  document.getElementById('displayNameInput').addEventListener('input', (e) => {
    state.displayName = e.target.value.trim() || 'Learner';
    saveState();
    setDashboardGreeting();
  });

  // Daily goal
  document.getElementById('dailyGoalSelect').addEventListener('change', (e) => {
    state.dailyGoal = parseInt(e.target.value);
    saveState();
  });

  // Emoji picker
  document.getElementById('emojiPicker').addEventListener('click', (e) => {
    const btn = e.target.closest('.emoji-btn');
    if (!btn) return;
    state.avatarEmoji = btn.dataset.emoji;
    saveState();
    document.querySelectorAll('.emoji-btn').forEach(b => b.classList.toggle('active', b.dataset.emoji === state.avatarEmoji));
  });

  // Reset progress
  document.getElementById('resetProgressBtn').addEventListener('click', () => {
    if (!confirm('Reset all progress? This cannot be undone.')) return;
    state.completedLessons = [];
    state.lessonProgress = {};
    state.quizHistory = [];
    state.totalXP = 0;
    state.streak = 0;
    saveState();
    renderDashboard();
    renderQuizList();
    showXPToast('Progress reset.');
  });
}
