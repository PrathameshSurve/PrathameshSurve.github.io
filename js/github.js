(function () {
  const USER = 'PrathameshSurve';
  const repoCountEl = document.getElementById('githubRepoCount');
  const langsEl = document.getElementById('githubTopLangs');
  const techTagsEl = document.getElementById('githubTechTags');

  if (!repoCountEl || !langsEl) return;

  const STATIC = {
    repoCount: 29,
    langs: 'TypeScript · JavaScript · HTML · Angular',
    tags: ['TypeScript', 'JavaScript', 'HTML', 'Angular', 'CSS'],
  };

  function applyStatic() {
    repoCountEl.textContent = String(STATIC.repoCount);
    langsEl.textContent = STATIC.langs;
    if (techTagsEl) {
      techTagsEl.innerHTML = STATIC.tags.map((lang) => `<span class="tag">${lang}</span>`).join('');
    }
  }

  async function loadGitHubData() {
    try {
      const [userRes, reposRes] = await Promise.all([
        fetch(`https://api.github.com/users/${USER}`),
        fetch(`https://api.github.com/users/${USER}/repos?per_page=100&sort=updated`),
      ]);

      if (!userRes.ok || !reposRes.ok) throw new Error('GitHub API error');

      const user = await userRes.json();
      const repos = await reposRes.json();

      const langCounts = {};
      repos.forEach((repo) => {
        if (repo.language) {
          langCounts[repo.language] = (langCounts[repo.language] || 0) + 1;
        }
      });

      const topLangs = Object.entries(langCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

      repoCountEl.textContent = String(user.public_repos ?? repos.length);
      langsEl.textContent = topLangs.length
        ? topLangs.map(([lang]) => lang).join(' · ')
        : '—';

      if (techTagsEl && topLangs.length) {
        techTagsEl.innerHTML = topLangs
          .map(([lang]) => `<span class="tag">${lang}</span>`)
          .join('');
      }
    } catch {
      applyStatic();
    }
  }

  loadGitHubData();
})();
