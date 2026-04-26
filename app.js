// app.js completo corregido
let swiperInstance = null;
let expandedCard = null;
window.playersList = [];

// PEGA AQUÍ LA URL QUE COPIASTE DE GOOGLE
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycby7TMlBSwO9COYXSTSMs-IL4x2MKnCopZmhYreb3o6RGD5r3FBWb7DP-PXWqXKAy2a-/exec";

async function cargarDatosDesdeGoogle() {
  try {
    const response = await fetch(SCRIPT_URL);
    const datos = await response.json();
    return datos;
  } catch (error) {
    console.error("Error cargando datos:", error);
    return [];
  }
}

async function iniciarTodo() {
  console.log("Conectando con Google Sheets...");
  
  // 1. Cargamos los datos reales
  window.playersList = await cargarDatosDesdeGoogle();

  if (window.playersList.length === 0) {
    document.getElementById('dashboard-content').innerHTML = "<h2>Error al cargar datos</h2>";
    return;
  }

  // 2. Renderizamos la interfaz
  renderPlayerCards();
  renderPlayersList();

  // 3. Inicializamos Swiper
  if (typeof Swiper !== 'undefined') {
    if (swiperInstance) swiperInstance.destroy(true, true);
    
    swiperInstance = new Swiper('.mySwiper', {
      slidesPerView: 'auto',
      spaceBetween: 20,
      centeredSlides: true,
      pagination: { el: '.swiper-pagination', clickable: true },
      observer: true,
      observeParents: true
    });
  }

  document.addEventListener('click', handleDocumentClick);
}

// Auxiliares (Asegúrate de que estén en tu archivo)
function normalizeText(value) { return String(value ?? '').trim().toLowerCase(); }

function findPlayerByTarget(targetName) {
  const target = normalizeText(targetName);
  return window.playersList.find(p => normalizeText(p.Nombre) === target);
}

function handleDocumentClick(e) {
  const clickedCard = e.target.closest('.player-card, .player-row');
  if (!clickedCard) return;

  const targetName = clickedCard.dataset.player || '';
  const playerFound = findPlayerByTarget(targetName);
  
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
    row.dataset.player = player.Nombre;
    row.innerHTML = `<strong>${player.Nombre}</strong> - ${player.Rango}`;
    container.appendChild(row);
  });
}

function renderDashboard(playerFound, targetName) {
  const dashboard = document.getElementById('dashboard-content');
  if (!dashboard || !playerFound) return;

  const color = playerFound.Color_Hex || '#c8aa6e';
  dashboard.innerHTML = `
    <div style="background:#0b0f14; border:1px solid ${color}; border-left: 5px solid ${color}; border-radius:18px; padding:20px; box-shadow: 0 0 20px rgba(0,0,0,0.5);">
      <h2 style="color:${color}; margin:0;">${playerFound.Nombre}#${playerFound.Tag}</h2>
      <p style="color:#888;">Campeón Favorito: ${playerFound.CampeonFavorito}</p>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-top:15px;">
        <div style="background:#1a1f27; padding:12px; border-radius:10px;">
          <div style="font-size:11px; color:#aaa;">Winrate</div>
          <div style="font-size:18px; font-weight:bold; color:${color}">${playerFound.PorcentajeVictorias}</div>
        </div>
        <div style="background:#1a1f27; padding:12px; border-radius:10px;">
          <div style="font-size:11px; color:#aaa;">Rango</div>
          <div style="font-size:18px; font-weight:bold;">${playerFound.Rango}</div>
        </div>
      </div>
    </div>
  `;
}

window.onload = iniciarTodo;
