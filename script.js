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

const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

// MOBILE VIDEO MODE (autoplay background)
if (isMobile) {

  console.log("Mobile mode: autoplay simple video");

  video.muted = true;
  video.loop = true;
  video.playsInline = true;

  video.play().catch(() => {});

  // Small cinematic zoom only
  window.addEventListener("scroll", () => {
    const p = window.scrollY / (document.body.scrollHeight - innerHeight);
    const scale = 1 + (p * 0.12);
    video.style.transform = `scale(${scale})`;
  });

}




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

if (isMobile) {
  video.muted = true;
  video.loop = true;

  video.play().catch(()=>{});

  // pelan, biar terasa cinematic
  video.playbackRate = 0.6;

  // HENTIKAN semua logika scroll-sync untuk mobile
  console.log("Mobile mode active — using autoplay background video");
}


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





// ——— SCROLL → WAKTU VIDEO ———
window.addEventListener("scroll", () => {
  if (!duration) return;

  const max = document.body.scrollHeight - innerHeight;
  const progress = Math.min(1, Math.max(0, scrollY / max));

  targetTime = progress * duration;

  // parallax + cinematic zoom
  const offset = scrollY * 0.25;
  const scale  = 0.82 + progress * 0.28;

  if (videoWrapper) {
    videoWrapper.style.transform = `translate3d(0, ${offset}px, 0)`;
  }

  video.style.transform = `scale(${scale})`;
});

// ——— SMOOTH SEEK ———
function smoothSeek(){
  currentTime += (targetTime - currentTime) * 0.12;
  if (duration) video.currentTime = currentTime;
  requestAnimationFrame(smoothSeek);
}
smoothSeek();

// ——— TAB VISIBILITY ———
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    try { video.pause(); } catch(e){}
  }
});

