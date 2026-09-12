// Spotify Clone - Audio Engine & Interaction Controller
console.log("Spotify Clone initializing with full MUSIC catalog...");

// Complete Catalog of all 12 songs in the MUSIC directory
const songs = [
    {
        id: 1,
        title: "One Love",
        artist: "Shubh",
        file: "128-One Love - Shubh 128 Kbps.mp3",
        cover: "covers/cover1.svg"
    },
    {
        id: 2,
        title: "Dhiktana Dhiktana (Hustle Flip)",
        artist: "Mad Trip",
        file: "Dhiktana Dhiktana The Hustle Flip - Mad Trip (pagalall.com).mp3",
        cover: "covers/cover2.svg"
    },
    {
        id: 3,
        title: "Die With A Smile",
        artist: "Lady Gaga & Bruno Mars",
        file: "Die With A Smile - PagalHits.mp3",
        cover: "covers/cover3.svg"
    },
    {
        id: 4,
        title: "Husn x Tune Jo Na Kaha",
        artist: "Anuv Jain & Mohit Chauhan",
        file: "Husn x Tune Jo Na Kaha (Complete Version) [TubeRipper.com].m4a",
        cover: "covers/cover4.svg"
    },
    {
        id: 5,
        title: "Kothi Bangle Wali",
        artist: "Mad Trip",
        file: "Kothi Bangle Wali - Mad Trip (pagalall.com).mp3",
        cover: "covers/cover5.svg"
    },
    {
        id: 6,
        title: "PYAAR (MTV Hustle 4)",
        artist: "Naam Sujal",
        file: "PYAAR_ (MTV Hustle 4) - Naam Sujal(Atozsong.in).mp3",
        cover: "covers/cover6.svg"
    },
    {
        id: 7,
        title: "Payal",
        artist: "Yo Yo Honey Singh & Paradox",
        file: "Payal.mp3",
        cover: "covers/cover7.svg"
    },
    {
        id: 8,
        title: "Aankhon Mein Doob Jaane Ko",
        artist: "THE 9TEEN & Sandesh Shandilya",
        file: "THE 9TEEN Sandesh Shandilya - Aankhon Mein Doob Jaane Ko (Lyrics) [TubeRipper.com].m4a",
        cover: "covers/cover8.svg"
    },
    {
        id: 9,
        title: "Heartbreak Kid",
        artist: "Talha Anjum",
        file: "Talha Anjum - Heartbreak Kid (Lyrics) [TubeRipper.com].m4a",
        cover: "covers/cover9.svg"
    },
    {
        id: 10,
        title: "Tu Hai Kahan",
        artist: "AUR",
        file: "Tu Hai Kahan_320(PagalWorld.com.so).mp3",
        cover: "covers/cover10.svg"
    },
    {
        id: 11,
        title: "Ye Tune Kya Kiya",
        artist: "Javed Bashir & Pritam",
        file: "Ye Tune Kya Kiya(PagalWorld.com.sb).mp3",
        cover: "covers/cover11.svg"
    },
    {
        id: 12,
        title: "Soulmate",
        artist: "Badshah & Arijit Singh",
        file: "_Soulmate_64(PagalWorld.com.sb).mp3",
        cover: "covers/cover12.svg"
    }
];

// Player State
let currentIndex = 0;
let isShuffle = false;
let isRepeat = false;
let lastVolume = 0.8;
let currentSong = new Audio();
currentSong.volume = 0.8;
currentSong.preload = "auto";

// DOM References
const sidebarSongList = document.getElementById("sidebarSongList");
const cardContainer = document.getElementById("cardContainer");
const playBtn = document.getElementById("play");
const playIconImg = document.getElementById("playIconImg");
const prevBtn = document.getElementById("previous");
const nextBtn = document.getElementById("next");
const shuffleBtn = document.getElementById("shuffleBtn");
const repeatBtn = document.getElementById("repeatBtn");
const currentTimeEl = document.getElementById("currentTime");
const totalDurationEl = document.getElementById("totalDuration");
const seekbar = document.getElementById("seekbar");
const seekProgress = document.getElementById("seekProgress");
const seekCircle = document.getElementById("seekCircle");
const songTitleEl = document.getElementById("songTitle");
const songArtistEl = document.getElementById("songArtist");
const currentTrackCover = document.getElementById("currentTrackCover");
const likeBtn = document.getElementById("likeBtn");
const likeIcon = document.getElementById("likeIcon");
const volumeBtn = document.getElementById("volumeBtn");
const volumeIcon = document.getElementById("volumeIcon");
const volumeSlider = document.getElementById("volumeSlider");
const playAllBtn = document.getElementById("playAllBtn");
const hamburgerBtn = document.getElementById("hamburgerBtn");
const closeSidebar = document.getElementById("closeSidebar");
const leftSidebar = document.querySelector(".left");

// Format seconds into MM:SS
function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return "00:00";
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

// Render Songs in Library Sidebar
function renderLibrary() {
    if (!sidebarSongList) return;
    sidebarSongList.innerHTML = "";

    songs.forEach((song, index) => {
        const li = document.createElement("li");
        li.dataset.index = index;
        li.className = index === currentIndex ? "playing-item" : "";

        li.innerHTML = `
            <div class="track-lead">
                <img class="track-thumb" src="${song.cover}" alt="${song.title}">
                <div class="info">
                    <div class="song-name" title="${song.title}">${song.title}</div>
                    <div class="artist-name" title="${song.artist}">${song.artist}</div>
                </div>
            </div>
            <div class="playnow" title="Play ${song.title}">
                <img class="invert" src="play-solid-full.svg" alt="Play">
            </div>
        `;

        li.addEventListener("click", () => {
            if (currentIndex === index && !currentSong.paused) {
                togglePlay();
            } else {
                loadSong(index, true);
            }
        });

        sidebarSongList.appendChild(li);
    });
}

// Render Songs in Playlist Cards Grid
function renderCards() {
    if (!cardContainer) return;
    cardContainer.innerHTML = "";

    songs.forEach((song, index) => {
        const card = document.createElement("div");
        card.dataset.index = index;
        card.className = `spotify-card ${index === currentIndex ? "card-playing" : ""}`;

        card.innerHTML = `
            <div class="album-cover">
                <img src="${song.cover}" alt="${song.title}">
                <button class="play-button" aria-label="Play ${song.title}" data-index="${index}">
                    <svg viewBox="0 0 24 24" class="play-icon">
                        <path d="M7.05 3.606l13.49 7.788a.7.7 0 010 1.212L7.05 20.394A.7.7 0 016 19.788V4.212a.7.7 0 011.05-.606z"></path>
                    </svg>
                </button>
            </div>
            <div class="track-info">
                <h4 class="track-title" title="${song.title}">${song.title}</h4>
                <p class="artist-name" title="${song.artist}">${song.artist}</p>
            </div>
        `;

        // Card click event
        card.addEventListener("click", (e) => {
            // Play button or whole card
            if (currentIndex === index && !currentSong.paused) {
                togglePlay();
            } else {
                loadSong(index, true);
            }
        });

        cardContainer.appendChild(card);
    });
}

// Update Active Highlights in Sidebar & Cards
function updateActiveUI() {
    // Update sidebar items
    const listItems = sidebarSongList?.querySelectorAll("li") || [];
    listItems.forEach((li, i) => {
        const playImg = li.querySelector(".playnow img");
        if (i === currentIndex) {
            li.classList.add("playing-item");
            if (playImg) {
                playImg.src = currentSong.paused ? "play-solid-full.svg" : "pause-solid-full.svg";
            }
        } else {
            li.classList.remove("playing-item");
            if (playImg) {
                playImg.src = "play-solid-full.svg";
            }
        }
    });

    // Update main cards
    const cards = cardContainer?.querySelectorAll(".spotify-card") || [];
    cards.forEach((card, i) => {
        const playBtnSvg = card.querySelector(".play-button");
        if (i === currentIndex) {
            card.classList.add("card-playing");
            if (playBtnSvg) {
                if (currentSong.paused) {
                    playBtnSvg.innerHTML = `
                        <svg viewBox="0 0 24 24" class="play-icon">
                            <path d="M7.05 3.606l13.49 7.788a.7.7 0 010 1.212L7.05 20.394A.7.7 0 016 19.788V4.212a.7.7 0 011.05-.606z"></path>
                        </svg>
                    `;
                } else {
                    playBtnSvg.innerHTML = `
                        <svg viewBox="0 0 24 24" class="play-icon" style="fill: #000;">
                            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path>
                        </svg>
                    `;
                }
            }
        } else {
            card.classList.remove("card-playing");
            if (playBtnSvg) {
                playBtnSvg.innerHTML = `
                    <svg viewBox="0 0 24 24" class="play-icon">
                        <path d="M7.05 3.606l13.49 7.788a.7.7 0 010 1.212L7.05 20.394A.7.7 0 016 19.788V4.212a.7.7 0 011.05-.606z"></path>
                    </svg>
                `;
            }
        }
    });

    // Update playbar main button
    if (playIconImg) {
        playIconImg.src = currentSong.paused ? "play-solid-full.svg" : "pause-solid-full.svg";
    }
}

// Load and optionally Play a Song
function loadSong(index, autoPlay = true) {
    if (index < 0 || index >= songs.length) return;
    currentIndex = index;
    const song = songs[currentIndex];

    // Set song source with fallback support for brackets and spaces
    const cleanFileName = song.file;
    // Prefer encodeURI so slashes and standard characters are preserved
    const songPath = "MUSIC/" + encodeURI(cleanFileName);
    currentSong.src = songPath;
    currentSong.load();

    // Update playbar display
    if (songTitleEl) songTitleEl.textContent = song.title;
    if (songArtistEl) songArtistEl.textContent = song.artist;
    if (currentTrackCover) currentTrackCover.src = song.cover;
    if (document.title) document.title = `${song.title} • ${song.artist} | Spotify`;

    // Reset progress
    if (seekProgress) seekProgress.style.width = "0%";
    if (seekCircle) seekCircle.style.left = "0%";
    if (currentTimeEl) currentTimeEl.textContent = "00:00";
    if (totalDurationEl) totalDurationEl.textContent = "00:00";

    if (autoPlay) {
        const playPromise = currentSong.play();
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    updateActiveUI();
                })
                .catch((err) => {
                    console.warn("Autoplay was prevented by browser:", err);
                    updateActiveUI();
                });
        }
    } else {
        updateActiveUI();
    }
}

// Toggle Play/Pause
function togglePlay() {
    if (!currentSong.src || currentSong.src === "" || currentSong.src.endsWith("/")) {
        loadSong(currentIndex, true);
        return;
    }

    if (currentSong.paused) {
        currentSong.play()
            .then(() => updateActiveUI())
            .catch(err => console.error("Playback error:", err));
    } else {
        currentSong.pause();
        updateActiveUI();
    }
}

// Play Next Track
function playNext() {
    if (isShuffle) {
        let randomIndex = currentIndex;
        while (songs.length > 1 && randomIndex === currentIndex) {
            randomIndex = Math.floor(Math.random() * songs.length);
        }
        loadSong(randomIndex, true);
    } else {
        const nextIndex = (currentIndex + 1) % songs.length;
        loadSong(nextIndex, true);
    }
}

// Play Previous Track
function playPrevious() {
    // If playing for more than 3 seconds, restart the song
    if (currentSong.currentTime > 3) {
        currentSong.currentTime = 0;
        return;
    }

    if (isShuffle) {
        let randomIndex = currentIndex;
        while (songs.length > 1 && randomIndex === currentIndex) {
            randomIndex = Math.floor(Math.random() * songs.length);
        }
        loadSong(randomIndex, true);
    } else {
        const prevIndex = (currentIndex - 1 + songs.length) % songs.length;
        loadSong(prevIndex, true);
    }
}

// Volume Controls
function setVolume(value) {
    const volumeLevel = Math.max(0, Math.min(1, value / 100));
    currentSong.volume = volumeLevel;
    if (volumeSlider) volumeSlider.value = value;

    if (volumeIcon) {
        if (volumeLevel === 0) {
            volumeIcon.src = "mute.svg";
        } else {
            volumeIcon.src = "volume.svg";
        }
    }

    if (volumeLevel > 0) {
        lastVolume = volumeLevel;
    }
}

function toggleMute() {
    if (currentSong.volume > 0) {
        lastVolume = currentSong.volume;
        setVolume(0);
    } else {
        setVolume(lastVolume > 0 ? lastVolume * 100 : 80);
    }
}

// Seekbar Interaction
function handleSeek(e) {
    if (!seekbar || !currentSong.duration) return;
    const rect = seekbar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = Math.max(0, Math.min(1, clickX / width));
    
    currentSong.currentTime = percentage * currentSong.duration;
    if (seekProgress) seekProgress.style.width = (percentage * 100) + "%";
    if (seekCircle) seekCircle.style.left = (percentage * 100) + "%";
}

// Like Button Toggle
function toggleLike() {
    if (!likeBtn || !likeIcon) return;
    const isLiked = likeBtn.classList.toggle("liked");
    if (isLiked) {
        likeIcon.src = "heart-filled.svg";
        likeBtn.style.transform = "scale(1.2)";
        setTimeout(() => { likeBtn.style.transform = "scale(1)"; }, 200);
    } else {
        likeIcon.src = "heart.svg";
    }
}

// Audio Event Listeners
currentSong.addEventListener("timeupdate", () => {
    if (currentSong.duration) {
        const progressPercent = (currentSong.currentTime / currentSong.duration) * 100;
        if (seekProgress) seekProgress.style.width = `${progressPercent}%`;
        if (seekCircle) seekCircle.style.left = `${progressPercent}%`;
        if (currentTimeEl) currentTimeEl.textContent = formatTime(currentSong.currentTime);
        if (totalDurationEl) totalDurationEl.textContent = formatTime(currentSong.duration);
    }
});

currentSong.addEventListener("loadedmetadata", () => {
    if (totalDurationEl && !isNaN(currentSong.duration)) {
        totalDurationEl.textContent = formatTime(currentSong.duration);
    }
});

// Audio Error Fallback Handling
currentSong.addEventListener("error", (e) => {
    console.warn("Audio loading notice:", currentSong.src, e);
    const activeSong = songs[currentIndex];
    if (!activeSong) return;

    // If encoded with %5B / %5D, try literal [ and ] or vice-versa
    if (currentSong.src.includes("%5B") || currentSong.src.includes("%5D")) {
        const decoded = currentSong.src.replace(/%5B/g, "[").replace(/%5D/g, "]");
        console.log("Retrying audio with decoded brackets:", decoded);
        currentSong.src = decoded;
        currentSong.load();
        currentSong.play().catch(() => {});
    } else if (currentSong.src.includes("[") || currentSong.src.includes("]")) {
        const encoded = currentSong.src.replace(/\[/g, "%5B").replace(/\]/g, "%5D");
        console.log("Retrying audio with encoded brackets:", encoded);
        currentSong.src = encoded;
        currentSong.load();
        currentSong.play().catch(() => {});
    }
});

currentSong.addEventListener("ended", () => {
    if (isRepeat) {
        currentSong.currentTime = 0;
        currentSong.play();
    } else {
        playNext();
    }
});

currentSong.addEventListener("play", updateActiveUI);
currentSong.addEventListener("pause", updateActiveUI);

// Event Listeners for UI Controls
if (playBtn) playBtn.addEventListener("click", togglePlay);
if (nextBtn) nextBtn.addEventListener("click", playNext);
if (prevBtn) prevBtn.addEventListener("click", playPrevious);

if (shuffleBtn) {
    shuffleBtn.addEventListener("click", () => {
        isShuffle = !isShuffle;
        shuffleBtn.classList.toggle("active", isShuffle);
        shuffleBtn.title = isShuffle ? "Shuffle On (S)" : "Shuffle Off (S)";
    });
}

if (repeatBtn) {
    repeatBtn.addEventListener("click", () => {
        isRepeat = !isRepeat;
        repeatBtn.classList.toggle("active", isRepeat);
        repeatBtn.title = isRepeat ? "Repeat On (R)" : "Repeat Off (R)";
    });
}

if (playAllBtn) {
    playAllBtn.addEventListener("click", () => {
        loadSong(0, true);
    });
}

if (volumeSlider) {
    volumeSlider.addEventListener("input", (e) => {
        setVolume(e.target.value);
    });
}

if (volumeBtn) {
    volumeBtn.addEventListener("click", toggleMute);
}

if (likeBtn) {
    likeBtn.addEventListener("click", toggleLike);
}

if (seekbar) {
    let isDragging = false;
    seekbar.addEventListener("mousedown", (e) => {
        isDragging = true;
        handleSeek(e);
    });
    window.addEventListener("mousemove", (e) => {
        if (isDragging) handleSeek(e);
    });
    window.addEventListener("mouseup", () => {
        isDragging = false;
    });
}

// Mobile Drawer Navigation
if (hamburgerBtn && leftSidebar) {
    hamburgerBtn.addEventListener("click", () => {
        leftSidebar.classList.add("show");
    });
}

if (closeSidebar && leftSidebar) {
    closeSidebar.addEventListener("click", () => {
        leftSidebar.classList.remove("show");
    });
}

// Global Keyboard Shortcuts for Pro Experience
window.addEventListener("keydown", (e) => {
    // Avoid triggering if typing in an input
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

    switch (e.code) {
        case "Space":
            e.preventDefault();
            togglePlay();
            break;
        case "ArrowRight":
            if (e.shiftKey) {
                playNext();
            } else {
                e.preventDefault();
                currentSong.currentTime = Math.min(currentSong.duration || 0, currentSong.currentTime + 5);
            }
            break;
        case "ArrowLeft":
            if (e.shiftKey) {
                playPrevious();
            } else {
                e.preventDefault();
                currentSong.currentTime = Math.max(0, currentSong.currentTime - 5);
            }
            break;
        case "ArrowUp":
            e.preventDefault();
            setVolume(Math.min(100, (currentSong.volume * 100) + 5));
            break;
        case "ArrowDown":
            e.preventDefault();
            setVolume(Math.max(0, (currentSong.volume * 100) - 5));
            break;
        case "KeyN":
            playNext();
            break;
        case "KeyP":
            playPrevious();
            break;
        case "KeyM":
            toggleMute();
            break;
        case "KeyS":
            if (shuffleBtn) shuffleBtn.click();
            break;
        case "KeyR":
            if (repeatBtn) repeatBtn.click();
            break;
    }
});

// App Initialization
function init() {
    renderLibrary();
    renderCards();
    loadSong(0, false); // Load the first song in ready state
    console.log("Spotify Clone ready! 12 songs loaded.");
}

init();