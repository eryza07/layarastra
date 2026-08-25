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
const navLogoBtn = document.getElementById("navLogoBtn");
const watchLogoBtn = document.getElementById("watchLogoBtn");
const userChip = document.getElementById("userChip");
const userInitial = document.getElementById("userInitial");
const userNameLabel = document.getElementById("userNameLabel");
const searchInput = document.getElementById("searchInput");
const searchToggleBtn = document.getElementById("searchToggleBtn");
const searchCloseBtn = document.getElementById("searchCloseBtn");
const searchPanel = document.getElementById("searchPanel");

// Dropdown menu profil
const userDropdown = document.getElementById("userDropdown");
const menuProfileBtn = document.getElementById("menuProfileBtn");
const menuSettingsBtn = document.getElementById("menuSettingsBtn");
const menuLogoutBtn = document.getElementById("menuLogoutBtn");

// Modal profil
const profileModalBackdrop = document.getElementById("profileModalBackdrop");
const profileModalClose = document.getElementById("profileModalClose");
const profileAvatarBig = document.getElementById("profileAvatarBig");
const profileNameBig = document.getElementById("profileNameBig");
const profileEmailBig = document.getElementById("profileEmailBig");
const statFilmCount = document.getElementById("statFilmCount");
const statCommentCount = document.getElementById("statCommentCount");
const profileToSettingsBtn = document.getElementById("profileToSettingsBtn");

// Modal pengaturan
const settingsModalBackdrop = document.getElementById("settingsModalBackdrop");
const settingsModalClose = document.getElementById("settingsModalClose");
const settingsForm = document.getElementById("settingsForm");
const settingsNameInput = document.getElementById("settingsNameInput");
const settingsAutoplayToggle = document.getElementById("settingsAutoplayToggle");
const settingsSubtitleToggle = document.getElementById("settingsSubtitleToggle");
const settingsClearCommentsBtn = document.getElementById("settingsClearCommentsBtn");
const settingsLogoutBtn = document.getElementById("settingsLogoutBtn");

const heroSection = document.getElementById("heroSection");
const heroBadge = document.getElementById("heroBadge");
const heroTitle = document.getElementById("heroTitle");
const heroDesc = document.getElementById("heroDesc");
const heroPlayBtn = document.getElementById("heroPlayBtn");
const heroInfoBtn = document.getElementById("heroInfoBtn");

const rowsWrap = document.getElementById("rowsWrap");

const watchScreen = document.getElementById("watchScreen");
const watchBackBtn = document.getElementById("watchBackBtn");
const relatedRow = document.getElementById("relatedRow");

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

function saveUser(name, email) {
  localStorage.setItem(LS_USER_KEY, JSON.stringify({ name, email, loginAt: Date.now() }));
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
  saveUser(displayName, email);
  showApp(getUser());
  buildPage();
});

// ============================================================
// DROPDOWN MENU PROFIL (di navbar)
// ============================================================
userChip.addEventListener("click", (e) => {
  e.stopPropagation();
  userDropdown.classList.toggle("hidden");
});
document.addEventListener("click", (e) => {
  if (!userDropdown.classList.contains("hidden") && !userDropdown.contains(e.target) && e.target !== userChip) {
    userDropdown.classList.add("hidden");
  }
});

menuProfileBtn.addEventListener("click", () => {
  userDropdown.classList.add("hidden");
  openProfileModal();
});
menuSettingsBtn.addEventListener("click", () => {
  userDropdown.classList.add("hidden");
  openSettingsModal();
});
menuLogoutBtn.addEventListener("click", () => {
  userDropdown.classList.add("hidden");
  logout();
});

// ============================================================
// MODAL PROFIL
// ============================================================
function openProfileModal() {
  const user = getUser();
  if (!user) return;
  profileAvatarBig.textContent = user.name.charAt(0).toUpperCase();
  profileNameBig.textContent = user.name;
  profileEmailBig.textContent = user.email || "-";
  statFilmCount.textContent = MOVIES.length;

  let totalComments = 0;
  MOVIES.forEach(m => {
    const comments = getComments(m.id);
    totalComments += comments.filter(c => c.user === user.name).length;
  });
  statCommentCount.textContent = totalComments;

  profileModalBackdrop.classList.remove("hidden");
}
profileModalClose.addEventListener("click", () => profileModalBackdrop.classList.add("hidden"));
profileModalBackdrop.addEventListener("click", (e) => {
  if (e.target === profileModalBackdrop) profileModalBackdrop.classList.add("hidden");
});
profileToSettingsBtn.addEventListener("click", () => {
  profileModalBackdrop.classList.add("hidden");
  openSettingsModal();
});

// ============================================================
// MODAL PENGATURAN
// ============================================================
const LS_SETTINGS_KEY = "nf_settings";

function getSettings() {
  try {
    return Object.assign(
      { autoplay: true, subtitleDefault: false },
      JSON.parse(localStorage.getItem(LS_SETTINGS_KEY)) || {}
    );
  } catch (e) {
    return { autoplay: true, subtitleDefault: false };
  }
}
function saveSettings(settings) {
  localStorage.setItem(LS_SETTINGS_KEY, JSON.stringify(settings));
}

function openSettingsModal() {
  const user = getUser();
  const settings = getSettings();
  settingsNameInput.value = user ? user.name : "";
  settingsAutoplayToggle.checked = settings.autoplay;
  settingsSubtitleToggle.checked = settings.subtitleDefault;
  settingsModalBackdrop.classList.remove("hidden");
}
settingsModalClose.addEventListener("click", () => settingsModalBackdrop.classList.add("hidden"));
settingsModalBackdrop.addEventListener("click", (e) => {
  if (e.target === settingsModalBackdrop) settingsModalBackdrop.classList.add("hidden");
});

settingsForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const newName = settingsNameInput.value.trim();
  const user = getUser();
  if (newName && user) {
    saveUser(newName, user.email);
    userInitial.textContent = newName.charAt(0).toUpperCase();
    userNameLabel.textContent = newName;
  }
  saveSettings({
    autoplay: settingsAutoplayToggle.checked,
    subtitleDefault: settingsSubtitleToggle.checked
  });
  settingsModalBackdrop.classList.add("hidden");
});

settingsClearCommentsBtn.addEventListener("click", () => {
  const user = getUser();
  if (!user) return;
  if (!confirm("Hapus semua komentar yang pernah kamu tulis di semua film?")) return;
  MOVIES.forEach(m => {
    const remaining = getComments(m.id).filter(c => c.user !== user.name);
    saveComments(m.id, remaining);
  });
  alert("Semua komentar kamu sudah dihapus.");
});

settingsLogoutBtn.addEventListener("click", logout);

// ============================================================
// RENDER HALAMAN
// ============================================================

// Urutan tampil: film yang PALING TERAKHIR ditambahkan di data.js
// (paling bawah array) otomatis muncul PALING DEPAN di website.
function orderedMovies() {
  return [...MOVIES].reverse();
}

function buildPage() {
  const list = orderedMovies();

  // Hero pakai film paling baru ditambahkan
  const hero = list[0];
  heroSection.style.backgroundImage = `url('${hero.banner}')`;
  heroBadge.textContent = "Film Original • " + hero.genre;
  heroTitle.textContent = hero.title;
  heroDesc.textContent = hero.description;
  heroPlayBtn.onclick = () => openMovie(hero.id);
  heroInfoBtn.onclick = () => openMovie(hero.id);

  renderRows(list);
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
  const filtered = orderedMovies().filter(m =>
    m.title.toLowerCase().includes(q) ||
    m.genre.toLowerCase().includes(q)
  );
  renderRows(filtered);
});

// Tombol ikon search (HP) -> buka popup pencarian
searchToggleBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  searchPanel.classList.remove("hidden");
  searchInput.focus();
});
searchCloseBtn.addEventListener("click", () => {
  searchPanel.classList.add("hidden");
  searchInput.value = "";
  renderRows(orderedMovies());
});
// Klik di luar popup search -> otomatis tutup (hanya berlaku saat mode popup/HP)
document.addEventListener("click", (e) => {
  const isDesktopInline = window.innerWidth >= 700;
  if (isDesktopInline) return;
  if (!searchPanel.classList.contains("hidden") &&
      !searchPanel.contains(e.target) &&
      e.target !== searchToggleBtn) {
    searchPanel.classList.add("hidden");
  }
});

// ---------- Klik logo navbar -> balik ke halaman utama (daftar rekomendasi) ----------
function goHome() {
  if (!watchScreen.classList.contains("hidden")) {
    closeMovie();
  }
  searchInput.value = "";
  renderRows(orderedMovies());
  searchPanel.classList.add("hidden");
  userDropdown.classList.add("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}
navLogoBtn.addEventListener("click", goHome);
watchLogoBtn.addEventListener("click", goHome);

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
  renderRelated(movie);

  // Pindah dari halaman browse ke halaman tonton (bukan popup)
  appRoot.classList.add("hidden");
  watchScreen.classList.remove("hidden");
  watchScreen.scrollTop = 0;
  window.scrollTo(0, 0);
}

function closeMovie() {
  playerVideo.pause();
  watchScreen.classList.add("hidden");
  appRoot.classList.remove("hidden");
  window.scrollTo(0, 0);
}
watchBackBtn.addEventListener("click", closeMovie);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !watchScreen.classList.contains("hidden")) closeMovie();
});

// Putar otomatis film berikutnya (sesuai pengaturan "Putar Otomatis")
playerVideo.addEventListener("ended", () => {
  if (!getSettings().autoplay || !currentMovie) return;
  const others = MOVIES.filter(m => m.id !== currentMovie.id && m.category === currentMovie.category);
  const next = others[0] || MOVIES.find(m => m.id !== currentMovie.id);
  if (next) openMovie(next.id);
});

function renderRelated(movie) {
  const others = MOVIES.filter(m => m.id !== movie.id && m.category === movie.category);
  const list = (others.length ? others : MOVIES.filter(m => m.id !== movie.id)).slice(0, 10);
  relatedRow.innerHTML = list.map(sidebarCardHTML).join("");
  relatedRow.querySelectorAll(".sidebar-card").forEach(card => {
    card.addEventListener("click", () => openMovie(card.dataset.id));
  });
}

function sidebarCardHTML(m) {
  return `
    <div class="sidebar-card" data-id="${m.id}">
      <img class="sidebar-thumb" src="${m.banner || m.poster}" alt="${m.title}" loading="lazy">
      <div class="sidebar-info">
        <div class="sidebar-card-title">${m.title}</div>
        <div class="sidebar-card-meta">${m.year} · ${m.genre}</div>
      </div>
    </div>
  `;
}

// ---------- Kontrol Video Custom ----------
function resetPlayerUI() {
  btnPlayPause.textContent = "▶";
  progressRange.value = 0;
  timeText.textContent = "00:00 / 00:00";
  volRange.value = playerVideo.volume;

  const wantSubtitle = getSettings().subtitleDefault;
  btnCC.classList.toggle("active-cc", wantSubtitle);
  if (playerVideo.textTracks[0]) {
    playerVideo.textTracks[0].mode = wantSubtitle ? "showing" : "hidden";
  }
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
