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

  video.play().then(()=>{
    video.pause();

    // lepas listener setelah berhasil
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
    const top = window.scrollY;
    const offset = sec.offsetTop - 120;
    const height = sec.offsetHeight;

    if (top >= offset && top < offset + height){
      current = sec.getAttribute("id");
    }
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

