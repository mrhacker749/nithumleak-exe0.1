const $ = (id) => document.getElementById(id);
const intro = $("intro"), identity = $("identity"), reveal = $("reveal"), memories = $("memories");
const fill = $("progressFill"), percent = $("scanPercent");
let scanTimer;

function runScan() {
  let value = 0;
  scanTimer = setInterval(() => {
    value = Math.min(100, value + Math.floor(Math.random() * 13) + 5);
    fill.style.width = value + "%";
    percent.textContent = String(value).padStart(2, "0") + "%";
    if (value >= 100) clearInterval(scanTimer);
  }, 260);
}
runScan();

$("openArchive").addEventListener("click", () => {
  clearInterval(scanTimer);
  intro.classList.add("hidden");
  identity.classList.remove("hidden");
  $("visitorName").focus();
});

function unlock() {
  const name = $("visitorName").value.trim();
  if (!name) {
    $("nameError").textContent = "Name required. Even the archive has standards. 😭";
    $("visitorName").focus();
    return;
  }
  $("nameError").textContent = "";
  identity.classList.add("hidden");
  reveal.classList.remove("hidden");
  $("musicControl").classList.remove("hidden");
  $("musicLabel").textContent = "PLAY THE VIBE";
  launchConfetti();
  window.scrollTo({top: 0, behavior: "smooth"});
}
$("verifyButton").addEventListener("click", unlock);
$("visitorName").addEventListener("keydown", (event) => {
  if (event.key === "Enter") unlock();
});

$("startMemories").addEventListener("click", () => {
  memories.classList.remove("hidden");
  memories.scrollIntoView({behavior: "smooth"});
});

const audio = $("birthdayAudio");
const musicButton = $("musicButton");
musicButton.addEventListener("click", async () => {
  if (audio.paused) {
    try {
      await audio.play();
      musicButton.textContent = "Ⅱ";
      $("musicLabel").textContent = "NOW PLAYING";
    } catch {
      showToast("Add your soundtrack file to assets/music first.");
    }
  } else {
    audio.pause();
    musicButton.textContent = "▶";
    $("musicLabel").textContent = "PLAY THE VIBE";
  }
});
audio.addEventListener("error", () => {
  // The music file is optional; the website remains fully usable without it.
});

$("replayButton").addEventListener("click", () => {
  memories.classList.add("hidden");
  reveal.classList.add("hidden");
  $("musicControl").classList.add("hidden");
  identity.classList.add("hidden");
  intro.classList.remove("hidden");
  $("visitorName").value = "";
  fill.style.width = "0%";
  percent.textContent = "00%";
  runScan();
  window.scrollTo({top: 0, behavior: "smooth"});
});

function showToast(message) {
  const toast = $("toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2600);
}

function launchConfetti() {
  const colors = ["#e986a3", "#f4c96b", "#8bbbe8", "#a8d8b5", "#c5a4dd"];
  for (let i = 0; i < 95; i++) {
    const piece = document.createElement("span");
    piece.style.cssText = `position:fixed;z-index:15;top:-15px;left:${Math.random()*100}vw;width:${5+Math.random()*7}px;height:${8+Math.random()*10}px;background:${colors[Math.floor(Math.random()*colors.length)]};opacity:.9;pointer-events:none;border-radius:${Math.random()>.5?"50%":"2px"};transform:rotate(${Math.random()*180}deg);`;
    document.body.appendChild(piece);
    const duration = 2200 + Math.random() * 2200;
    const drift = (Math.random() - .5) * 240;
    const animation = piece.animate([
      { transform: "translate3d(0,0,0) rotate(0deg)", opacity: 1 },
      { transform: `translate3d(${drift}px,110vh,0) rotate(${500+Math.random()*700}deg)`, opacity: .1 }
    ], { duration, easing: "cubic-bezier(.2,.65,.35,1)" });
    animation.onfinish = () => piece.remove();
  }
}
