import { drawCover } from './cover.js';
import { runShot } from './shots.js';

const canvas = document.getElementById('cover');
const panelList = document.getElementById('panel-list');
const photoInput = document.getElementById('photo-input');
const formats = {
  square: { width: 1080, height: 1080, label: 'SQUARE COVER' },
  portrait: { width: 1080, height: 1350, label: 'PORTRAIT COVER' },
  landscape: { width: 1920, height: 1080, label: 'LANDSCAPE COVER' },
};
const panels = [
  { name: '01  Feature', image: null, crop: { zoom: 1, x: 0, y: 0 } },
  { name: '02  Skyline', image: null, crop: { zoom: 1.25, x: -12, y: -7 } },
  { name: '03  Night drive', image: null, crop: { zoom: 1.45, x: 16, y: 12 } },
];
let selectedPanel = 0;
let format = 'portrait';

export function loadImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = url;
  });
}

function draw() {
  const { width, height } = formats[format];
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }
  canvas.style.aspectRatio = `${width} / ${height}`;
  drawCover(canvas, panels, {
    kicker: document.getElementById('kicker').value,
    title: document.getElementById('title').value,
    subtitle: document.getElementById('subtitle').value,
  });
}

function refreshPanelList() {
  panelList.replaceChildren();
  panels.forEach((panel, index) => {
    const button = document.createElement('button');
    button.className = `panel-item${selectedPanel === index ? ' selected' : ''}`;
    button.type = 'button';
    button.setAttribute('aria-pressed', String(selectedPanel === index));
    button.setAttribute('aria-label', `Select ${panel.name} photo panel`);
    const thumb = document.createElement('span');
    thumb.className = 'panel-thumb';
    if (panel.image) thumb.style.backgroundImage = `url("${panel.image.src}")`;
    const details = document.createElement('span');
    details.className = 'panel-details';
    details.innerHTML = `<strong>${panel.name}</strong><small>${panel.image ? 'Photo loaded' : 'Add a photo'}</small>`;
    const selected = document.createElement('span');
    selected.className = 'panel-check';
    selected.textContent = selectedPanel === index ? '●' : '○';
    button.append(thumb, details, selected);
    button.addEventListener('click', () => selectPanel(index));
    panelList.append(button);
  });
  const loaded = panels.filter((panel) => panel.image).length;
  document.getElementById('photo-count').textContent = `${String(loaded).padStart(2, '0')} PHOTO${loaded === 1 ? '' : 'S'}`;
}

function selectPanel(index) {
  selectedPanel = index;
  const crop = panels[index].crop;
  document.getElementById('zoom').value = Math.round(crop.zoom * 100);
  document.getElementById('pan-x').value = crop.x;
  document.getElementById('pan-y').value = crop.y;
  document.getElementById('crop-readout').textContent = `${Math.round(crop.zoom * 100)}%`;
  document.querySelector('[for="zoom"] output').value = `${Math.round(crop.zoom * 100)}%`;
  document.querySelector('[for="pan-x"] output').value = crop.x;
  document.querySelector('[for="pan-y"] output').value = crop.y;
  refreshPanelList();
  draw();
}

async function addFiles(files) {
  const selectedFiles = [...files].filter((file) => file.type.startsWith('image/')).slice(0, panels.length);
  if (!selectedFiles.length) return;
  try {
    for (const [offset, file] of selectedFiles.entries()) {
      const image = await loadImage(URL.createObjectURL(file));
      const panelIndex = Math.min(selectedPanel + offset, panels.length - 1);
      panels[panelIndex].image = image;
      panels[panelIndex].crop = { zoom: 1, x: 0, y: 0 };
    }
    selectPanel(selectedPanel);
  } catch {
    window.alert('That image could not be opened. Try another photo format.');
  }
}

document.getElementById('add-photo').addEventListener('click', () => photoInput.click());
photoInput.addEventListener('change', (event) => {
  addFiles(event.target.files);
  photoInput.value = '';
});

for (const [controlId, key, factor] of [['zoom', 'zoom', 0.01], ['pan-x', 'x', 1], ['pan-y', 'y', 1]]) {
  const control = document.getElementById(controlId);
  control.addEventListener('input', () => {
    const value = Number(control.value);
    panels[selectedPanel].crop[key] = value * factor;
    control.nextElementSibling.value = key === 'zoom' ? `${value}%` : String(value);
    document.getElementById('crop-readout').textContent = `${Math.round(panels[selectedPanel].crop.zoom * 100)}%`;
    draw();
  });
}

document.getElementById('reset-crop').addEventListener('click', () => {
  panels[selectedPanel].crop = { zoom: 1, x: 0, y: 0 };
  selectPanel(selectedPanel);
});

for (const field of ['kicker', 'title', 'subtitle']) {
  document.getElementById(field).addEventListener('input', draw);
}

document.querySelectorAll('.format-option').forEach((button) => {
  button.addEventListener('click', () => {
    format = button.dataset.size;
    document.querySelectorAll('.format-option').forEach((option) => option.classList.toggle('selected', option === button));
    const dimensions = `${formats[format].width} × ${formats[format].height}`;
    document.getElementById('export-size').textContent = dimensions;
    document.getElementById('preview-dimensions').textContent = dimensions;
    document.getElementById('preview-format').textContent = formats[format].label;
    draw();
  });
});

document.getElementById('export').addEventListener('click', () => {
  draw();
  canvas.toBlob((blob) => {
    if (!blob) return;
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `afterglow-cover-${canvas.width}x${canvas.height}.png`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  }, 'image/png');
});

async function loadSample(url) {
  const image = await loadImage(url);
  panels.forEach((panel) => { panel.image = image; });
  refreshPanelList();
  draw();
}

const shot = new URLSearchParams(location.search).get('shot');
if (shot) {
  await runShot(shot, new URLSearchParams(location.search), loadSample);
} else {
  await loadSample('./assets/coastal-drive.jpg');
}
selectPanel(0);
