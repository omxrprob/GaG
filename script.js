let growth = 0;
let coins = 0;
let growthPerClick = 1;
let autoGrowInterval = null;
let selectedColors = [];
let canvas, ctx;

const forbiddenWords = ['fuck', 'shit', 'bitch', 'ass', 'dick', 'piss', 'whore'];

function startGame() {
  const type = document.getElementById("plantType").value;
  const nameInput = document.getElementById("customName").value.toLowerCase();

  if (type === "custom") {
    if (forbiddenWords.some(word => nameInput.includes(word))) {
      alert("No bad words allowed!");
      return;
    }

    const color1 = document.getElementById("customColor1").value;
    const color2 = document.getElementById("customColor2").value;
    selectedColors = [color1, color2];
  } else {
    selectedColors = getPresetColors(type);
  }

  document.getElementById("plantSelect").style.display = "none";
  document.getElementById("game").style.display = "block";
  canvas = document.getElementById("plantCanvas");
  ctx = canvas.getContext("2d");

  drawPlant();
  updateUI();
}

function getPresetColors(type) {
  switch (type) {
    case 'funblossom': return [randomColor(), randomColor()];
    case 'darkfruit': return ['#8b0000', '#000000'];
    case 'flamefruit': return ['#ff4500', '#ffae00'];
    case 'dragonblossom': return ['#228B22', '#ff0000'];
    case 'bluefruit': return ['#0066ff', '#00ccff'];
    case 'bubblegumfruit': return ['#ff69b4', '#ffc0cb'];
    case 'swordfruit': return ['#c0c0c0', '#808080'];
    default: return ['#00ff00', '#ff00ff'];
  }
}

function darkenColor(hex, percent) {
  const num = parseInt(hex.slice(1), 16);
  const r = Math.floor((num >> 16) * (1 - percent));
  const g = Math.floor(((num >> 8) & 0x00FF) * (1 - percent));
  const b = Math.floor((num & 0x0000FF) * (1 - percent));
  return `rgb(${r},${g},${b})`;
}

function drawPlant() {
  ctx.clearRect(0, 0, 200, 200);
  const darkerColors = selectedColors.map(c => darkenColor(c, growth / 100));
  const radius = 40 + growth;

  // Draw two overlapping circles for the plant
  ctx.fillStyle = darkerColors[0];
  ctx.beginPath();
  ctx.arc(100, 100, radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = darkerColors[1];
  ctx.beginPath();
  ctx.arc(120, 80, radius / 2, 0, Math.PI * 2);
  ctx.fill();
}

function grow() {
  growth += growthPerClick;
  coins += 1;
  drawPlant();
  updateUI();
  checkUpgrades();
}

function updateUI() {
  document.getElementById("growth").textContent = growth;
  document.getElementById("coins").textContent = coins;
}

function checkUpgrades() {
  document.getElementById("fertilizerBtn").disabled = coins < 50 || growthPerClick > 1;
  document.getElementById("autoGrowBtn").disabled = coins < 100 || autoGrowInterval !== null;
}

function buyFertilizer() {
  if (coins >= 50) {
    coins -= 50;
    growthPerClick = 2;
    updateUI();
    checkUpgrades();
  }
}

function buyAutoGrow() {
  if (coins >= 100 && autoGrowInterval === null) {
    coins -= 100;
    autoGrowInterval = setInterval(() => {
      growth += 1;
      coins += 1;
      drawPlant();
      updateUI();
      checkUpgrades();
    }, 1000);
    updateUI();
  }
}

function randomColor() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

// Show/hide custom inputs
document.getElementById("plantType").addEventListener("change", (e) => {
  document.getElementById("customOptions").style.display = e.target.value === "custom" ? "block" : "none";
});
