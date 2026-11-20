export async function runShot(shot, query, load) {
  if (shot === 'cover') document.body.classList.add('shot-cover');
  const title = query.get('title') ?? 'AFTER HOURS';
  document.getElementById('title').value = title;
  document.getElementById('kicker').value = query.get('kicker') ?? 'A NIGHT ON THE COAST';
  document.getElementById('subtitle').value = query.get('subtitle') ?? 'THE CITY NEVER SLEEPS';
  await load('./assets/coastal-drive.jpg');
  requestAnimationFrame(() => requestAnimationFrame(() => { window.__shotReady = true; }));
}
