let swiperInstance = null;
let expandedCard = null;
window.playersList = [];

// IMPORTANTE: Pon tu URL aquí. Debe terminar en /exec
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxLNXXW8kKB6bOPUzPhAZLkLeOahghfAO_29N2xaUgoifB36VJpsJMVFSgWE9NB7Plm/exec";

async function cargarDatosDesdeGoogle() {
  try {
    // Usamos 'no-cache' para que siempre traiga los datos frescos del Excel
    const response = await fetch(SCRIPT_URL, { method: 'GET', cache: 'no-cache' });
    if (!response.ok) throw new Error("Error en la respuesta de red");
    const datos = await response.json();
    return datos;
  } catch (error) {
    console.error("Fallo total en la carga:", error);
    return [];
  }
}

async function iniciarTodo() {
  const dashboard = document.getElementById('dashboard-content');
  dashboard.innerHTML = '<div class="loading">Cargando datos del Nexo...</div>';
  
  window.playersList = await cargarDatosDesdeGoogle();

  if (window.playersList.length === 0) {
    dashboard.innerHTML = '<h2 style="color:red;">Error al cargar datos</h2><p>Revisa la consola (F12) y la configuración de acceso en Google.</p>';
    return;
  }

  renderPlayerCards();
  renderPlayersList();

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
  dashboard.innerHTML = '<h2>Selecciona un jugador</h2><p>Haz clic para ver estadísticas</p>';
}

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

  renderDashboard(playerFound);
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

function renderDashboard(playerFound) {
  const dashboard = document.getElementById('dashboard-content');
  if (!dashboard || !playerFound) return;

  const color = playerFound.Color_Hex || '#c8aa6e';
  dashboard.innerHTML = `
    <div style="background:#0b0f14; border:1px solid ${color}; border-left: 5px solid ${color}; border-radius:18px; padding:20px; box-shadow: 0 0 20px rgba(0,0,0,0.5); color: white;">
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
