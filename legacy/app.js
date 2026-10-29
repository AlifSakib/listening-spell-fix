/* ======================================================
   IELTS Spelling Practice – app.js
   Pure vanilla JS, no frameworks. All state in localStorage.
   ====================================================== */

(function () {
  'use strict';

  // ── DOM refs ──────────────────────────────────────────
  const $score       = document.getElementById('score');
  const $streak      = document.getElementById('streak');
  const $installBtn  = document.getElementById('installBtn');
  const $voiceFallback = document.getElementById('voiceFallback');
  const $categorySelect = document.getElementById('categorySelect');
  const $reviewBtn   = document.getElementById('reviewBtn');
  const $mistakeCount = document.getElementById('mistakeCount');
  const $playBtn     = document.getElementById('playBtn');
  const $slowBtn     = document.getElementById('slowBtn');
  const $wordInput   = document.getElementById('wordInput');
  const $checkBtn    = document.getElementById('checkBtn');
  const $skipBtn     = document.getElementById('skipBtn');
  const $nextBtn     = document.getElementById('nextBtn');
  const $feedback    = document.getElementById('feedback');
  const $feedbackContent = document.getElementById('feedbackContent');
  const $progressInfo = document.getElementById('progressInfo');
  const accentBtns   = document.querySelectorAll('.accent-btn');

  // ── State ─────────────────────────────────────────────
  let allWords       = [];      // full word list from JSON
  let currentQueue   = [];      // shuffled queue for current session
  let currentIndex   = 0;
  let currentWord    = null;    // { word, alt, category }
  let answered       = false;
  let reviewMode     = false;

  // Voices
  let voices         = [];
  let selectedAccent = localStorage.getItem('ielts-accent') || 'en-GB';
  let currentVoice   = null;
  let voiceReady     = false;

  // Score (today)
  let todayData      = loadToday();
  let streakCount    = parseInt(localStorage.getItem('ielts-streak') || '0', 10);

  // Mistakes: { "word": correctStreakCount }
  let mistakes       = JSON.parse(localStorage.getItem('ielts-mistakes') || '{}');

  // PWA install prompt
  let deferredPrompt = null;

  // ── Categories map (for dropdown labels) ──────────────
  const CATEGORY_LABELS = {
    'all':                'All words',
    'days-and-months':    'Days & Months',
    'money':              'Money Matters',
    'subjects':           'Subjects',
    'education':          'Education',
    'marketing':          'Marketing',
    'health':             'Health',
    'nature':             'Nature',
    'environment':        'Environment',
    'animals':            'Animals',
    'plants':             'Plants',
    'geography':          'Geography',
    'languages':          'Languages',
    'architecture':       'Architecture',
    'homes':              'Homes',
    'city':               'In the City',
    'workplaces':         'Workplaces',
    'rating-and-qualities': 'Rating & Qualities',
    'tourism':            'Tourism',
    'verbs':              'Verbs',
    'adjectives':         'Adjectives',
    'hobbies':            'Hobbies',
    'sports':             'Sports',
    'shapes':             'Shapes',
    'measurement':        'Measurement',
    'transport':          'Transport & Vehicles',
    'weather':            'Weather',
    'places':             'Places',
    'equipment':          'Equipment & Tools',
    'arts-and-media':     'Arts & Media',
    'materials':          'Materials',
    'jobs':               'Jobs',
    'colours':            'Colours',
    'time-expressions':   'Time Expressions',
    'other':              'Other'
  };

  // ── Init ──────────────────────────────────────────────
  async function init() {
    await loadWords();
    setupVoices();
    setupAccentSelector();
    populateCategories();
    setupEventListeners();
    setupPWA();
    updateScoreDisplay();
    updateMistakeCount();
    startSession();
    $wordInput.focus();
  }

  // ── Load word list ────────────────────────────────────
  async function loadWords() {
    try {
      const res = await fetch('words.json');
      allWords = await res.json();
    } catch (e) {
      console.error('Failed to load words.json', e);
      allWords = [];
    }
  }

  // ── Voices ────────────────────────────────────────────
  function setupVoices() {
    function loadVoices() {
      voices = speechSynthesis.getVoices();
      if (voices.length > 0) {
        voiceReady = true;
        pickVoice();
      }
    }
    loadVoices();
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }
  }

  function pickVoice() {
    const lang = selectedAccent;
    // Exact match voices
    let candidates = voices.filter(v => v.lang === lang || v.lang.replace('_', '-') === lang);

    if (candidates.length === 0) {
      // Broader match: any en-XX
      candidates = voices.filter(v => v.lang.startsWith('en'));
      if (candidates.length > 0) {
        $voiceFallback.textContent = `No ${lang} voice found. Using ${candidates[0].lang} instead.`;
        $voiceFallback.classList.add('visible');
      } else {
        $voiceFallback.textContent = 'No English voice available on this device.';
        $voiceFallback.classList.add('visible');
      }
    } else {
      $voiceFallback.classList.remove('visible');
      $voiceFallback.textContent = '';
    }

    if (candidates.length === 0) {
      currentVoice = null;
      return;
    }

    // Prefer "Google", "Natural", or "Enhanced"
    const preferred = candidates.find(v =>
      /google|natural|enhanced/i.test(v.name)
    );
    currentVoice = preferred || candidates[0];
  }

  function speak(word, slow) {
    speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(word);
    if (currentVoice) utter.voice = currentVoice;
    utter.lang = selectedAccent;
    utter.rate = slow ? 0.65 : 1.0;
    utter.pitch = 1.0;
    speechSynthesis.speak(utter);
  }

  // ── Accent selector ──────────────────────────────────
  function setupAccentSelector() {
    // Restore saved accent
    accentBtns.forEach(btn => {
      const isActive = btn.dataset.accent === selectedAccent;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-checked', isActive ? 'true' : 'false');
    });
  }

  function handleAccentChange(accent) {
    selectedAccent = accent;
    localStorage.setItem('ielts-accent', accent);
    accentBtns.forEach(btn => {
      const isActive = btn.dataset.accent === accent;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-checked', isActive ? 'true' : 'false');
    });
    pickVoice();
    // Re-speak current word with new accent
    if (currentWord) {
      speak(currentWord.word, false);
    }
  }

  // ── Category dropdown ─────────────────────────────────
  function populateCategories() {
    const cats = new Set(allWords.map(w => w.category));
    // Clear existing options except "All words"
    $categorySelect.innerHTML = '<option value="all">All words</option>';
    cats.forEach(cat => {
      const opt = document.createElement('option');
      opt.value = cat;
      opt.textContent = CATEGORY_LABELS[cat] || cat;
      $categorySelect.appendChild(opt);
    });
  }

  // ── Session management ────────────────────────────────
  function startSession() {
    let pool;
    if (reviewMode) {
      const mistakeWords = Object.keys(mistakes);
      pool = allWords.filter(w => mistakeWords.includes(w.word.toLowerCase()));
      if (pool.length === 0) {
        reviewMode = false;
        $reviewBtn.classList.remove('active');
        pool = getFilteredWords();
      }
    } else {
      pool = getFilteredWords();
    }
    currentQueue = shuffle([...pool]);
    currentIndex = 0;
    loadNextWord();
  }

  function getFilteredWords() {
    const cat = $categorySelect.value;
    if (cat === 'all') return allWords;
    return allWords.filter(w => w.category === cat);
  }

  function loadNextWord() {
    if (currentQueue.length === 0) {
      startSession();
      return;
    }
    if (currentIndex >= currentQueue.length) {
      // Re-shuffle and restart
      currentQueue = shuffle([...currentQueue]);
      currentIndex = 0;
    }
    currentWord = currentQueue[currentIndex];
    answered = false;

    // Reset UI
    $wordInput.value = '';
    $wordInput.classList.remove('correct', 'wrong', 'correct-anim', 'wrong-anim');
    $wordInput.disabled = false;
    $checkBtn.classList.remove('hidden');
    $skipBtn.classList.remove('hidden');
    $nextBtn.classList.add('hidden');
    $feedback.classList.add('hidden');
    $feedbackContent.innerHTML = '';
    $wordInput.focus();

    updateProgressInfo();

    // Auto-speak
    setTimeout(() => speak(currentWord.word, false), 200);
  }

  // ── Answer checking ───────────────────────────────────
  function checkAnswer() {
    if (answered || !currentWord) return;
    const userAnswer = $wordInput.value.trim().toLowerCase();
    if (userAnswer === '') return;

    answered = true;
    const correct = currentWord.word.toLowerCase();
    const alt = currentWord.alt ? currentWord.alt.toLowerCase() : null;
    const isCorrect = userAnswer === correct || (alt && userAnswer === alt);

    // Update score
    todayData.total++;
    if (isCorrect) {
      todayData.correct++;
      streakCount++;
    } else {
      streakCount = 0;
    }
    saveToday();
    localStorage.setItem('ielts-streak', streakCount.toString());
    updateScoreDisplay();

    if (isCorrect) {
      handleCorrect();
    } else {
      handleWrong(userAnswer, correct);
    }
  }

  function handleCorrect() {
    $wordInput.classList.add('correct', 'correct-anim');
    $wordInput.disabled = true;
    $checkBtn.classList.add('hidden');
    $skipBtn.classList.add('hidden');
    $feedback.classList.remove('hidden');
    $feedbackContent.innerHTML = '<div class="correct-text">✓ Correct!</div>';

    // Update mistakes: increment correct streak
    const key = currentWord.word.toLowerCase();
    if (mistakes[key] !== undefined) {
      mistakes[key]++;
      if (mistakes[key] >= 2) {
        delete mistakes[key];
      }
      saveMistakes();
      updateMistakeCount();
    }

    // Auto-advance after 1 second
    setTimeout(() => {
      currentIndex++;
      loadNextWord();
    }, 1000);
  }

  function handleWrong(userAnswer, correct) {
    $wordInput.classList.add('wrong', 'wrong-anim');
    $wordInput.disabled = true;
    $checkBtn.classList.add('hidden');
    $skipBtn.classList.add('hidden');
    $nextBtn.classList.remove('hidden');
    $feedback.classList.remove('hidden');

    // Build letter diff
    const diffHTML = buildLetterDiff(userAnswer, correct);
    $feedbackContent.innerHTML =
      '<div class="wrong-text">✗ Incorrect</div>' +
      '<div class="correct-answer">Correct: <strong>' + escapeHTML(currentWord.word) + '</strong></div>' +
      '<div class="diff-label">Your answer:</div>' +
      '<div class="letter-diff">' + diffHTML + '</div>';

    // Store mistake, reset correct streak
    const key = currentWord.word.toLowerCase();
    mistakes[key] = 0;
    saveMistakes();
    updateMistakeCount();

    $nextBtn.focus();
  }

  // ── Letter-by-letter diff ─────────────────────────────
  function buildLetterDiff(userAnswer, correct) {
    // Use a simple character-by-character comparison
    const maxLen = Math.max(userAnswer.length, correct.length);
    let html = '';
    for (let i = 0; i < maxLen; i++) {
      const userChar = userAnswer[i];
      const correctChar = correct[i];
      if (i >= userAnswer.length) {
        // Missing letter
        html += '<span class="missing-letter" title="missing">' + escapeHTML(correctChar) + '</span>';
      } else if (i >= correct.length) {
        // Extra letter
        html += '<span class="extra-letter" title="extra">' + escapeHTML(userChar) + '</span>';
      } else if (userChar === correctChar) {
        // Correct letter
        html += '<span class="correct-letter">' + escapeHTML(userChar) + '</span>';
      } else {
        // Wrong letter
        html += '<span class="wrong-letter" title="should be ' + escapeHTML(correctChar) + '">' + escapeHTML(userChar) + '</span>';
      }
    }
    return html;
  }

  // ── Skip ──────────────────────────────────────────────
  function skipWord() {
    if (answered) return;
    currentIndex++;
    loadNextWord();
  }

  // ── Score management ──────────────────────────────────
  function loadToday() {
    const saved = JSON.parse(localStorage.getItem('ielts-today-score') || '{}');
    const today = new Date().toISOString().slice(0, 10);
    if (saved.date === today) return saved;
    return { date: today, correct: 0, total: 0 };
  }

  function saveToday() {
    todayData.date = new Date().toISOString().slice(0, 10);
    localStorage.setItem('ielts-today-score', JSON.stringify(todayData));
  }

  function updateScoreDisplay() {
    $score.textContent = todayData.correct + '/' + todayData.total;
    $streak.textContent = streakCount;
  }

  // ── Mistakes management ───────────────────────────────
  function saveMistakes() {
    localStorage.setItem('ielts-mistakes', JSON.stringify(mistakes));
  }

  function updateMistakeCount() {
    const count = Object.keys(mistakes).length;
    $mistakeCount.textContent = count;
    $reviewBtn.disabled = count === 0 && !reviewMode;
  }

  // ── Progress info ─────────────────────────────────────
  function updateProgressInfo() {
    const modeLabel = reviewMode ? 'Reviewing mistakes' : '';
    const pos = currentIndex + 1;
    const total = currentQueue.length;
    $progressInfo.textContent = modeLabel + (modeLabel ? ' · ' : '') + pos + ' of ' + total;
  }

  // ── Event listeners ───────────────────────────────────
  function setupEventListeners() {
    // Accent buttons
    accentBtns.forEach(btn => {
      btn.addEventListener('click', () => handleAccentChange(btn.dataset.accent));
    });

    // Play buttons
    $playBtn.addEventListener('click', () => {
      if (currentWord) speak(currentWord.word, false);
    });
    $slowBtn.addEventListener('click', () => {
      if (currentWord) speak(currentWord.word, true);
    });

    // Check button
    $checkBtn.addEventListener('click', checkAnswer);

    // Skip button
    $skipBtn.addEventListener('click', skipWord);

    // Next button
    $nextBtn.addEventListener('click', () => {
      currentIndex++;
      loadNextWord();
    });

    // Keyboard: Enter and Space
    $wordInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (!answered) {
          if ($wordInput.value.trim() === '') {
            // Replay word
            if (currentWord) speak(currentWord.word, false);
          } else {
            checkAnswer();
          }
        }
      } else if (e.key === ' ' && $wordInput.value === '') {
        e.preventDefault();
        if (currentWord) speak(currentWord.word, false);
      }
    });

    // Category change
    $categorySelect.addEventListener('change', () => {
      if (reviewMode) {
        reviewMode = false;
        $reviewBtn.classList.remove('active');
      }
      startSession();
    });

    // Review mistakes toggle
    $reviewBtn.addEventListener('click', () => {
      reviewMode = !reviewMode;
      $reviewBtn.classList.toggle('active', reviewMode);
      startSession();
    });
  }

  // ── PWA ───────────────────────────────────────────────
  function setupPWA() {
    // Service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('sw.js').catch(err => {
        console.warn('SW registration failed:', err);
      });
    }

    // Install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      $installBtn.classList.add('visible');
    });

    $installBtn.addEventListener('click', async () => {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      const result = await deferredPrompt.userChoice;
      if (result.outcome === 'accepted') {
        $installBtn.classList.remove('visible');
      }
      deferredPrompt = null;
    });

    window.addEventListener('appinstalled', () => {
      $installBtn.classList.remove('visible');
    });
  }

  // ── Utilities ─────────────────────────────────────────
  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ── Boot ──────────────────────────────────────────────
  init();
})();
