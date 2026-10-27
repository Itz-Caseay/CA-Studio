'use strict';

const D = window.CA || {};
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const EXTS = ['jpg', 'jpeg', 'png', 'webp', 'JPG', 'PNG'];

const ARROW = '<svg viewBox="0 0 48 24" aria-hidden="true"><path d="M0 12h44M34 2l10 10-10 10" fill="none" stroke="currentColor" stroke-width="3"/></svg>';

const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const initials = name => String(name || '').split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase();
const pad2 = n => String(n).padStart(2, '0');
const art = (i, label) => `<div class="art art-${i % 4}" aria-hidden="true">${label ? `<span>${esc(label)}</span>` : ''}</div>`;

/* ---------- images ---------- */
const probe = src => new Promise(resolve => {
  const im = new Image();
  im.onload = () => resolve(src);
  im.onerror = () => resolve(null);
  im.src = src;
});
async function findFirst(base) {
  const hits = await Promise.all(EXTS.map(e => probe(`${base}.${e}`)));
  return hits.find(Boolean) || null;
}
// Lays a real image over the generated art once it is found
async function hydrateMedia(root) {
  await Promise.all($$('.media[data-base], .media[data-img]', root).map(async el => {
    const src = el.dataset.img || (el.dataset.base ? await findFirst(el.dataset.base) : null);
    if (!src) return;
    const im = new Image();
    im.src = src;
    im.alt = el.dataset.alt || '';
    im.decoding = 'async';
    el.append(im);
    requestAnimationFrame(() => im.classList.add('on'));
  }));
}

/* ---------- hero wave ---------- */
function makeWave(el) {
  const n = innerWidth < 700 ? 28 : 56;
  for (let i = 0; i < n; i++) {
    const b = document.createElement('i');
    b.style.cssText =
      `--lo:${(0.1 + Math.random() * 0.25).toFixed(2)};` +
      `--hi:${(0.45 + Math.random() * 0.55).toFixed(2)};` +
      `--dur:${(0.9 + Math.random() * 1.4).toFixed(2)}s;` +
      `--dl:-${(Math.random() * 2).toFixed(2)}s`;
    el.append(b);
  }
}

/* ---------- home ---------- */
async function renderTeam() {
  const root = $('#team');
  if (!root) return;

  let items = (D.team || []).map(t => ({ image: t.image, name: t.name, role: t.role }));
  if (!items.length) {
    let misses = 0;
    for (let n = 1; n <= 16 && misses < 2; n++) {
      const src = await findFirst(`images/team/team-${n}`);
      if (src) { items.push({ image: src }); misses = 0; } else { misses++; }
    }
  }
  if (!items.length) items = [{}, {}, {}, {}];

  root.innerHTML = items.map((t, i) => `
    <figure class="tile reveal" style="--d:${i * 70}ms">
      <div class="media r-34" ${t.image ? `data-img="${esc(t.image)}"` : ''} data-alt="${esc(t.name || 'CA_Studio team member')}">${art(i)}</div>
      ${t.name ? `<figcaption>${esc(t.name)}${t.role ? `<span>${esc(t.role)}</span>` : ''}</figcaption>` : ''}
    </figure>`).join('');
  await hydrateMedia(root);
  observe(root);
}

function renderAmbitions() {
  const root = $('#ambitions');
  if (!root) return;
  root.innerHTML = (D.ambitions || []).map((a, i) => `
    <article class="amb reveal" style="--d:${i * 90}ms">
      <div class="media r-43" ${a.image ? `data-img="${esc(a.image)}"` : `data-base="images/ambitions/ambition-${i + 1}"`} data-alt="${esc(a.title)}">${art(i + 1)}</div>
      <p class="amb-num">${pad2(i + 1)}</p>
      <h3>${esc(a.title)}</h3>
      <p>${esc(a.text)}</p>
    </article>`).join('');
  hydrateMedia(root);
  observe(root);
}

/* ---------- startup ---------- */
function renderProjects() {
  const root = $('#projects');
  if (!root) return;
  root.innerHTML = (D.projects || []).map((p, i) => `
    <article class="project reveal">
      <div class="media r-169" ${p.image ? `data-img="${esc(p.image)}"` : `data-base="images/projects/${esc(p.slug)}"`} data-alt="${esc(p.name)}">${art(i)}</div>
      <div class="proj-body">
        <p class="proj-num">${pad2(i + 1)}</p>
        <h2 class="proj-title">${esc(p.name)}</h2>
        ${p.tagline ? `<p class="proj-tag">${esc(p.tagline)}</p>` : ''}
        ${p.status ? `<span class="status${/complete|live|done/i.test(p.status) ? ' done' : ''}"><i></i>${esc(p.status)}</span>` : ''}
        ${(p.tags && p.tags.length) ? `<ul class="tags">${p.tags.map(t => `<li>${esc(t)}</li>`).join('')}</ul>` : ''}
        ${p.link ? `<a class="proj-link" href="${esc(p.link)}" target="_blank" rel="noopener"><span>View project</span>${ARROW}</a>` : ''}
      </div>
    </article>`).join('');
  hydrateMedia(root);
  observe(root);
}

/* ---------- label ---------- */
const songSlug = t => String(t || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const releasedSongs = a => (a.songs || []).filter(s => !s.status);

function renderArtists() {
  const root = $('#artists');
  if (!root) return;
  const list = D.artists || [];
  root.classList.toggle('solo', list.length === 1);
  root.innerHTML = list.map((a, i) => {
    const n = releasedSongs(a).length;
    return `
    <a class="artist reveal" href="artist.html?artist=${encodeURIComponent(a.slug)}" style="--d:${(i % 3) * 90}ms">
      <div class="media r-45" ${a.image ? `data-img="${esc(a.image)}"` : `data-base="images/artists/${esc(a.slug)}"`} data-alt="${esc(a.name)}">
        ${art(i, initials(a.name))}
        <span class="listen">View songs ${ARROW}</span>
      </div>
      <h3>${esc(a.name)}</h3>
      <p class="meta">${a.genre ? `<span>${esc(a.genre)}</span>` : ''}${n ? `<span>${n} ${n === 1 ? 'song' : 'songs'} on the label</span>` : ''}</p>
    </a>`;
  }).join('');
  hydrateMedia(root);
  observe(root);
}

/* ---------- artist page: all songs under the label ---------- */
function parseStreams(s) {
  const m = String(s || '').match(/([\d.]+)\s*([kKmM]?)/);
  if (!m) return 0;
  const unit = m[2].toLowerCase();
  return parseFloat(m[1]) * (unit === 'k' ? 1e3 : unit === 'm' ? 1e6 : 1);
}

function renderArtistPage() {
  const list = $('#tracks');
  if (!list) return;

  const artists = D.artists || [];
  const slug = new URLSearchParams(location.search).get('artist');
  const a = artists.find(x => x.slug === slug) || (artists.length === 1 ? artists[0] : null);
  const nameEl = $('#aName');

  if (!a) {
    nameEl.textContent = 'Artist not found';
    $('#aMeta').textContent = 'That artist is not on the label page.';
    $('#aSide').hidden = true;
    $('#songsHead').hidden = true;
    return;
  }

  document.title = `${a.name} | CA_Studio`;
  nameEl.textContent = a.name;
  const songs = a.songs || [];
  const out = releasedSongs(a).length;
  $('#aMeta').textContent = [a.genre, out ? `${out} ${out === 1 ? 'song' : 'songs'} on CA_Studio` : ''].filter(Boolean).join('. ');
  $('#songsCount').textContent = out ? `${out} ${out === 1 ? 'release' : 'releases'}` : '';

  const portrait = $('#aPortrait');
  portrait.dataset.alt = a.name;
  if (a.image) portrait.dataset.img = a.image; else portrait.dataset.base = `images/artists/${a.slug}`;
  portrait.innerHTML = art(0, initials(a.name));
  hydrateMedia($('#aSide'));
  if (a.link) { const s = $('#aSite'); s.href = a.link; s.hidden = false; }

  if (!songs.length) {
    list.outerHTML = '<p class="empty">Songs coming soon.</p>';
    return;
  }

  const max = Math.max(1, ...songs.map(s => parseStreams(s.streams)));
  const PLAY = '<svg class="i-play" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15l13-7.5z"/></svg>';
  const PAUSE = '<svg class="i-pause" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4h4v16H6zM14 4h4v16h-4z"/></svg>';

  list.innerHTML = songs.map((s, i) => {
    const soon = !!s.status;
    const w = Math.max(5, Math.round(parseStreams(s.streams) / max * 100));
    const audio = s.audio || `audio/${a.slug}/${songSlug(s.title)}.mp3`;
    return `
    <li class="track${soon ? ' soon' : ''}" data-title="${esc(s.title)}" data-audio="${esc(audio)}" style="--w:${w}%;--n:${i}">
      <button class="play" type="button" aria-label="Play ${esc(s.title)}"${soon ? ' disabled' : ''}>${PLAY}${PAUSE}</button>
      <div class="info">
        <h3>${esc(s.title)} <span class="eq" aria-hidden="true"><i></i><i></i><i></i><i></i></span></h3>
        ${s.note ? `<p class="note-line">${esc(s.note)}</p>` : ''}
        ${soon ? `<span class="pill">${esc(s.status)}</span>` : (s.streams ? '<div class="bar" aria-hidden="true"><i></i></div>' : '')}
        <span class="note" role="status"></span>
      </div>
      <p class="count">${soon || !s.streams ? '' : `<span>${esc(s.streams)}<span class="sr-only"> streams</span></span>`}${(s.link && !soon) ? `<a class="song-link" href="${esc(s.link)}" target="_blank" rel="noopener">Open</a>` : ''}</p>
    </li>`;
  }).join('');

  // player
  const rows = $$('.track', list);
  const players = new Map();
  const timers = new Map();
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  function setState(row, state) {
    row.dataset.state = state;
    $('.play', row).setAttribute('aria-label', (state === 'playing' ? 'Pause ' : 'Play ') + row.dataset.title);
  }
  function note(row, text) {
    const el = $('.note', row);
    el.textContent = text;
    clearTimeout(timers.get(row));
    timers.set(row, setTimeout(() => { el.textContent = ''; }, 3000));
  }
  function audioFor(row) {
    if (!players.has(row)) {
      const au = new Audio();
      au.preload = 'none';
      au.src = row.dataset.audio;
      au.addEventListener('playing', () => setState(row, 'playing'));
      au.addEventListener('pause', () => setState(row, 'idle'));
      au.addEventListener('ended', () => setState(row, 'idle'));
      au.addEventListener('error', () => { setState(row, 'idle'); note(row, 'Preview coming soon'); });
      players.set(row, au);
    }
    return players.get(row);
  }
  rows.forEach(row => {
    setState(row, 'idle');
    $('.play', row).addEventListener('click', () => {
      const au = audioFor(row);
      players.forEach((other, r) => { if (r !== row) other.pause(); });
      if (au.paused) {
        const p = au.play();
        if (p) p.catch(() => { if (au.error) { setState(row, 'idle'); note(row, 'Preview coming soon'); } });
      } else {
        au.pause();
      }
    });
  });

  // bars grow when the list comes into view
  if (!reduce && 'IntersectionObserver' in window) {
    const bars = new IntersectionObserver(en => {
      if (en.some(x => x.isIntersecting)) { list.classList.add('in'); bars.disconnect(); }
    }, { threshold: 0.2 });
    bars.observe(list);
  } else {
    list.classList.add('in');
  }
}

/* ---------- footer, email, socials ---------- */
function renderShared() {
  $$('[data-mail]').forEach(a => {
    if (!D.email) return;
    const subject = a.dataset.subject ? `?subject=${encodeURIComponent(a.dataset.subject)}` : '';
    a.href = `mailto:${D.email}${subject}`;
    if (!a.dataset.label) a.textContent = D.email;
    a.hidden = false;
  });

  const soc = $('#socials');
  if (soc) {
    Object.entries(D.socials || {}).filter(([, url]) => url).forEach(([name, url]) => {
      const a = document.createElement('a');
      a.href = url; a.target = '_blank'; a.rel = 'noopener'; a.textContent = name;
      soc.append(a);
    });
  }
  const y = $('#year');
  if (y) y.textContent = new Date().getFullYear();
}

/* ---------- scroll reveal ---------- */
const io = 'IntersectionObserver' in window
  ? new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' })
  : null;
function observe(root = document) {
  $$('.reveal:not(.in)', root).forEach(el => (io ? io.observe(el) : el.classList.add('in')));
}

/* ---------- go ---------- */
$$('.wave').forEach(makeWave);
renderShared();
renderAmbitions();
renderProjects();
renderArtists();
renderArtistPage();
renderTeam();
observe();
