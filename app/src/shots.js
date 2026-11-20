export async function runShot(shot, query, load) {
  if (shot === 'cover') document.body.classList.add('shot-cover');
  const title = query.get('title') ?? 'VICE CITY';
  document.getElementById('title').value = title;
  document.getElementById('kicker').value = query.get('kicker') ?? 'LEONIDA STATE / WANTED 01';
  document.getElementById('subtitle').value = query.get('subtitle') ?? 'MISSION: AFTER HOURS';
  await load(['./assets/bay-escape.jpg', './assets/neon-boulevard.jpg', './assets/lead-portrait.jpg']);
  requestAnimationFrame(() => requestAnimationFrame(() => { window.__shotReady = true; }));
}
