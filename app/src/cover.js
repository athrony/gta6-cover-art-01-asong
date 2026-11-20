const PANEL_LAYOUT = [
  { x: 0, y: 0, w: 0.69, h: 1 },
  { x: 0.71, y: 0.035, w: 0.255, h: 0.445 },
  { x: 0.71, y: 0.52, w: 0.255, h: 0.445 },
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
  ctx.font = `${weight} ${size}px Archivo Black, sans-serif`;
  while (ctx.measureText(text).width > maxWidth && size > 12) {
    size -= 2;
    ctx.font = `${weight} ${size}px Archivo Black, sans-serif`;
  }
  return size;
}

export function drawCover(canvas, panels, copy) {
  const ctx = canvas.getContext('2d');
  const { width, height } = canvas;
  ctx.fillStyle = '#19181d';
  ctx.fillRect(0, 0, width, height);
  const gutter = Math.max(5, width * 0.008);

  for (let index = 0; index < 3; index++) {
    const layout = PANEL_LAYOUT[index];
    const box = index === 0
      ? layout
      : { ...layout, x: layout.x + gutter / width, y: layout.y + gutter / height, w: layout.w - gutter / width, h: layout.h - gutter / height };
    drawImageCrop(ctx, panels[index].image, box, panels[index].crop);
  }

  const sideWash = ctx.createLinearGradient(width * 0.48, 0, width * 0.72, 0);
  sideWash.addColorStop(0, 'rgba(16, 12, 29, 0)');
  sideWash.addColorStop(1, 'rgba(16, 12, 29, .16)');
  ctx.fillStyle = sideWash;
  ctx.fillRect(width * 0.48, 0, width * 0.52, height);

  const lowerWash = ctx.createLinearGradient(0, height * 0.60, 0, height * 0.96);
  lowerWash.addColorStop(0, 'rgba(15, 10, 25, 0)');
  lowerWash.addColorStop(1, 'rgba(15, 10, 25, .96)');
  ctx.fillStyle = lowerWash;
  ctx.fillRect(0, height * 0.60, width, height * 0.40);

  const left = width * 0.045;
  const topLine = (copy.kicker || '').trim().toUpperCase();
  ctx.fillStyle = '#ffcc79';
  ctx.font = `700 ${Math.max(13, width * 0.016)}px Archivo Black, sans-serif`;
  ctx.textAlign = 'left';
  ctx.shadowColor = '#150b22';
  ctx.shadowBlur = width * 0.008;
  ctx.fillText(topLine, left, height * 0.075, width * 0.66);
  ctx.textAlign = 'right';
  ctx.fillStyle = '#fff4e2';
  ctx.font = `700 ${Math.max(11, width * 0.011)}px Archivo Black, sans-serif`;
  ctx.fillText('WANTED / 01', width * 0.955, height * 0.075);

  ctx.shadowBlur = 0;
  ctx.fillStyle = '#ff5aa8';
  ctx.fillRect(left, height * 0.775, width * 0.075, Math.max(4, width * 0.006));
  const title = (copy.title || '').trim().toUpperCase();
  const maxTitleWidth = width * 0.90;
  const titleSize = fitText(ctx, title, maxTitleWidth, Math.min(height * 0.12, width * 0.115), 900);
  ctx.textAlign = 'left';
  ctx.fillStyle = '#fff8ed';
  ctx.shadowColor = 'rgba(255, 61, 155, .55)';
  ctx.shadowBlur = width * 0.018;
  ctx.font = `900 ${titleSize}px Archivo Black, sans-serif`;
  ctx.fillText(title, left, height * 0.875, maxTitleWidth);
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#7fe4e5';
  ctx.font = `700 ${Math.max(13, width * 0.015)}px Archivo Black, sans-serif`;
  ctx.fillText((copy.subtitle || '').trim().toUpperCase(), left, height * 0.92, maxTitleWidth);
  ctx.textAlign = 'right';
  ctx.fillStyle = 'rgba(255,255,255,.85)';
  ctx.font = `600 ${Math.max(10, width * 0.01)}px system-ui, sans-serif`;
  ctx.fillText('VICE CITY  /  LEONIDA', width * 0.955, height * 0.92);

  ctx.fillStyle = 'rgba(255,255,255,.70)';
  ctx.textAlign = 'left';
  ctx.font = `700 ${Math.max(10, width * 0.009)}px Archivo Black, sans-serif`;
  ctx.fillText('MISSION 01  /  AFTER DARK', left, height * 0.972);
  ctx.textAlign = 'right';
  ctx.fillText('NEON COAST', width * 0.955, height * 0.972);
}

export { PANEL_LAYOUT };
