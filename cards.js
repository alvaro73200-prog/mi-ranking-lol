function createPlayerCard(player) {
  const slide = document.createElement("div");
  slide.className = "swiper-slide";

  const card = document.createElement("div");
  card.className = "player-card";
  card.dataset.player = player.Nombre || "Desconocido";

  const rawChamp = player.CampeonFavorito || "";
  const champName = rawChamp.replace(/\s+/g, '');
  
  if (champName) {
    const champImg = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champName}_0.jpg`;
    card.style.backgroundImage = `url('${champImg}')`;
  }

  card.innerHTML = `
    <div class="card-main">
      <div class="player-name">${player.Nombre || "Jugador"} <small style="color:#888">#${player.Tag || ""}</small></div>
      <div class="player-rank" style="color: var(--hextech-gold)">${player.Rango || "Unranked"}</div>
    </div>
    <div class="card-details">
      <h4 style="margin:0 0 10px 0; font-size:12px; color:var(--hextech-gold)">RANKED STATS</h4>
      <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
        <span>LP</span><strong>${player.LP || 0}</strong>
      </div>
      <div style="display:flex; justify-content:space-between;">
        <span>Winrate</span><strong style="color: var(--neon-blue)">${player.PorcentajeVictorias || "0%"}</strong>
      </div>
    </div>
  `;

  slide.appendChild(card);
  return slide;
}

function renderPlayerCards() {
  const container = document.getElementById("player-cards-container");
  if (!container) return;
  container.innerHTML = "";
  window.playersList.forEach(player => {
    container.appendChild(createPlayerCard(player));
  });
}
