document.addEventListener("DOMContentLoaded", () => {
    const audio = document.getElementById("sound");
    const visualizerContainer = document.getElementById("visualizer-container");
    const clickText = document.getElementById("clickText");
    const trackInfo = document.getElementById("trackInfo");
    const timeInfo = document.getElementById("timeInfo");
    const progressBar = document.getElementById("progressBar");

    const trackName = "ты че обиделась";
    const artistName = "madk1d, тёмный принц";
    trackInfo.textContent = `${trackName} - ${artistName}`;

    let scene, camera, renderer, bars = [];
    let analyser, dataArray;
    let angle = 0;

    const initAudioContext = () => {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        const source = audioContext.createMediaElementSource(audio);
        source.connect(analyser);
        analyser.connect(audioContext.destination);
        analyser.fftSize = 128;

        const bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);
    };

    const init3DVisualizer = () => {
        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 2000);
        camera.position.set(100, 5, 100);
        camera.lookAt(0, 0, 0);

        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.shadowMap.enabled = true;
        visualizerContainer.appendChild(renderer.domElement);

        const barCount = 32;
        for (let i = 0; i < barCount; i++) {
            const geometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);

            const edges = new THREE.EdgesGeometry(geometry);
            const outlineMaterial = new THREE.LineBasicMaterial({ color: 0x76c7c0, linewidth: 1 });

            const outline = new THREE.LineSegments(edges, outlineMaterial);
            outline.position.x = i - barCount / 2;
            outline.position.y = 0.4;

            scene.add(outline);
            bars.push(outline);
        }

        const floorGeometry = new THREE.PlaneGeometry(50, 50);
        const floorMaterial = new THREE.MeshBasicMaterial({
            color: 0x000000, 
            transparent: true,
            opacity: 1,
        });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = 0;
        scene.add(floor);
    };

    let cameraTargetY = 1;

    const animate = () => {
        requestAnimationFrame(animate);
    
        if (analyser && dataArray) {
            analyser.getByteFrequencyData(dataArray);
    
            bars.forEach((bar, index) => {
                const scale = dataArray[index] / 10;
                bar.scale.y = Math.max(scale, 0.1);
            });
    
            const averageFrequency = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
            const speedFactor = averageFrequency / 256;
            const rotationSpeed = 0.005 + speedFactor * 0.05;
    
            angle += rotationSpeed;
    
            const radius = 15;
            camera.position.x = radius * Math.sin(angle);
            camera.position.z = radius * Math.cos(angle);
    
            const centeredBar = bars[Math.floor(bars.length / 2)];
            const barHeight = centeredBar.scale.y; 
            cameraTargetY = Math.max(barHeight / 2, 1);

            camera.position.y += (cameraTargetY - camera.position.y) * 0.1; 

            camera.lookAt(0, 0, 0);
        }
    
        renderer.render(scene, camera);
    };
    

    const updateProgress = () => {
        const currentTime = audio.currentTime;
        const duration = audio.duration;

        const formattedCurrentTime = formatTime(currentTime);
        const formattedDuration = formatTime(duration);

        timeInfo.textContent = `${formattedCurrentTime} / ${formattedDuration}`;
        progressBar.style.width = `${(currentTime / duration) * 100}%`;
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    clickText.addEventListener("click", () => {
        clickText.style.display = "none"; 
        initAudioContext();
        init3DVisualizer();
        animate();
        audio.play();
        document.getElementById("info").style.opacity = 1;

        audio.addEventListener("timeupdate", updateProgress);
    });

    window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
});
