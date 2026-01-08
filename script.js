// ===============================
// DARK MODE
// ===============================
const darkToggle = document.getElementById("darkToggle");

if (darkToggle) {
  darkToggle.addEventListener("click", () => {
    document.documentElement.classList.toggle("dark");
  });
}

// ===============================
// CONTACT FORM
// ===============================
const form = document.getElementById("contactForm");
const msg = document.getElementById("msg");

if (form && msg) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    msg.classList.remove("d-none");
    form.reset();
  });
}

// ===============================
// FADE-IN CARD ANIMATION
// ===============================
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("show");
    });
  },
  { threshold: 0.25 }
);

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));


// ===============================
// VIDEO PARALLAX (MOBILE SAFE)
// ===============================
const video = document.getElementById("scrollVideo");
const videoWrapper = document.getElementById("scrollVideoWrapper");
const overlay = document.getElementById("enableVideoOverlay");

let duration = 0;
let targetTime = 0;
let currentTime = 0;

// metadata siap
if (video) {
  video.addEventListener("loadedmetadata", () => {
    duration = video.duration || 0;
    try { video.currentTime = 0.01; } catch(e){}
  });
}

// ——— USER TAP ONCE (WAJIB DI MOBILE) ———
overlay?.addEventListener("click", async () => {

  // always remove overlay (desktop safe)
  overlay.classList.add("hidden");

  try {
    video.muted = true;
    await video.play();
    video.pause();
  } catch(e) {
    // ignore — scrolling will still work when allowed
  }
});

// hide overlay on desktop — only mobile needs it
if (window.innerWidth > 900) {
  overlay?.classList.add("hidden");
}



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
