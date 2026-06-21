const canvas = document.querySelector("#tideCanvas");
const ctx = canvas.getContext("2d");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const palette = ["#61dbc7", "#f6c76f", "#ff7d5c", "#f24aa8", "#f9f5ef"];

let width = 0;
let height = 0;
let tick = 0;

function resizeCanvas() {
  const scale = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = Math.floor(width * scale);
  canvas.height = Math.floor(height * scale);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
}

function drawWave(offset, color, alpha, baseline, amplitude) {
  ctx.beginPath();
  ctx.moveTo(0, height);

  for (let x = 0; x <= width + 16; x += 16) {
    const y =
      baseline +
      Math.sin((x + offset) * 0.012) * amplitude +
      Math.sin((x * 0.02) + offset * 0.014) * (amplitude * 0.35);
    ctx.lineTo(x, y);
  }

  ctx.lineTo(width, height);
  ctx.closePath();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.fill();
}

function animate() {
  ctx.clearRect(0, 0, width, height);
  tick += 1;

  drawWave(tick * 1.7, "#61dbc7", 0.18, height * 0.78, 18);
  drawWave(tick * -1.2, "#ff7d5c", 0.13, height * 0.83, 24);
  drawWave(tick * 0.8, "#f6c76f", 0.11, height * 0.88, 14);

  requestAnimationFrame(animate);
}

function createBurst(originX, originY) {
  if (reduceMotion) return;

  for (let i = 0; i < 34; i += 1) {
    const piece = document.createElement("span");
    const angle = Math.random() * Math.PI * 2;
    const distance = 80 + Math.random() * 140;

    piece.className = "burst";
    piece.style.left = `${originX}px`;
    piece.style.top = `${originY}px`;
    piece.style.background = palette[i % palette.length];
    piece.style.setProperty("--x", `${Math.cos(angle) * distance}px`);
    piece.style.setProperty("--y", `${Math.sin(angle) * distance + 40}px`);

    document.body.append(piece);
    window.setTimeout(() => piece.remove(), 900);
  }
}

async function sharePage() {
  const shareData = {
    title: "Happy Father's Day, Kevlar",
    text: "Happy Father's Day, Kevlar. Love, Collin.",
    url: window.location.href,
  };

  if (navigator.share) {
    await navigator.share(shareData);
    return;
  }

  await navigator.clipboard.writeText(window.location.href);
  const button = document.querySelector("#shareButton span");
  const original = button.textContent;
  button.textContent = "Link copied";
  window.setTimeout(() => {
    button.textContent = original;
  }, 1600);
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

if (!reduceMotion) {
  animate();
}

document.querySelector("#confettiButton").addEventListener("click", (event) => {
  const rect = event.currentTarget.getBoundingClientRect();
  createBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
});

document.querySelector("#shareButton").addEventListener("click", () => {
  sharePage().catch(() => {});
});

window.setTimeout(() => {
  createBurst(window.innerWidth / 2, Math.min(window.innerHeight * 0.42, 420));
}, 520);
