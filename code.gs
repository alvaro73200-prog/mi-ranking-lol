const API_KEY = 'RGAPI-e32b7099-7579-46b2-8620-83f43215c004'; 
const NOMBRE_HOJA = "Datos"; 

function actualizarTracker() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const hoja = ss.getSheetByName(NOMBRE_HOJA);
  const datos = hoja.getDataRange().getValues(); 

  const traduccionLineas = {
    'TOP': 'Superior', 'JUNGLE': 'Jungla', 'MIDDLE': 'Medio',
    'BOTTOM': 'Tirador', 'UTILITY': 'Soporte', 'N/A': 'N/A'
  };

  const urlChamps = "https://ddragon.leagueoflegends.com/cdn/14.10.1/data/es_ES/champion.json";
  const resChamps = JSON.parse(UrlFetchApp.fetch(urlChamps).getContentText());
  const champData = resChamps.data;
  
  let nombresChamps = {};
  for (let key in champData) {
    nombresChamps[champData[key].key] = champData[key].name;
  }

  for (let i = 1; i < datos.length; i++) {
    let nombre = datos[i][0]; 
    let tag = datos[i][1];    
    if (!nombre || !tag) continue;

    try {
      // 1. PUUID
      const urlAcc = `https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${nombre}/${tag}?api_key=${API_KEY}`;
      const resAcc = JSON.parse(UrlFetchApp.fetch(urlAcc).getContentText());
      const puuid = resAcc.puuid;

      // 2. Summoner Data
      const urlSum = `https://la1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}?api_key=${API_KEY}`;
      const resSum = JSON.parse(UrlFetchApp.fetch(urlSum).getContentText());
      Utilities.sleep(1000); 

      // 3. Liga/Rango
      const urlLeague = `https://la1.api.riotgames.com/lol/league/v4/entries/by-puuid/${puuid}?api_key=${API_KEY}`;
      const resLeague = JSON.parse(UrlFetchApp.fetch(urlLeague).getContentText());
      let rango = "Sin Rango", lp = "0 LP", wins = 0, losses = 0, winRate = "0%";
      const soloQ = resLeague.find(q => q.queueType === 'RANKED_SOLO_5x5');
      if (soloQ) {
        rango = `${soloQ.tier} ${soloQ.rank}`;
        lp = `${soloQ.leaguePoints} LP`;
        wins = soloQ.wins; 
        losses = soloQ.losses; 
        let total = wins + losses;
        winRate = total > 0 ? ((wins / total) * 100).toFixed(0) + "%" : "0%";
      }

      // 4. Maestría
      const urlMastery = `https://la1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/${puuid}/top?count=1&api_key=${API_KEY}`;
      const resMastery = JSON.parse(UrlFetchApp.fetch(urlMastery).getContentText());
      let champMaestriaNombre = resMastery.length > 0 ? (nombresChamps[resMastery[0].championId] || "N/A") : "N/A";
      let champMaestriaLvl = resMastery.length > 0 ? resMastery[0].championLevel : 0;

      // 5. Historial (Últimas 5 partidas)
      const urlMatch = `https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?queue=420&start=0&count=5&api_key=${API_KEY}`;
      const resMatchIds = JSON.parse(UrlFetchApp.fetch(urlMatch).getContentText());
      
      let kda = "0.00", racha = "0W", csMin = 0, oro10 = 0, visionScore = 0, kp = "0%", dpm = 0, ultimoChamp = "N/A", pentas = 0;
      let roles = [];

      if (resMatchIds.length > 0) {
        let esRachaVictorias = null, contadorRacha = 0;
        let tKills = 0, tDeaths = 0, tAssists = 0, tCS = 0, tTime = 0, tOro10 = 0, tVision = 0, tDPM = 0, tKP = 0;

        for (let m = 0; m < resMatchIds.length; m++) {
          const urlDetalle = `https://americas.api.riotgames.com/lol/match/v5/matches/${resMatchIds[m]}?api_key=${API_KEY}`;
          const resDetalle = JSON.parse(UrlFetchApp.fetch(urlDetalle).getContentText());
          const p = resDetalle.info.participants.find(part => part.puuid === puuid);
          
          if (m === 0) ultimoChamp = p.championName;
          
          tKills += p.kills; tDeaths += p.deaths; tAssists += p.assists;
          tCS += (p.totalMinionsKilled + p.neutralMinionsKilled);
          tTime += resDetalle.info.gameDuration;
          tVision += p.visionScore;
          tDPM += p.challenges ? (p.totalDamageDealtToChampions / (resDetalle.info.gameDuration / 60)) : 0;
          pentas += p.pentaKills;
          
          let teamKills = resDetalle.info.participants.filter(part => part.teamId === p.teamId).reduce((a, b) => a + b.kills, 0);
          tKP += teamKills > 0 ? ((p.kills + p.assists) / teamKills) : 0;
          tOro10 += p.challenges ? (p.challenges.goldPerMinute * 10) : 0; 
          roles.push(p.teamPosition);

          if (esRachaVictorias === null) { esRachaVictorias = p.win; contadorRacha = 1; }
          else if (p.win === esRachaVictorias) { contadorRacha++; }
        }
        
        kda = tDeaths === 0 ? (tKills + tAssists).toFixed(2) : ((tKills + tAssists) / tDeaths).toFixed(2);
        racha = esRachaVictorias ? `${contadorRacha}W 🔥` : `${contadorRacha}L ❄️`;
        csMin = (tCS / (tTime / 60)).toFixed(1);
        oro10 = (tOro10 / resMatchIds.length).toFixed(0);
        visionScore = (tVision / resMatchIds.length).toFixed(1);
        kp = ((tKP / resMatchIds.length) * 100).toFixed(0) + "%";
        dpm = (tDPM / resMatchIds.length).toFixed(0);
      }

      let conteoRoles = roles.reduce((acc, curr) => { acc[curr] = (acc[curr] || 0) + 1; return acc; }, {});
      let rolesOrdenados = Object.keys(conteoRoles).sort((a, b) => conteoRoles[b] - conteoRoles[a]);
      let fav = traduccionLineas[rolesOrdenados[0]] || "N/A";
      let sec = traduccionLineas[rolesOrdenados[1]] || "N/A";

      // 6. Escribir en la Hoja
      hoja.getRange(i + 1, 3).setValue(rango);
      hoja.getRange(i + 1, 4).setValue(lp);
      hoja.getRange(i + 1, 5).setValue(resSum.summonerLevel);
      hoja.getRange(i + 1, 6).setValue(resSum.profileIconId);
      hoja.getRange(i + 1, 7).setValue(kda);
      hoja.getRange(i + 1, 8).setValue(champMaestriaNombre);
      hoja.getRange(i + 1, 9).setValue(champMaestriaLvl);
      hoja.getRange(i + 1, 10).setValue(racha);

      // --- CORRECCIÓN DE FORMATO PARA VICTORIAS Y DERROTAS ---
      const celdaWins = hoja.getRange(i + 1, 11);
      const celdaLosses = hoja.getRange(i + 1, 12);
      
      celdaWins.setNumberFormat("0");   // Fuerza formato de número normal
      celdaLosses.setNumberFormat("0"); // Fuerza formato de número normal
      
      celdaWins.setValue(wins);
      celdaLosses.setValue(losses);
      // -------------------------------------------------------

      hoja.getRange(i + 1, 13).setValue(winRate);
      hoja.getRange(i + 1, 14).setValue(csMin);
      hoja.getRange(i + 1, 15).setValue(oro10);
      hoja.getRange(i + 1, 16).setValue(fav);
      hoja.getRange(i + 1, 17).setValue(visionScore);
      hoja.getRange(i + 1, 18).setValue(kp);
      hoja.getRange(i + 1, 19).setValue(dpm);
      hoja.getRange(i + 1, 20).setValue(ultimoChamp);
      hoja.getRange(i + 1, 21).setValue(pentas > 0 ? `¡${pentas} PENTA! 🏆` : "0");

      console.log(`Actualizado: ${nombre}`);
      Utilities.sleep(1000); 

    } catch (e) {
      console.log(`Error con ${nombre}: ` + e);
    }
  }
}
