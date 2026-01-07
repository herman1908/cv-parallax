// Toggle Dark Mode
const darkToggle = document.getElementById("darkToggle");
darkToggle.addEventListener("click", () => {
  document.documentElement.classList.toggle("dark");
});

// Demo submit form
const form = document.getElementById("contactForm");
const msg = document.getElementById("msg");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  msg.classList.remove("d-none");
  form.reset();
});

/* ===============================
   SCROLL-DRIVEN ROTATION SYSTEM
=================================*/
const spinImg = document.querySelector("#spinBackground img");

// config — bisa kamu ubah
let baseRotation = 0;     // akumulasi putaran per-section
let current = 0;          // nilai animasi sekarang (untuk inertia)
let target = 0;           // nilai target (tergantung scroll)
let zoom = 1;

// ambil semua section agar rotasi bertahap
const sections = [...document.querySelectorAll("section")];

// update target saat scroll
/* window.addEventListener("scroll", () => {

  const scrollY = window.scrollY;
  const docHeight = document.body.scrollHeight - window.innerHeight;

  // progress global halaman (0 → 1)
  const progress = scrollY / docHeight;

  // rotasi utama mengikuti seluruh halaman
  target = progress * 360;

  // rotasi tambahan per-section
  let sectionIndex = sections.findIndex(
    s => s.offsetTop <= scrollY && s.offsetTop + s.offsetHeight > scrollY
  );

  if (sectionIndex < 0) sectionIndex = 0;

  baseRotation = sectionIndex * 25;   // tiap section nambah 25°
 */
  // zoom pelan (1 → 1.15)
  /* zoom = 1 + progress * 0.15;
}); */

// inertia  — animasi halus
/* function animate() {
  // easing (semakin kecil semakin lambat)
  current += (target + baseRotation - current) * 0.08;

  spinImg.style.transform = `rotate(${current}deg) scale(${zoom})`;

  requestAnimationFrame(animate);
}

animate(); */

const video = document.getElementById("scrollVideo");

let duration = 0;
let targetTime = 0;   // frame tujuan
let currentTime = 0;  // frame yang sedang tampil


video.addEventListener("loadedmetadata", () => {
  duration = video.duration;
});

// update frame video sesuai scroll
window.addEventListener("scroll", () => {

  if (!duration) return;

  const max = document.body.scrollHeight - window.innerHeight;
  const progress = window.scrollY / max;     // 0 → 1

  // 0.5x “kecepatan terasa” — bisa dinaikkan
  //const time = progress * duration * 0.5;
   // gerak scroll → video (reverse otomatis saat scroll ke atas)
  targetTime = progress * duration;
});

const videoWrapper = document.getElementById("scrollVideoWrapper");

window.addEventListener("scroll", () => {
  const offset = window.scrollY * 0.25;   // rasa parallax (boleh diatur)
  videoWrapper.style.transform = `translate3d(0, ${offset}px, 0)`;
});


// smoothing (anti “loncat”)
function smoothVideo() {
  // lerp (pelan mendekati target)
  currentTime += (targetTime - currentTime) * 0.12;

  video.currentTime = currentTime;

  requestAnimationFrame(smoothVideo);
}

smoothVideo();

// zoom dimulai lebih kecil
const MIN_SCALE = 0.80;   // titik awal (lebih kecil dari normal)
const MAX_EXTRA = 0.27;   // seberapa jauh zoom in dari MIN_SCALE

let targetScale = MIN_SCALE;
let currentScale = MIN_SCALE;

window.addEventListener("scroll", () => {

  const max = document.body.scrollHeight - window.innerHeight;
  const progress = window.scrollY / max;   // 0 → 1

  // skala bergerak dari 0.85 → 1.12
  targetScale = MIN_SCALE + (progress * MAX_EXTRA);
});

function smoothZoom(){
  currentScale += (targetScale - currentScale) * 0.08;
  scrollVideo.style.transform = `scale(${currentScale})`;
  requestAnimationFrame(smoothZoom);
}

smoothZoom();



const cards = document.querySelectorAll(".card-custom");

const observer = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add("show-card");
    }
  });
},{ threshold: .2 });

cards.forEach(card => observer.observe(card));


