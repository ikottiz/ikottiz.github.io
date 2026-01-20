const MOVIE_ID = 152001;
const PROXY = "https://divine-band-6c25.ezgglmao1.workers.dev/?url=";
const BASE_API = "https://api.rstprgapipt.com/balancer-api/proxy/playlists/catalog-api";

const playerElement = document.getElementById('video-player');
const hls = new Hls();
const statusMsg = document.getElementById('status-msg');
const variantList = document.getElementById('variant-list');

const plyr = new Plyr(playerElement, {
    controls: [
        'play-large', // The large play button in the center
        'restart', // Restart playback
        'rewind', // Rewind by the seek time (default 10 seconds)
        'play', // Play/pause playback
        'fast-forward', // Fast forward by the seek time (default 10 seconds)
        'progress', // The progress bar and scrubber for playback and buffering
        'current-time', // The current time of playback
        'duration', // The full duration of the media
        'mute', // Toggle mute
        'volume', // Volume control
        'captions', // Toggle captions
        'settings', // Settings menu
        'pip', // Picture-in-picture (currently Safari only)
        'airplay', // Airplay (currently Safari only)
        'fullscreen', // Toggle fullscreen
    ]
});

const urlParams = new URLSearchParams(window.location.search);
let currentEp = parseInt(urlParams.get('ep')) || 1;

function startPlayer() {
    document.getElementById('custom-overlay').classList.add('hidden-overlay');
    loadEpisodeLinks(currentEp);
}

async function loadEpisodeLinks(epNum) {
    statusMsg.innerText = "Находим подходящее зеркало...";
    variantList.innerHTML = "";

    try {
        const url = `${BASE_API}/episodes?content-id=${MOVIE_ID}`;
        const proxyUrl = PROXY + encodeURIComponent(url);

        const response = await fetch(proxyUrl);

        if (!response.ok) throw new Error("404: СИГНАЛ ПОТЕРЯН");
        const apiEpisodes = await response.json();

        const target = apiEpisodes.find(e => e.order === epNum);

        if (!target || !target.episodeVariants) {
            statusMsg.innerText = "ОШИБКА: ДАННЫЕ НЕ НАЙДЕНЫ";
            return;
        }

        target.episodeVariants.forEach((v, i) => {
            const btn = document.createElement('button');
            btn.className = "v-btn";
            btn.innerText = v.title || "Стандарт";
            btn.onclick = () => playStream(v.filepath, btn);
            variantList.appendChild(btn);
            if (i === 0) playStream(v.filepath, btn);
        });

        statusMsg.innerText = "";
    } catch (err) {
        statusMsg.innerText = "КРИТИЧЕСКИЙ СБОЙ: " + err.message;
    }
}

function playStream(url, btn) {
    document.querySelectorAll('.v-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');

    if (url.endsWith('.m3u8')) {
        if (Hls.isSupported()) {
            hls.loadSource(url);
            hls.attachMedia(playerElement);
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                plyr.play();
            });
        } else if (playerElement.canPlayType('application/vnd.apple.mpegurl')) {
            playerElement.src = url;
            plyr.play();
        }
    } else {
        hls.detachMedia();
        playerElement.src = url;
        plyr.play();
    }
}

function updatePage(epNum) {
    const ep = episodes[epNum - 1];
    if (!ep) return;

    document.getElementById('ep-num').textContent = ep.num;
    document.getElementById('ep-title').textContent = ep.title;
    document.getElementById('ep-duration').textContent = ep.duration;
    document.getElementById('ep-desc').textContent = ep.desc;
    document.getElementById('overlay-bg-img').src = `assets/episode_${ep.num}.webp`;

    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    if (epNum > 1) {
        prevBtn.classList.remove('disabled');
        prevBtn.href = `player.html?ep=${epNum - 1}`;
        document.getElementById('prev-title').textContent = episodes[epNum - 2].title;
    } else {
        prevBtn.classList.add('disabled');
        prevBtn.href = '#';
        document.getElementById('prev-title').textContent = '—';
    }

    if (epNum < episodes.length) {
        nextBtn.classList.remove('disabled');
        nextBtn.href = `player.html?ep=${epNum + 1}`;
        document.getElementById('next-title').textContent = episodes[epNum].title;
    } else {
        nextBtn.classList.add('disabled');
        nextBtn.href = '#';
        document.getElementById('next-title').textContent = '—';
    }

    document.title = `Fallout | ${ep.title}`;
}

function renderEpisodesGrid() {
    const grid = document.getElementById('episodes-grid');
    grid.innerHTML = episodes.map(ep => `
        <a href="player.html?ep=${ep.num}" class="episode-card ${ep.num === currentEp ? 'current' : ''}">
            <img src="assets/episode_${ep.num}.webp" alt="${ep.title}">
            <div class="episode-card-overlay">
                <span class="episode-card-number">${ep.num}</span>
                <div class="episode-card-title">${ep.title}</div>
            </div>
        </a>
    `).join('');
}

updatePage(currentEp);
renderEpisodesGrid();
