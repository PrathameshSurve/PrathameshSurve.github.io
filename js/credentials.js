(function () {
  const dataEl = document.getElementById('credentials-data');
  const row1El = document.getElementById('credentialsMarqueeRow1');
  const row2El = document.getElementById('credentialsMarqueeRow2');
  if (!dataEl || !row1El || !row2El) return;

  const credentials = JSON.parse(dataEl.textContent.trim());
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function createCertCard(cred) {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'cert-card';
    card.setAttribute('data-modal', '');
    card.setAttribute('aria-label', `View ${cred.title} certificate from ${cred.source}`);
    card.innerHTML = `
      <div class="cert-card__img-wrap">
        <img src="${cred.img}" alt="${cred.title}" loading="lazy" decoding="async" width="320" height="240">
      </div>
      <div class="cert-card__body">
        <p class="cert-card__title">${cred.title}</p>
        <p class="cert-card__source">${cred.source}</p>
      </div>
    `;
    return card;
  }

  function buildGroup(certs) {
    const group = document.createElement('div');
    group.className = 'marquee__group';
    certs.forEach((cred) => group.appendChild(createCertCard(cred)));
    return group;
  }

  function buildMarquee(container, certs, reverse) {
    const marquee = document.createElement('div');
    marquee.className = reverse ? 'marquee marquee--reverse' : 'marquee';

    const track = document.createElement('div');
    track.className = 'marquee__track';
    track.appendChild(buildGroup(certs));

    if (!prefersReducedMotion) {
      const clone = buildGroup(certs);
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
    }

    marquee.appendChild(track);
    container.appendChild(marquee);
  }

  const midpoint = Math.ceil(credentials.length / 2);
  buildMarquee(row1El, credentials.slice(0, midpoint), false);
  buildMarquee(row2El, credentials.slice(midpoint), true);
})();
