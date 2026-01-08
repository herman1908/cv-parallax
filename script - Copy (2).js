// ===============================
// DARK MODE
// ===============================
const darkToggle = document.getElementById("darkToggle");
darkToggle?.addEventListener("click", () => {
  document.documentElement.classList.toggle("dark");
});

// ===============================
// CONTACT FORM DEMO
// ===============================
const form = document.getElementById("contactForm");
const msg  = document.getElementById("msg");

form?.addEventListener("submit", (e) => {
  e.preventDefault();
  msg.classList.remove("d-none");
  form.reset();
});


function unlockVideo(){
  if (!video) return;

  video.muted = true;
  video.playsInline = true;

  video.play().then(()=>{

    // berjalan sangat lambat → praktis "diam"
    video.playbackRate = 0.00001;

    window.removeEventListener("touchstart", unlockVideo);
    window.removeEventListener("click", unlockVideo);

  }).catch(()=>{});
}


// iOS/Android butuh satu tap dulu
window.addEventListener("touchstart", unlockVideo, { once:true });
window.addEventListener("click", unlockVideo, { once:true });

// ===============================
// VIDEO SCROLL-CONTROL
// ===============================
const video = document.getElementById("scrollVideo");
const videoWrapper = document.getElementById("scrollVideoWrapper");

let duration = 0;
let targetTime = 0;
let currentTime = 0;

video.addEventListener("loadedmetadata", () => {
  duration = video.duration;
  document.body.classList.add("video-ready");
});

// video.addEventListener("loadeddata", () => {
//   document.body.classList.add("video-ready");
// });

video.addEventListener("loadedmetadata", ()=>{
  try { video.currentTime = 0.01; } catch(e){}
});



// ZOOM PARAMETERS
const MIN_SCALE = 0.82;   // awal — lebih kecil
const MAX_EXTRA = 0.28;   // zoom maksimum

let targetScale  = MIN_SCALE;
let currentScale = MIN_SCALE;

// SINGLE SCROLL HANDLER (lebih ringan)
window.addEventListener("scroll", () => {

  if (!duration) return;

  const max = document.body.scrollHeight - window.innerHeight;
  let progress = window.scrollY / max;

  // pastikan 0 → 1, tidak lebih / kurang
  progress = Math.min(1, Math.max(0, progress));

  // target waktu video
  targetTime  = progress * duration;

  // target zoom
  targetScale = MIN_SCALE + (progress * MAX_EXTRA);

  // parallax shift
  const offset = window.scrollY * 0.25;
  videoWrapper.style.transform = `translate3d(0, ${offset}px, 0)`;
});


// SMOOTH VIDEO SEEK
function smoothVideo() {
  currentTime += (targetTime - currentTime) * 0.12;
  video.currentTime = currentTime;
  requestAnimationFrame(smoothVideo);
}
smoothVideo();

// SMOOTH ZOOM
function smoothZoom(){
  currentScale += (targetScale - currentScale) * 0.09;
  video.style.transform = `scale(${currentScale})`;
  requestAnimationFrame(smoothZoom);
}
smoothZoom();

// ===============================
// CARD FADE-IN ON VIEW
// ===============================
const cards = document.querySelectorAll(".card-custom");

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add("show-card");
  });
},{ threshold: .2 });

cards.forEach(card => observer.observe(card));

//======
// PAUSE VIDEO WHEN TAB IS NOT ACTIVE 
//======

document.addEventListener("visibilitychange", () => {
  if (document.hidden){
    video.pause();
  } else {
    video.play().catch(()=>{});
  }
});

const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll("a.nav-link");

window.addEventListener("scroll", () => {

  let current = "";

  sections.forEach(sec => {
     const max = document.body.scrollHeight - window.innerHeight;
  const progress = Math.min(1, Math.max(0, window.scrollY / max));

  // playback rate mengikuti scroll
  video.playbackRate = 0.5 + progress * 1.0;

  // kenakan efek zoom & brightness
  const scale = 1 + progress * 0.15;
  video.style.transform = `scale(${scale})`;
  });

  navLinks.forEach(link =>{
    link.classList.remove("active");
    if (link.getAttribute("href").includes(current)){
      link.classList.add("active");
    }
  });

});

video.addEventListener("error", ()=>{
  document.body.classList.add("no-video");
});

// timeout (misal jaringan lambat)
setTimeout(()=>{
  if(!duration){
    document.body.classList.add("no-video");
  }
}, 6000);

// hentikan animasi grain & breath saat tab tidak aktif
document.addEventListener("visibilitychange", ()=>{
  document.body.style.animationPlayState =
  document.hidden ? "paused" : "running";
});

const scrollVideo = document.getElementById("scrollVideo");

function startVideo() {
   scrollVideo.muted = true;
  scrollVideo.play().catch(()=>{});
}

window.addEventListener("touchstart", startVideo, { once: true });
window.addEventListener("scroll", startVideo, { once: true });

window.addEventListener("scroll", () => {
  const max = document.body.scrollHeight - window.innerHeight;
  const progress = window.scrollY / max;

  // scrollVideo.currentTime =
  //   progress * (scrollVideo.duration || 0);

  
});

let lastScrollY = 0;

window.addEventListener("scroll", () => {

  const delta = window.scrollY - lastScrollY;

  // kecepatan berdasarkan arah & jarak scroll
  let speed = delta * 0.01;

  // batasi supaya halus
  speed = Math.max(-1.5, Math.min(1.5, speed));

  scrollVideo.playbackRate = 1 + speed;

  lastScrollY = window.scrollY;
});


let targetRate = 1;
let currentRate = 1;

function animateRate(){
  currentRate += (targetRate - currentRate) * 0.1;
  scrollVideo.playbackRate = currentRate;
  requestAnimationFrame(animateRate);
}
animateRate();

window.addEventListener("scroll", () => {
  const delta = window.scrollY - lastScrollY;
  targetRate = 1 + Math.max(-1.2, Math.min(1.2, delta * 0.01));
  lastScrollY = window.scrollY;
});


const video = document.getElementById("scrollVideo");
const overlay = document.getElementById("enableVideoOverlay");

overlay.addEventListener("click", async () => {

  try {
    video.muted = true;
    await video.play();        // ← sekarang dianggap gesture sah
  } catch(e){}

  overlay.classList.add("hidden");
});


