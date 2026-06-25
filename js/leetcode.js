(function () {
  const USER = 'prathamsurve101';
  const API_BASE = 'https://alfa-leetcode-api.onrender.com';
  const SECONDS_PER_DAY = 86400;

  const STATIC_PROFILE = {
    solved: 730,
    activeDays: 349,
    currentStreak: 141,
    maxStreak: 141,
    yearSubmissions: 636,
  };

  const panel = document.getElementById('leetcodePanel');
  const solvedEl = document.getElementById('leetcodeSolved');
  const activeDaysEl = document.getElementById('leetcodeActiveDays');
  const maxStreakEl = document.getElementById('leetcodeMaxStreak');
  const currentStreakEl = document.getElementById('leetcodeCurrentStreak');
  const yearSubmissionsEl = document.getElementById('leetcodeYearSubmissions');
  const heatmapGrid = document.getElementById('leetcodeHeatmapGrid');
  const heatmapFallback = document.getElementById('leetcodeHeatmapFallback');

  if (!panel || !solvedEl || !heatmapGrid) return;

  function utcDayTimestamp(year, month, day) {
    return Math.floor(Date.UTC(year, month, day) / 1000);
  }

  function todayUtcTimestamp() {
    const now = new Date();
    return utcDayTimestamp(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  }

  function formatDate(ts) {
    const d = new Date(ts * 1000);
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
  }

  function getLevel(count) {
    if (!count) return 0;
    if (count === 1) return 1;
    if (count <= 3) return 2;
    if (count <= 6) return 3;
    return 4;
  }

  function getCalendarCount(calendar, ts) {
    return Number(calendar[ts] ?? calendar[String(ts)] ?? 0);
  }

  function countYearSubmissions(calendar) {
    const cutoff = todayUtcTimestamp() - 365 * SECONDS_PER_DAY;
    return Object.entries(calendar).reduce((sum, [ts, count]) => {
      return Number(ts) >= cutoff ? sum + Number(count) : sum;
    }, 0);
  }

  function renderHeatmap(calendar) {
    heatmapGrid.innerHTML = '';
    heatmapGrid.hidden = false;
    if (heatmapFallback) heatmapFallback.hidden = true;

    const todayTs = todayUtcTimestamp();
    let startTs = todayTs - 364 * SECONDS_PER_DAY;
    const startDate = new Date(startTs * 1000);
    startTs -= startDate.getUTCDay() * SECONDS_PER_DAY;

    const totalWeeks = Math.ceil((todayTs - startTs) / (7 * SECONDS_PER_DAY)) + 1;
    let activeDays = 0;

    for (let w = 0; w < totalWeeks; w += 1) {
      const weekEl = document.createElement('div');
      weekEl.className = 'leetcode-heatmap__week';

      for (let d = 0; d < 7; d += 1) {
        const ts = startTs + (w * 7 + d) * SECONDS_PER_DAY;
        const dayEl = document.createElement('span');
        dayEl.className = 'leetcode-heatmap__day';

        if (ts > todayTs) {
          dayEl.setAttribute('data-level', '0');
          dayEl.setAttribute('aria-hidden', 'true');
        } else {
          const count = getCalendarCount(calendar, ts);
          if (count) activeDays += 1;
          const level = getLevel(count);
          dayEl.setAttribute('data-level', String(level));
          dayEl.title = count
            ? `${count} submission${count > 1 ? 's' : ''} on ${formatDate(ts)}`
            : `No submissions on ${formatDate(ts)}`;
        }

        weekEl.appendChild(dayEl);
      }

      heatmapGrid.appendChild(weekEl);
    }

    heatmapGrid.setAttribute(
      'aria-label',
      `LeetCode activity heatmap showing ${activeDays} active days in the last year`
    );
  }

  function showHeatmapFallback() {
    heatmapGrid.innerHTML = '';
    heatmapGrid.hidden = true;
    if (heatmapFallback) heatmapFallback.hidden = false;
  }

  function setCountStat(el, value, format) {
    if (!el) return;
    el.dataset.countUp = String(value);
    if (format) el.dataset.countFormat = format;
    el.textContent = '…';
    el.classList.add('leetcode-stat__value--loading');
  }

  function notifyStatsReady() {
    document.dispatchEvent(new CustomEvent('leetcode:stats-ready'));
  }

  function applyLiveStats({ solved, activeDays, currentStreak, maxStreak, yearSubmissions, calendar }) {
    setCountStat(solvedEl, solved);
    setCountStat(activeDaysEl, activeDays);
    setCountStat(currentStreakEl, currentStreak, 'streak');
    setCountStat(maxStreakEl, maxStreak);
    setCountStat(yearSubmissionsEl, yearSubmissions);
    panel.classList.remove('leetcode-panel--static');
    renderHeatmap(calendar);
    notifyStatsReady();
  }

  function applyStaticProfile() {
    setCountStat(solvedEl, STATIC_PROFILE.solved);
    setCountStat(activeDaysEl, STATIC_PROFILE.activeDays);
    setCountStat(currentStreakEl, STATIC_PROFILE.currentStreak, 'streak');
    setCountStat(maxStreakEl, STATIC_PROFILE.maxStreak);
    setCountStat(yearSubmissionsEl, STATIC_PROFILE.yearSubmissions);
    panel.classList.add('leetcode-panel--static');
    showHeatmapFallback();
    notifyStatsReady();
  }

  async function loadLeetCodeData() {
    try {
      const [solvedRes, calendarRes] = await Promise.all([
        fetch(`${API_BASE}/${encodeURIComponent(USER)}/solved`),
        fetch(`${API_BASE}/${encodeURIComponent(USER)}/calendar`),
      ]);

      if (!solvedRes.ok || !calendarRes.ok) throw new Error('LeetCode API unavailable');

      const solvedData = await solvedRes.json();
      const calendarData = await calendarRes.json();

      let calendar = {};
      try {
        calendar = JSON.parse(calendarData.submissionCalendar || '{}');
      } catch {
        throw new Error('Invalid calendar payload');
      }

      if (!Object.keys(calendar).length) throw new Error('Empty calendar payload');

      applyLiveStats({
        solved: solvedData.solvedProblem,
        activeDays: calendarData.totalActiveDays,
        currentStreak: calendarData.streak,
        maxStreak: calendarData.streak || STATIC_PROFILE.maxStreak,
        yearSubmissions: countYearSubmissions(calendar),
        calendar,
      });
    } catch {
      applyStaticProfile();
    }
  }

  loadLeetCodeData();
})();
