const music = document.getElementById("music")
function getRandomInt(max) {
		return Math.floor(Math.random() * max);
	}
const random = getRandomInt(9)
const urls = {
	0: {name: "bbno$ - Let em Know", url: "https://kottiz.s-ul.eu/q7Qgj44x"},
	1: {name: "bbno$ - bag or die", url: "https://kottiz.s-ul.eu/zFCIDqVz"},
	2: {name: "bbno$ - Top Gun", url: "https://kottiz.s-ul.eu/In4RMezK"},
	3: {name: "bbno$ - I see London I see France", url: "https://kottiz.s-ul.eu/z4txShEd"},
	4: {name: "Benzz - Je Mapelle", url: "https://kottiz.s-ul.eu/5xnCY1Db"},
	5: {name: "GXD IN HXLL,DI$COVXRED SXRF,EXXXYDIRTY - SPACE EXPERIENCE", url: "https://kottiz.s-ul.eu/c8CcQwcK"},
	6: {name: "LXBERTY MXTION - Entropy", url: "https://kottiz.s-ul.eu/FpXs91n8"},
	7: {name: "Maikubi, VOLT VISION - Take Me Home", url: "https://kottiz.s-ul.eu/T89tL7YC"},
	8: {name: "Radzvbov - Landscape", url: "https://kottiz.s-ul.eu/0yG01hNQ"},
	9: {name: "Olly - Glitch", url: "https://kottiz.s-ul.eu/vdXNZoUe"},
}
var playing = random
function next() {
	if (playing < 9) {
	   playing = playing + 1
	} else {
	   playing = 0
	} 
}
function previous() {
	if (playing > 0) {
	   playing = playing - 1
	} else {
	   playing = 9
	}
}
function getPlaying(arg) {
	if (arg == "next") {
	  if (playing < 9) {
	    return playing + 1
	  } else {
	    return 0
	  }
	} else {
	  if (playing > 0) {
	    return playing - 1
	  } else {
	    return 9
	  }
	}
}
function secondsToTime(duration) {
  const hrs = ~~(duration / 3600);
  const mins = ~~((duration % 3600) / 60);
  const secs = ~~duration % 60;

  let ret = "";

  if (hrs > 0) {
    ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
  }

  ret += "" + mins + ":" + (secs < 10 ? "0" : "");
  ret += "" + secs;

  return ret;
}
volume.addEventListener("change", function(e) {
    music.volume = e.target.value / 100
})
function play() {
	const next = document.getElementById("next")
	const previous = document.getElementById("previous")
	const volume = document.getElementById("volume")
	volume.style.display = "block"
	music.src = urls[playing].url
	music.addEventListener("timeupdate", (event) => {
	status_text.innerHTML = "now playing: " + urls[playing].name + " " + secondsToTime(music.currentTime) + "/" + secondsToTime(music.duration) + " [" + Math.round(music.volume * 100) + "]"
	});
	next.innerHTML = "next: " + urls[getPlaying("next")].name
	previous.innerHTML = "previous: " + urls[getPlaying("previous")].name
	music.play()
}
