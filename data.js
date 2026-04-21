// data.js
window.fetchData = async function() {
  // Reemplaza esto con tu URL de Google Sheets (la que termina en /pub?output=csv)
  const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTYf88BuB-N4ZWgeQ_PQ4Nrk7onK2YRq5dsnwbxIlyYOpCL4GXjO4gnCSKahnqOEpRN269Rug_bWiJG/pub?output=csv'; 

  const response = await fetch(SHEET_CSV_URL);
  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8');
  const result = await reader.read();
  const csv = decoder.decode(result.value);

  // Dividir por filas y limpiar espacios
  const rows = csv.split('\n').map(row => row.split(','));
  
  // Quitamos la primera fila (encabezados) y mapeamos el resto
  return rows.slice(1).map(row => {
    if (row.length < 5) return null; // Saltar filas vacías

    return {
      jugador: row[0],         // Columna A
      tag: row[1],             // Columna B
      rango: row[2],           // Columna C
      lp: row[3],              // Columna D
      nivel: row[4],           // Columna E
      kda: row[6],             // Columna G
      winRate: row[11],        // Columna L (WinRate %)
      vision: row[16],         // Columna Q (Visión)
      kp: row[17],             // Columna R (KP%)
      dpm: row[18],            // Columna S (DPM)
      ultimoCampeon: row[19],  // Columna T (Último Campeón)
      pentas: row[20]          // Columna U (Pentas)
    };
  }).filter(item => item !== null);
};
