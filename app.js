let swiperInstance = null;
let expandedCard = null;
let clickHandlerBound = false;

function normalizeText(value) {
    return String(value ?? '').trim().toLowerCase();
}

function findPlayerByTarget(targetName) {
    const target = normalizeText(targetName);
    return playersList.find(p => normalizeText(p.Nombre) === target);
}

function renderDashboard(playerFound, targetName) {
  const dashboard = document.getElementById('dashboard-content');
  if (!dashboard) return;

  if (playerFound) {
    const color = playerFound.Color_Hex || '#c8aa6e';
    const wr = parseInt(playerFound.PorcentajeVictorias) || 0;

    dashboard.innerHTML = `
      <div style="background: linear-gradient(180deg, #05070a 0%, #0b0f14 100%); border: 1px solid ${color}; border-left: 5px solid ${color}; border-radius: 18px; padding: 20px; color: #e8e8e8; box-shadow: 0 0 24px rgba(0,0,0,0.35);">
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:16px;">
          <div>
            <h2 style="margin:0; font-size:22px; color:${color};">${playerFound.Nombre}#${playerFound.Tag}</h2>
            <p style="margin:6px 0 0; color:#a7b0bc; font-size:13px;">Campeón Favorito: ${playerFound.CampeonFavorito || 'Buscando...'}</p>
          </div>
          <div style="padding:8px 12px; border-radius:999px; background: rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08);">
            ${playerFound.Rango} (${playerFound.LP} LP)
          </div>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:16px;">
          <div style="background:#0d1218; border-radius:14px; padding:14px;">
            <div style="color:#9ca3af; font-size:12px;">Victorias</div>
            <div style="font-size:20px; font-weight:700; color:#28a745;">${playerFound.Victorias}</div>
          </div>
          <div style="background:#0d1218; border-radius:14px; padding:14px;">
            <div style="color:#9ca3af; font-size:12px;">Derrotas</div>
            <div style="font-size:20px; font-weight:700; color:#dc3545;">${playerFound.Derrotas}</div>
          </div>
        </div>

        ${createProgressRow('Porcentaje de Victorias', wr, color)}
      </div>
    `;
  } else {
    dashboard.innerHTML = `<div style="padding:24px; color:#c8aa6e;"><h2>${targetName}</h2><p>Sin datos en el Excel.</p></div>`;
  }
}

  function createProgressRow(label, value, color) {
    const num = Number(value) || 0;
    const maxValue = 1000;
    const pct = Math.min((num / maxValue) * 100, 100);

    return `
      <div>
        <div style="display:flex; justify-content:space-between; margin-bottom:6px; font-size:13px; color:#d6d6d6;">
          <span>${label}</span>
          <span>${num}</span>
        </div>
        <div style="width:100%; height:12px; background:#1a1f27; border-radius:999px; overflow:hidden; border:1px solid rgba(255,255,255,0.06);">
          <div style="width:${pct}%; height:100%; background:${color}; box-shadow: 0 0 12px ${color}55;"></div>
        </div>
      </div>
    `;
  }

  function handleDocumentClick(e) {
    const clickedCard = e.target.closest('.player-card, .player-row');

    if (!clickedCard) {
      closeExpandedCard();
      return;
    }

    const targetName = clickedCard.dataset.player || '';
    const playerFound = findPlayerByTarget(targetName);

    if (expandedCard && expandedCard !== clickedCard) {
      closeExpandedCard();
    }

    if (expandedCard === clickedCard) {
      closeExpandedCard();
    } else {
      expandCard(clickedCard);
    }

    if (swiperInstance && swiperInstance.autoplay) {
      swiperInstance.autoplay.stop();
    }

    renderDashboard(playerFound, targetName);
  }

  function bindClickListenerOnce() {
    if (clickHandlerBound) return;
    document.addEventListener('click', handleDocumentClick);
    clickHandlerBound = true;
  }

  function expandCard(card) {
    closeExpandedCard(false);
    card.classList.add('is-expanded');
    expandedCard = card;
    setTimeout(() => {
      if (swiperInstance && typeof swiperInstance.update === 'function') swiperInstance.update();
    }, 50);
  }

  function closeExpandedCard(restartAutoplay = true) {
    if (expandedCard) {
      expandedCard.classList.remove('is-expanded');
      expandedCard = null;
    }

    setTimeout(() => {
      if (swiperInstance && typeof swiperInstance.update === 'function') swiperInstance.update();
    }, 50);

    if (restartAutoplay && swiperInstance && swiperInstance.autoplay) {
      swiperInstance.autoplay.start();
    }
  }

  function renderPlayersList() {
    const container = document.getElementById('players-list');
    if (!container) return;

    container.innerHTML = '';

    playersList.forEach(player => {
      const row = document.createElement('div');
      row.className = 'player-row';
      row.dataset.player = player.Nombre;

      row.innerHTML = `
        <div class="player-row-name">${player.Nombre || '-'}</div>
        <div class="player-row-rank">${player.Rango || '-'}</div>
      `;

      container.appendChild(row);
    });
  }

  // Variable global para almacenar los datos
window.playersList = [];

function iniciarTodo() {
    // 1. Pedimos los datos al servidor primero
    google.script.run
      .withSuccessHandler(function(datosRecibidos) {
        // 2. Guardamos los datos en la variable global
        window.playersList = datosRecibidos;

        // 3. Ahora que ya tenemos los datos, dibujamos todo
        renderPlayerCards();
        renderPlayersList();
        bindClickListenerOnce();

        // 4. Inicializamos el Swiper (el carrusel)
        if (typeof Swiper !== 'undefined') {
          if (swiperInstance && typeof swiperInstance.destroy === 'function') {
            swiperInstance.destroy(true, true);
          }

          swiperInstance = new Swiper('.mySwiper', {
            slidesPerView: 'auto',
            spaceBetween: 20,
            centeredSlides: true,
            watchSlidesProgress: true,
            autoplay: {
              delay: 2500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true
            },
            speed: 600,
            loop: false,
            rewind: true,
            pagination: { el: '.swiper-pagination', clickable: true },
            breakpoints: {
              768: { spaceBetween: 25 },
              1024: { spaceBetween: 30 }
            }
          });
        }
      })
      .obtenerDatosJugadores(); // <--- Esta es la llamada clave al Code.gs
  }

// 5. OBLIGATORIO: Llamamos a la función al cargar la página
window.onload = iniciarTodo;
