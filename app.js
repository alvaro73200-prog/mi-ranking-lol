let swiperInstance = null;
let expandedCard = null;
window.playersList = [];

// DATOS DE PRUEBA (Esto reemplaza temporalmente a Google Sheets)
const MOCK_DATA = [
  { Nombre: "Faker", Tag: "T1", Rango: "CHALLENGER", LP: 1200, Victorias: 150, Derrotas: 100, PorcentajeVictorias: "60%", CampeonFavorito: "Azir", Color_Hex: "#c8aa6e" },
  { Nombre: "Caps", Tag: "G2", Rango: "GRANDMASTER", LP: 800, Victorias: 130, Derrotas: 110, PorcentajeVictorias: "54%", CampeonFavorito: "Sylas", Color_Hex: "#00f2ff" },
  { Nombre: "Jojopyun", Tag: "FLY", Rango: "MASTER", LP: 200, Victorias: 90, Derrotas: 85, PorcentajeVictorias: "51%", CampeonFavorito: "Corki", Color_Hex: "#28a745" }
];

function normalizeText(value) { return String(value ?? '').trim().toLowerCase(); }

function findPlayerByTarget(targetName) {
  const target = normalizeText(targetName);
  return window.playersList.find(p => normalizeText(p.Nombre) === target);
}

function renderDashboard(playerFound, targetName) {
  const dashboard = document.getElementById('dashboard-content');
  if (!dashboard) return;

  if (playerFound) {
    const color = playerFound.Color_Hex || '#c8aa6e';
    dashboard.innerHTML = `
      <div style="background:#0b0f14; border:1px solid ${color}; border-radius:18px; padding:20px; box-shadow: 0 0 20px rgba(0,0,0,0.5);">
        <h2 style="color:${color}; margin-top:0;">${playerFound.Nombre}#${playerFound.Tag}</h2>
        <p>Campeón: ${playerFound.CampeonFavorito}</p>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
          <div style="background:#1a1f27; padding:10px; border-radius:10px;">Winrate: ${playerFound.PorcentajeVictorias}</div>
          <div style="background:#1a1f27; padding:10px; border-radius:10px;">Rango: ${playerFound.Rango}</div>
        </div>
      </div>
    `;
  }
}

function handleDocumentClick(e) {
  const clickedCard = e.target.closest('.player-card, .player-row');
  if (!clickedCard) return;

  const targetName = clickedCard.dataset.player || '';
  const playerFound = findPlayerByTarget(targetName);
  
  // Lógica de expansión
  if (expandedCard) expandedCard.classList.remove('is-expanded');
  clickedCard.classList.add('is-expanded');
  expandedCard = clickedCard;

  renderDashboard(playerFound, targetName);
}

function renderPlayersList() {
  const container = document.getElementById('players-list');
  if (!container) return;
  container.innerHTML = '';
  window.playersList.forEach(player => {
    const row = document.createElement('div');
    row.className = 'player-row';
    row.style = "padding:10px; border-bottom:1px solid #222; cursor:pointer;";
    row.dataset.player = player.Nombre;
    row.innerHTML = `<strong>${player.Nombre}</strong> - ${player.Rango}`;
    container.appendChild(row);
  });
}

function iniciarTodo() {
  console.log("Iniciando App en GitHub...");
  window.playersList = MOCK_DATA; // Aquí cargarás los datos reales luego

  renderPlayerCards();
  renderPlayersList();

  if (typeof Swiper !== 'undefined') {
    swiperInstance = new Swiper('.mySwiper', {
      slidesPerView: 'auto',
      spaceBetween: 20,
      centeredSlides: true,
      pagination: { el: '.swiper-pagination', clickable: true }
    });
  }

  document.addEventListener('click', handleDocumentClick);
}

window.onload = iniciarTodo;
