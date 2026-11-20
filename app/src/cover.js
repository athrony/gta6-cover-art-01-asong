const PANEL_LAYOUT = [
  { x: 0.04, y: 0.12, w: 0.58, h: 0.60 },
  { x: 0.64, y: 0.12, w: 0.32, h: 0.29 },
  { x: 0.64, y: 0.43, w: 0.32, h: 0.29 },
  { x: 0.04, y: 0.74, w: 0.92, h: 0.02 },
];

function drawImageCrop(ctx, image, box, crop) {
  const x = box.x * ctx.canvas.width;
  const y = box.y * ctx.canvas.height;
  const w = box.w * ctx.canvas.width;
  const h = box.h * ctx.canvas.height;
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  if (image) {
    const fit = Math.max(w / image.naturalWidth, h / image.naturalHeight) * crop.zoom;
    const imageWidth = image.naturalWidth * fit;
    const imageHeight = image.naturalHeight * fit;
    const overflowX = Math.max(0, imageWidth - w);
    const overflowY = Math.max(0, imageHeight - h);
    const left = x + (w - imageWidth) / 2 - overflowX * crop.x / 200;
    const top = y + (h - imageHeight) / 2 - overflowY * crop.y / 200;
    ctx.drawImage(image, left, top, imageWidth, imageHeight);
    const shade = ctx.createLinearGradient(x, y, x + w, y + h);
    shade.addColorStop(0, 'rgba(21, 18, 26, .02)');
    shade.addColorStop(1, 'rgba(21, 18, 26, .24)');
    ctx.fillStyle = shade;
    ctx.fillRect(x, y, w, h);
  } else {
    ctx.fillStyle = '#343138';
    ctx.fillRect(x, y, w, h);
  }
  ctx.restore();
}

function fitText(ctx, text, maxWidth, initialSize, weight = 800) {
  let size = initialSize;
  ctx.font = `${weight} ${size}px system-ui, sans-serif`;
  while (ctx.measureText(text).width > maxWidth && size > 12) {
    size -= 2;
    ctx.font = `${weight} ${size}px system-ui, sans-serif`;
  }
  return size;
}

export function drawCover(canvas, panels, copy) {
  const ctx = canvas.getContext('2d');
  const { width, height } = canvas;
  ctx.fillStyle = '#19181d';
  ctx.fillRect(0, 0, width, height);

  for (let index = 0; index < 3; index++) {
    const box = PANEL_LAYOUT[index];
    drawImageCrop(ctx, panels[index].image, box, panels[index].crop);
  }

  const left = width * 0.045;
  const topLine = (copy.kicker || '').trim().toUpperCase();
  ctx.fillStyle = '#f2c171';
  ctx.font = `700 ${Math.max(12, width * 0.014)}px system-ui, sans-serif`;
  ctx.textAlign = 'left';
  ctx.fillText(topLine, left, height * 0.065, width * 0.72);
  ctx.textAlign = 'right';
  ctx.fillStyle = 'rgba(255,255,255,.62)';
  ctx.font = `600 ${Math.max(10, width * 0.011)}px system-ui, sans-serif`;
  ctx.fillText('COASTAL EDITION   /   01', width * 0.955, height * 0.065);

  ctx.fillStyle = '#f4bd63';
  ctx.fillRect(left, height * 0.795, width * 0.055, Math.max(3, unit * 4));
  const title = (copy.title || '').trim().toUpperCase();
  const maxTitleWidth = width * 0.91;
  const titleSize = fitText(ctx, title, maxTitleWidth, Math.min(height * 0.105, width * 0.11));
  ctx.textAlign = 'left';
  ctx.fillStyle = '#fff9ed';
  ctx.shadowColor = 'rgba(0,0,0,.25)';
  ctx.shadowBlur = unit * 12;
  ctx.font = `900 ${titleSize}px system-ui, sans-serif`;
  ctx.fillText(title, left - unit, height * 0.89, maxTitleWidth);
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#e6a8a1';
  ctx.font = `700 ${Math.max(12, width * 0.016)}px system-ui, sans-serif`;
  ctx.fillText((copy.subtitle || '').trim().toUpperCase(), left, height * 0.93, maxTitleWidth);
  ctx.textAlign = 'right';
  ctx.fillStyle = 'rgba(255,255,255,.58)';
  ctx.font = `600 ${Math.max(10, width * 0.01)}px system-ui, sans-serif`;
  ctx.fillText('A FICTIONAL CITY STORY', width * 0.955, height * 0.93);

  ctx.strokeStyle = 'rgba(255,255,255,.2)';
  ctx.lineWidth = Math.max(1, unit);
  ctx.beginPath();
  ctx.moveTo(left, height * 0.955);
  ctx.lineTo(width * 0.955, height * 0.955);
  ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,.48)';
  ctx.textAlign = 'left';
  ctx.font = `600 ${Math.max(9, width * 0.009)}px system-ui, sans-serif`;
  ctx.fillText('AFTERGLOW STUDIO', left, height * 0.978);
  ctx.textAlign = 'right';
  ctx.fillText('YOUR CITY. YOUR STORY.', width * 0.955, height * 0.978);
}

export { PANEL_LAYOUT };
