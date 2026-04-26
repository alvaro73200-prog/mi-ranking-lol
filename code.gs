// Code.gs
function doGet(e) {
  const datos = obtenerDatosJugadores();
  
  // Esto permite que GitHub Pages pueda leer los datos (evita error de CORS)
  return ContentService.createTextOutput(JSON.stringify(datos))
    .setMimeType(ContentService.MimeType.JSON);
}

function obtenerDatosJugadores() {
  const spreadsheetId = '1E3wstrDb5__RYcoN4-BEMg0u7GvOICgyUsfiCo8-wKo';
  const nombreHoja = 'Hoja 1';
  const ss = SpreadsheetApp.openById(spreadsheetId);
  const hoja = ss.getSheetByName(nombreHoja);

  const data = hoja.getDataRange().getDisplayValues();
  if (data.length < 2) return [];

  const encabezados = data[0].map(h => h.trim());
  const filas = data.slice(1);

  return filas.map(fila => {
    const obj = {};
    encabezados.forEach((encabezado, i) => {
      const key = encabezado.replace('%', 'Porcentaje').replace(' ', ''); 
      obj[key] = fila[i];
    });
    return obj;
  });
}

// Mantén tu función de actualizarDatosDesdeRiot aquí abajo si la usas


  return jugadores;
}
function actualizarDatosDesdeRiot() {
  const spreadsheetId = '1E3wstrDb5__RYcoN4-BEMg0u7GvOICgyUsfiCo8-wKo';
  const hoja = SpreadsheetApp.openById(spreadsheetId).getSheetByName('Hoja 1');
  // Nota: Asegúrate de que esta clave sea válida.
  const apiKey = 'RGAPI-64e05d3a-fba9-40dc-9750-f1d8a9ff5cea'; 

  const datos = hoja.getDataRange().getValues();
  const filas = datos.slice(1);
  // Obtener el mapa de campeones de Data Dragon
  const ddragonUrl = 'https://ddragon.leagueoflegends.com/cdn/14.8.1/data/es_ES/champion.json';
  const response = UrlFetchApp.fetch(ddragonUrl);
  const champData = JSON.parse(response.getContentText()).data;
  const champMap = {};
  for (let key in champData) {
  champMap[champData[key].key] = champData[key].id; // Mapea ID a nombre técnico (ej: "Ahri")
}

  filas.forEach((fila, index) => {
    const nombre = fila[0];
    const tag = fila[1];

    if (!nombre || !tag) return;

    try {
      // Paso 1: Obtener PUUID
      const accountUrl = `https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(nombre)}/${encodeURIComponent(tag)}?api_key=${apiKey}`;
      const accountResponse = UrlFetchApp.fetch(accountUrl);
      const accountData = JSON.parse(accountResponse.getContentText());
      const puuid = accountData.puuid;

      // Paso 2: Obtener datos de Liga
      const leagueUrl = `https://la1.api.riotgames.com/lol/league/v4/entries/by-puuid/${puuid}?api_key=${apiKey}`;
      const leagueResponse = UrlFetchApp.fetch(leagueUrl);
      const leagueData = JSON.parse(leagueResponse.getContentText());
      
      const soloEntry = leagueData.find(e => e.queueType === 'RANKED_SOLO_5x5');
      
      if (soloEntry) {
        const victorias = soloEntry.wins;
        const derrotas = soloEntry.losses;
        const total = victorias + derrotas;
        const winrate = total > 0 ? ((victorias / total) * 100).toFixed(1) : 0;

        // Escritura en Excel (Columnas C a G)
        hoja.getRange(index + 2, 3).setValue(soloEntry.tier + ' ' + soloEntry.rank);
        hoja.getRange(index + 2, 4).setValue(soloEntry.leaguePoints);
        hoja.getRange(index + 2, 5).setValue(victorias);
        hoja.getRange(index + 2, 6).setValue(derrotas);
        hoja.getRange(index + 2, 7).setValue(winrate + '%');
      }

      // Paso 3: Maestría (Campeón más jugado)
      const masteriesUrl = `https://la1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/${puuid}/top?count=1&api_key=${apiKey}`;
      const masteriesResponse = UrlFetchApp.fetch(masteriesUrl);
      const masteriesData = JSON.parse(masteriesResponse.getContentText());
      if (masteriesData && masteriesData.length > 0) {
        const championId = String(masteriesData[0].championId);
        const championName = champMap[String(masteriesData[0].championId)] || "Desconocido";
        hoja.getRange(index + 2, 8).setValue(championName);
      }
      // REEMPLAZA tu línea de guardado anterior por esta:
      const championName = champMap[String(masteriesData[0].championId)] || "Desconocido";
      hoja.getRange(index + 2, 8).setValue(championName);

    } catch (e) {
      Logger.log('Error procesando a ' + nombre + ': ' + e.message);
    }
  });
}
