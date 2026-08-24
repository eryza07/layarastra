// ============================================================
// script.js — Logika utama NIJAU (Netflix-style, tema Hijau-Putih)
// Semua data disimpan di localStorage (frontend-only demo).
// ============================================================

const LS_USER_KEY = "nf_user";
const LS_COMMENT_PREFIX = "nf_comments_"; // + movieId

// ---------- Elemen ----------
const landingScreen = document.getElementById("landingScreen");
const landingLoginBtn = document.getElementById("landingLoginBtn");
const landingLoginBtn2 = document.getElementById("landingLoginBtn2");
const landingRegisterBtn = document.getElementById("landingRegisterBtn");
const loginBackBtn = document.getElementById("loginBackBtn");
const loginOverlay = document.getElementById("loginOverlay");
const appRoot = document.getElementById("appRoot");
const loginForm = document.getElementById("loginForm");
const loginError = document.getElementById("loginError");
const loginTitle = document.getElementById("loginTitle");
const loginSubtitle = document.getElementById("loginSubtitle");
const toggleModeBtn = document.getElementById("toggleModeBtn");
const toggleModeText = document.getElementById("toggleModeText");
const submitBtn = document.getElementById("submitBtn");

const navbar = document.getElementById("navbar");
const userChip = document.getElementById("userChip");
const userInitial = document.getElementById("userInitial");
const userNameLabel = document.getElementById("userNameLabel");
const logoutBtn = document.getElementById("logoutBtn");
const searchInput = document.getElementById("searchInput");

const heroSection = document.getElementById("heroSection");
const heroBadge = document.getElementById("heroBadge");
const heroTitle = document.getElementById("heroTitle");
const heroDesc = document.getElementById("heroDesc");
const heroPlayBtn = document.getElementById("heroPlayBtn");
const heroInfoBtn = document.getElementById("heroInfoBtn");

const rowsWrap = document.getElementById("rowsWrap");

const modalBackdrop = document.getElementById("modalBackdrop");
const modalClose = document.getElementById("modalClose");
const playerVideo = document.getElementById("playerVideo");
const playerTrack = document.getElementById("playerTrack");
const detailTitle = document.getElementById("detailTitle");
const detailMeta = document.getElementById("detailMeta");
const detailDesc = document.getElementById("detailDesc");
const chatList = document.getElementById("chatList");
const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");
const chatCount = document.getElementById("chatCount");

// Kontrol video custom
const btnPlayPause = document.getElementById("btnPlayPause");
const btnBack10 = document.getElementById("btnBack10");
const btnFwd10 = document.getElementById("btnFwd10");
const btnMute = document.getElementById("btnMute");
const volRange = document.getElementById("volRange");
const btnCC = document.getElementById("btnCC");
const speedSelect = document.getElementById("speedSelect");
const btnFullscreen = document.getElementById("btnFullscreen");
const progressRange = document.getElementById("progressRange");
const timeText = document.getElementById("timeText");

let isRegisterMode = false;
let currentMovie = null;

// ============================================================
// AUTH
// ============================================================
function getUser() {
  try { return JSON.parse(localStorage.getItem(LS_USER_KEY)); }
  catch (e) { return null; }
}

function saveUser(name) {
  localStorage.setItem(LS_USER_KEY, JSON.stringify({ name, loginAt: Date.now() }));
}

function logout() {
  localStorage.removeItem(LS_USER_KEY);
  location.reload();
}

function showApp(user) {
  landingScreen.classList.add("hidden");
  loginOverlay.classList.add("hidden");
  appRoot.classList.remove("hidden");
  userInitial.textContent = user.name.charAt(0).toUpperCase();
  userNameLabel.textContent = user.name;
}

// ---------- Navigasi antar layar: Landing -> Login -> App ----------
function openLoginScreen(registerMode) {
  landingScreen.classList.add("hidden");
  loginOverlay.classList.remove("hidden");
  isRegisterMode = !!registerMode;
  applyLoginModeUI();
  loginError.textContent = "";
}

function backToLanding() {
  loginOverlay.classList.add("hidden");
  landingScreen.classList.remove("hidden");
  loginForm.reset();
  loginError.textContent = "";
}

landingLoginBtn.addEventListener("click", () => openLoginScreen(false));
landingLoginBtn2.addEventListener("click", () => openLoginScreen(false));
landingRegisterBtn.addEventListener("click", () => openLoginScreen(true));
loginBackBtn.addEventListener("click", backToLanding);

function applyLoginModeUI() {
  if (isRegisterMode) {
    loginTitle.textContent = "Daftar Akun";
    loginSubtitle.textContent = "Buat akun baru untuk mulai menonton";
    submitBtn.textContent = "Daftar";
    toggleModeText.textContent = "Sudah punya akun?";
    toggleModeBtn.textContent = "Masuk";
  } else {
    loginTitle.textContent = "Masuk";
    loginSubtitle.textContent = "Masukkan email & kata sandi untuk melanjutkan";
    submitBtn.textContent = "Masuk";
    toggleModeText.textContent = "Belum punya akun?";
    toggleModeBtn.textContent = "Daftar sekarang";
  }
}

toggleModeBtn.addEventListener("click", () => {
  isRegisterMode = !isRegisterMode;
  applyLoginModeUI();
  loginError.textContent = "";
});

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("emailInput").value.trim();
  const pass = document.getElementById("passInput").value.trim();

  if (!email || !pass) {
    loginError.textContent = "Email dan kata sandi wajib diisi.";
    return;
  }
  if (pass.length < 4) {
    loginError.textContent = "Kata sandi minimal 4 karakter.";
    return;
  }
  // Demo auth: tidak ada backend, langsung dianggap berhasil.
  const displayName = email.split("@")[0];
  saveUser(displayName);
  showApp(getUser());
  buildPage();
});

logoutBtn.addEventListener("click", logout);

// ============================================================
// RENDER HALAMAN
// ============================================================
function buildPage() {
  // Hero pakai film pertama
  const hero = MOVIES[0];
  heroSection.style.backgroundImage = `url('${hero.banner}')`;
  heroBadge.textContent = "Film Original • " + hero.genre;
  heroTitle.textContent = hero.title;
  heroDesc.textContent = hero.description;
  heroPlayBtn.onclick = () => openMovie(hero.id);
  heroInfoBtn.onclick = () => openMovie(hero.id);

  renderRows(MOVIES);
}

function renderRows(movieList) {
  const categories = [...new Set(movieList.map(m => m.category))];
  rowsWrap.innerHTML = "";

  if (movieList.length === 0) {
    rowsWrap.innerHTML = `<p style="padding:0 20px;color:var(--abu)">Film tidak ditemukan.</p>`;
    return;
  }

  categories.forEach(cat => {
    const items = movieList.filter(m => m.category === cat);
    const rowEl = document.createElement("div");
    rowEl.className = "row";
    rowEl.innerHTML = `
      <div class="row-title">${cat}</div>
      <div class="row-scroll">
        ${items.map(cardHTML).join("")}
      </div>
    `;
    rowsWrap.appendChild(rowEl);
  });

  // pasang event click ke semua card
  document.querySelectorAll(".card").forEach(card => {
    card.addEventListener("click", () => openMovie(card.dataset.id));
  });
}

function cardHTML(m) {
  return `
    <div class="card" data-id="${m.id}">
      <img src="${m.poster}" alt="${m.title}" loading="lazy">
      <div class="card-info">
        <div class="card-title">${m.title}</div>
        <div class="card-meta">${m.year} · ${m.genre}</div>
      </div>
    </div>
  `;
}

// ---------- Search ----------
searchInput.addEventListener("input", () => {
  const q = searchInput.value.trim().toLowerCase();
  const filtered = MOVIES.filter(m =>
    m.title.toLowerCase().includes(q) ||
    m.genre.toLowerCase().includes(q)
  );
  renderRows(filtered);
});

// ============================================================
// MODAL FILM: PLAYER + FORUM/CHAT
// ============================================================
function openMovie(id) {
  const movie = MOVIES.find(m => m.id === id);
  if (!movie) return;
  currentMovie = movie;

  detailTitle.textContent = movie.title;
  detailMeta.innerHTML = `
    <span>${movie.rating}</span>
    <span class="dim">${movie.year}</span>
    <span class="dim">${movie.duration}</span>
    <span class="dim">${movie.genre}</span>
  `;
  detailDesc.textContent = movie.description;

  playerVideo.pause();
  playerVideo.src = movie.video;
  playerTrack.src = movie.subtitle;
  playerVideo.load();
  playerVideo.currentTime = 0;
  resetPlayerUI();

  renderChat(movie.id);

  modalBackdrop.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeMovie() {
  playerVideo.pause();
  modalBackdrop.classList.remove("open");
  document.body.style.overflow = "";
}
modalClose.addEventListener("click", closeMovie);
modalBackdrop.addEventListener("click", (e) => {
  if (e.target === modalBackdrop) closeMovie();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeMovie();
});

// ---------- Kontrol Video Custom ----------
function resetPlayerUI() {
  btnPlayPause.textContent = "▶";
  progressRange.value = 0;
  timeText.textContent = "00:00 / 00:00";
  volRange.value = playerVideo.volume;
  btnCC.classList.remove("active-cc");
  if (playerVideo.textTracks[0]) playerVideo.textTracks[0].mode = "hidden";
}

btnPlayPause.addEventListener("click", () => {
  if (playerVideo.paused) { playerVideo.play(); }
  else { playerVideo.pause(); }
});
playerVideo.addEventListener("play", () => btnPlayPause.textContent = "⏸");
playerVideo.addEventListener("pause", () => btnPlayPause.textContent = "▶");

btnBack10.addEventListener("click", () => {
  playerVideo.currentTime = Math.max(0, playerVideo.currentTime - 10);
});
btnFwd10.addEventListener("click", () => {
  playerVideo.currentTime = Math.min(playerVideo.duration || 0, playerVideo.currentTime + 10);
});

btnMute.addEventListener("click", () => {
  playerVideo.muted = !playerVideo.muted;
  btnMute.textContent = playerVideo.muted ? "🔇" : "🔊";
  volRange.value = playerVideo.muted ? 0 : playerVideo.volume;
});
volRange.addEventListener("input", () => {
  playerVideo.volume = volRange.value;
  playerVideo.muted = Number(volRange.value) === 0;
  btnMute.textContent = playerVideo.muted ? "🔇" : "🔊";
});

btnCC.addEventListener("click", () => {
  const track = playerVideo.textTracks[0];
  if (!track) return;
  const isOn = track.mode === "showing";
  track.mode = isOn ? "hidden" : "showing";
  btnCC.classList.toggle("active-cc", !isOn);
});

speedSelect.addEventListener("change", () => {
  playerVideo.playbackRate = Number(speedSelect.value);
});

btnFullscreen.addEventListener("click", () => {
  const wrap = document.querySelector(".player-wrap");
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else if (wrap.requestFullscreen) {
    wrap.requestFullscreen();
  }
});

playerVideo.addEventListener("timeupdate", () => {
  if (!playerVideo.duration) return;
  const pct = (playerVideo.currentTime / playerVideo.duration) * 100;
  progressRange.value = pct;
  timeText.textContent = `${fmtTime(playerVideo.currentTime)} / ${fmtTime(playerVideo.duration)}`;
});
progressRange.addEventListener("input", () => {
  if (!playerVideo.duration) return;
  playerVideo.currentTime = (progressRange.value / 100) * playerVideo.duration;
});

function fmtTime(sec) {
  if (isNaN(sec)) return "00:00";
  const m = Math.floor(sec / 60).toString().padStart(2, "0");
  const s = Math.floor(sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

// ============================================================
// FORUM / CHAT PER FILM
// ============================================================
function getComments(movieId) {
  try {
    return JSON.parse(localStorage.getItem(LS_COMMENT_PREFIX + movieId)) || [];
  } catch (e) { return []; }
}

function saveComments(movieId, comments) {
  localStorage.setItem(LS_COMMENT_PREFIX + movieId, JSON.stringify(comments));
}

function renderChat(movieId) {
  const comments = getComments(movieId);
  chatCount.textContent = `(${comments.length})`;

  if (comments.length === 0) {
    chatList.innerHTML = `<div class="chat-empty">Belum ada komentar. Jadilah yang pertama membahas film ini!</div>`;
  } else {
    chatList.innerHTML = comments.map(c => `
      <div class="chat-item">
        <div class="avatar" style="flex-shrink:0">${c.user.charAt(0).toUpperCase()}</div>
        <div class="chat-bubble">
          <div class="chat-user-row">
            <span class="chat-user">${escapeHTML(c.user)}</span>
            <span class="chat-time">${c.time}</span>
          </div>
          <div class="chat-text">${escapeHTML(c.text)}</div>
        </div>
      </div>
    `).join("");
  }
  chatList.scrollTop = chatList.scrollHeight;
}

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = chatInput.value.trim();
  if (!text || !currentMovie) return;
  const user = getUser();
  const comments = getComments(currentMovie.id);
  comments.push({
    user: user ? user.name : "Tamu",
    text,
    time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
  });
  saveComments(currentMovie.id, comments);
  chatInput.value = "";
  renderChat(currentMovie.id);
});

function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// ============================================================
// NAVBAR SCROLL EFFECT
// ============================================================
window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 30);
});

// ============================================================
// INIT
// ============================================================
(function init() {
  const user = getUser();
  if (user) {
    showApp(user);
    buildPage();
  } else {
    landingScreen.classList.remove("hidden");
    loginOverlay.classList.add("hidden");
    appRoot.classList.add("hidden");
  }
})();
