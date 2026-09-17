const target = new Date("2027-10-27T00:00:00").getTime();

const $ = id => document.getElementById(id);
const pad = n => String(n).padStart(2, "0");

function updateCountdown() {
  const now = Date.now();
  const diff = target - now;

  if (diff <= 0) {
    startCelebration();
    return;
  }

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  $("days").textContent = String(days).padStart(3, "0");
  $("hours").textContent = pad(hours);
  $("minutes").textContent = pad(minutes);
  $("seconds").textContent = pad(seconds);
}

let celebrationStarted = false;
function startCelebration() {
  if (celebrationStarted) return;
  celebrationStarted = true;
  $("countdown").style.display = "none";
  $("card").style.display = "none";
  $("celebration").classList.add("show");
  launchConfetti();
}

setInterval(updateCountdown, 1000);
updateCountdown();

// Interactive 3D tilt
const card = $("card");
document.addEventListener("pointermove", e => {
  if (celebrationStarted) return;
  const x = (e.clientX / innerWidth - 0.5) * 2;
  const y = (e.clientY / innerHeight - 0.5) * 2;
  card.style.transform =
    `translate(-50%,-50%) rotateX(${-y * 5}deg) rotateY(${x * 7}deg)`;
});

// Confetti
const canvas = $("confetti");
const ctx = canvas.getContext("2d");
let pieces = [];
function resize() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
}
addEventListener("resize", resize);
resize();

function launchConfetti() {
  pieces = Array.from({length: 260}, () => ({
    x: innerWidth / 2,
    y: innerHeight / 2,
    vx: (Math.random() - .5) * 18,
    vy: (Math.random() - .8) * 18,
    size: Math.random() * 7 + 3,
    rotation: Math.random() * Math.PI,
    spin: (Math.random() - .5) * .25,
    gravity: .18 + Math.random() * .12,
    life: 240 + Math.random() * 180
  }));
  requestAnimationFrame(drawConfetti);
}

function drawConfetti() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  pieces.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += p.gravity;
    p.vx *= .995;
    p.rotation += p.spin;
    p.life--;
    ctx.save();
    ctx.translate(p.x,p.y);
    ctx.rotate(p.rotation);
    ctx.globalAlpha = Math.min(1, p.life / 60);
    ctx.fillStyle = `hsl(${(p.x + p.y) % 360}, 90%, 70%)`;
    ctx.fillRect(-p.size/2,-p.size/2,p.size,p.size*1.8);
    ctx.restore();
  });
  pieces = pieces.filter(p => p.life > 0 && p.y < innerHeight + 50);
  if (pieces.length) requestAnimationFrame(drawConfetti);
  else setTimeout(launchConfetti, 900);
}

// Tiny sparkle particles throughout the scene
const scene = document.querySelector(".scene");
for (let i=0;i<35;i++){
  const s=document.createElement("i");
  s.style.position="absolute";
  s.style.left=Math.random()*100+"%";
  s.style.top=Math.random()*100+"%";
  s.style.width=s.style.height=(Math.random()*3+1)+"px";
  s.style.borderRadius="50%";
  s.style.background="white";
  s.style.opacity=Math.random()*.7;
  s.style.boxShadow="0 0 8px rgba(255,255,255,.8)";
  s.style.animation=`twinkle ${2+Math.random()*4}s ease-in-out ${Math.random()*3}s infinite alternate`;
  scene.appendChild(s);
}
const style=document.createElement("style");
style.textContent="@keyframes twinkle{from{transform:scale(.3);opacity:.1}to{transform:scale(1.8);opacity:.9}}";
document.head.appendChild(style);
