function createPlayerCard(player) {
  const slide = document.createElement("div");
  slide.className = "swiper-slide";

  const card = document.createElement("div");
  card.className = "player-card";
  card.dataset.player = player.Nombre || "Desconocido";

  // Protección: convertir a string y limpiar solo si existe el dato
  const rawChamp = player.CampeonFavorito || player["CampeónFavorito"] || "";
  const champName = rawChamp.replace(/\s+/g, '');
  
  // Solo aplicar fondo si tenemos un nombre válido
  if (champName) {
    const champImg = "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/" + champName + "_0.jpg";
    card.style.backgroundImage = "url('" + champImg + "')";
  }

  // Calculamos el winrate con seguridad
  const winrate = player.PorcentajeVictorias || "0%";

  card.innerHTML = `
    <div class="card-main">
      <div class="player-name">${player.Nombre || "Jugador"} <small style="color:#888">#${player.Tag || ""}</small></div>
      <div class="player-rank" style="color: var(--hextech-gold)">${player.Rango || "Unranked"}</div>
    </div>
    
    <div class="card-details">
      <h4>RANKED STATS</h4>
      <div class="detail-row">
        <span>LP (Puntos)</span>
        <strong>${player.LP || 0}</strong>
      </div>
      <div class="detail-row">
        <span>Winrate</span>
        <strong style="color: var(--neon-blue)">${winrate}</strong>
      </div>
      <h4>PARTIDAS</h4>
      <div class="detail-row">
        <span>Victorias</span>
        <strong style="color: #28a745">${player.Victorias || 0}</strong>
      </div>
      <div class="detail-row">
        <span>Derrotas</span>
        <strong style="color: #dc3545">${player.Derrotas || 0}</strong>
      </div>
    </div>
  `;

  slide.appendChild(card);
  return slide;
}
function renderPlayerCards() {
  const container = document.getElementById("player-cards-container");
  container.innerHTML = "";
  playersList.forEach(player => {
    container.appendChild(createPlayerCard(player));
  });
}
