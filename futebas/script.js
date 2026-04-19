const teamCountSelect = document.querySelector("#team-count");
const playersPerTeamSelect = document.querySelector("#players-per-team");
const playerListInput = document.querySelector("#player-list");
const drawButton = document.querySelector("#draw-button");
const clearButton = document.querySelector("#clear-button");
const feedback = document.querySelector("#feedback");
const results = document.querySelector("#results");

const summaryTeams = document.querySelector("#summary-teams");
const summaryPlayers = document.querySelector("#summary-players");
const summaryTotal = document.querySelector("#summary-total");

function updateSummary() {
  const teamCount = Number(teamCountSelect.value);
  const playersPerTeam = Number(playersPerTeamSelect.value);
  const minimumPlayers = teamCount * playersPerTeam;

  summaryTeams.textContent = String(teamCount);
  summaryPlayers.textContent = String(playersPerTeam);
  summaryTotal.textContent = String(minimumPlayers);
}

function getPlayerNames() {
  return playerListInput.value
    .split("\n")
    .map((name) => name.trim())
    .filter(Boolean);
}

function shuffle(array) {
  const items = [...array];

  for (let index = items.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [items[index], items[randomIndex]] = [items[randomIndex], items[index]];
  }

  return items;
}

function setFeedback(message, type = "") {
  feedback.textContent = message;
  feedback.className = "feedback";

  if (type) {
    feedback.classList.add(`is-${type}`);
  }
}

function renderEmptyState() {
  results.innerHTML = `
    <div class="empty-state">
      Os times sorteados vao aparecer aqui assim que voce preencher os nomes.
    </div>
  `;
}

function createCard(title, players, extraClass = "team-card") {
  const listItems = players
    .map((player) => `<li>${player}</li>`)
    .join("");

  return `
    <article class="${extraClass}">
      <h3>${title}</h3>
      <p class="player-count">${players.length} jogador(es)</p>
      <ul class="${extraClass === "reserve-card" ? "reserve-list" : "team-list"}">
        ${listItems}
      </ul>
    </article>
  `;
}

function drawTeams() {
  const teamCount = Number(teamCountSelect.value);
  const playersPerTeam = Number(playersPerTeamSelect.value);
  const names = getPlayerNames();
  const requiredPlayers = teamCount * playersPerTeam;

  if (names.length < requiredPlayers) {
    setFeedback(
      `Voce precisa de pelo menos ${requiredPlayers} nomes para montar ${teamCount} time(s) com ${playersPerTeam} jogador(es) cada.`,
      "error"
    );
    renderEmptyState();
    return;
  }

  const shuffledNames = shuffle(names);
  const selectedPlayers = shuffledNames.slice(0, requiredPlayers);
  const reservePlayers = shuffledNames.slice(requiredPlayers);
  const teams = Array.from({ length: teamCount }, () => []);

  selectedPlayers.forEach((player, index) => {
    teams[index % teamCount].push(player);
  });

  const cards = teams
    .map((team, index) => createCard(`Time ${index + 1}`, team))
    .join("");

  const reserveCard = reservePlayers.length
    ? createCard("Reservas", reservePlayers, "reserve-card")
    : "";

  results.innerHTML = cards + reserveCard;
  setFeedback(
    `Sorteio concluido com ${teamCount} time(s) de ${playersPerTeam} jogador(es).`,
    "success"
  );
}

function clearAll() {
  playerListInput.value = "";
  renderEmptyState();
  setFeedback("Adicione os nomes e clique em sortear.");
}

const btn = document.getElementById("theme-toggle");
const currentTheme = localStorage.getItem("theme");

// Verifica se o usuário já tinha uma preferência salva
if (currentTheme === "dark") {
  document.body.classList.add("dark-theme");
}

btn.addEventListener("click", function () {
  // Alterna a classe no body
  document.body.classList.toggle("dark-theme");
  
  // Salva a escolha no localStorage
  let theme = "light";
  if (document.body.classList.contains("dark-theme")) {
    theme = "dark";
  }
  localStorage.setItem("theme", theme);
});

teamCountSelect.addEventListener("change", updateSummary);
playersPerTeamSelect.addEventListener("change", updateSummary);
drawButton.addEventListener("click", drawTeams);
clearButton.addEventListener("click", clearAll);

updateSummary();
renderEmptyState();
