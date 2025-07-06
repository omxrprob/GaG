let money = 100;
let inventory = [];
let favorite = null;
let heldItem = null;
let stock = [];
let stockTimer = null;

const forbiddenWords = ['fuck','shit','bitch','ass','dick','piss','whore'];

const seeds = [
  { name: "Apple", colors: ["#ff0000", "#990000"], growTime: 10, basePrice: 5, rarity: 1 },
  { name: "Funblossom", colors: ["#ff00ff", "#00ffff"], growTime: 12, basePrice: 10, rarity: 2 },
  { name: "Dark Fruit", colors: ["#8b0000", "#000000"], growTime: 20, basePrice: 20, rarity: 3 },
  { name: "Flamefruit", colors: ["#ff4500", "#ffa500"], growTime: 30, basePrice: 25, rarity: 3 },
  { name: "Dragon Blossom", colors: ["#228B22", "#ff0000"], growTime: 35, basePrice: 30, rarity: 4 },
  { name: "Blue Fruit", colors: ["#0000ff", "#3399ff"], growTime: 18, basePrice: 15, rarity: 2 },
  { name: "Bubblegum Fruit", colors: ["#ff69b4", "#ffc0cb"], growTime: 16, basePrice: 12, rarity: 2 },
  { name: "Sword Fruit", colors: ["#999999", "#cccccc"], growTime: 25, basePrice: 20, rarity: 3 }
];

let plots = [{ id: 0, seed: seeds[0], plantedAt: Date.now(), watered: false }];

function renderFarm() {
  const container = document.getElementById("plots");
  container.innerHTML = "";
  plots.forEach((plot, i) => {
    const div = document.createElement("div");
    div.className = "plot";
    div.style.background = `linear-gradient(45deg, ${plot.seed.colors[0]}, ${plot.seed.colors[1]})`;

    let timePassed = (Date.now() - plot.plantedAt) / 1000;
    let growTime = plot.seed.growTime;
    if (plot.watered) growTime *= 0.5;
    const done = timePassed >= growTime;

    if (!done) div.classList.add("growing");

    div.innerHTML = `${plot.seed.name}<br>${Math.min(100, Math.floor((timePassed / growTime) * 100))}%`;

    div.onclick = () => {
      if (done) {
        heldItem = plot.seed;
        plot.seed = null;
        container.removeChild(div);
        plots.splice(i, 1);
        updateUI();
        renderFarm();
      }
    };

    container.appendChild(div);
  });
}

function updateUI() {
  document.getElementById("money").textContent = money;
  document.getElementById("inventoryCount").textContent = inventory.length;
  document.getElementById("favoriteItem").textContent = favorite || "None";
  document.getElementById("heldItem").textContent = heldItem ? heldItem.name : "None";
}

function useWater() {
  plots.forEach(p => p.watered = true);
}

function useShovel() {
  plots = plots.filter(p => {
    if (p.seed && !confirm(`Remove ${p.seed.name}?`)) return true;
    return false;
  });
  renderFarm();
}

function openCustomDialog(price) {
  document.getElementById("customFruitDialog").style.display = "block";
  document.getElementById("customFruitDialog").dataset.price = price;
}

function closeCustomDialog() {
  document.getElementById("customFruitDialog").style.display = "none";
}

function confirmCustomFruit() {
  const name = document.getElementById("customName").value;
  if (forbiddenWords.some(w => name.toLowerCase().includes(w))) return alert("No bad words!");
  const color1 = document.getElementById("customColor1").value;
  const color2 = document.getElementById("customColor2").value;
  const price = +document.getElementById("customFruitDialog").dataset.price;
  if (money < price) return alert("Not enough money!");

  const custom = {
    name: name || "Custom Fruit",
    colors: [color1, color2],
    growTime: 20,
    basePrice: 15,
    rarity: 2
  };
  money -= price;
  plots.push({ id: Date.now(), seed: custom, plantedAt: Date.now(), watered: false });
  closeCustomDialog();
  updateUI();
  renderFarm();
}

function sellHeld() {
  if (!heldItem) return alert("Nothing held.");
  money += heldItem.basePrice;
  heldItem = null;
  updateUI();
}

function sellInventory() {
  const total = inventory.filter(i => i.name !== favorite).reduce((a, b) => a + b.basePrice, 0);
  inventory = inventory.filter(i => i.name === favorite);
  money += total;
  updateUI();
  alert(`Sold for $${total}`);
}

function checkWorth() {
  if (!heldItem) return alert("Nothing held.");
  alert(`${heldItem.name} is worth $${heldItem.basePrice}`);
}

function cancelSeller() {
  alert("Come back when you're ready to sell.");
}

function restockShop() {
  const shop = document.getElementById("stockList");
  shop.innerHTML = "";
  stock = [];

  for (const s of seeds) {
    if (Math.random() < 1 / s.rarity) stock.push(s);
  }

  if (Math.random() < 0.5) {
    const price = Math.floor(Math.random() * 31) + 20;
    const btn = document.createElement("button");
    btn.textContent = `Custom Fruit ($${price})`;
    btn.onclick = () => openCustomDialog(price);
    shop.appendChild(btn);
  }

  stock.forEach(seed => {
    const btn = document.createElement("button");
    btn.textContent = `${seed.name} ($${seed.basePrice})`;
    btn.onclick = () => {
      if (money >= seed.basePrice) {
        money -= seed.basePrice;
        plots.push({ id: Date.now(), seed: seed, plantedAt: Date.now(), watered: false });
        renderFarm();
        updateUI();
      } else alert("Not enough money!");
    };
    shop.appendChild(btn);
  });
}

updateUI();
renderFarm();
restockShop();
stockTimer = setInterval(restockShop, 120000); // restock every 2 min
