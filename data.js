// data.js
window.fetchData = async function() {
  // URL de tu Google Sheets (mantengo la misma que pasaste)
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
      jugador: row[0],         // Columna A: Nombre
      tag: row[1],             // Columna B: Tag
      rango: row[2],           // Columna C: Rango
      lp: row[3],              // Columna D: LP
      nivel: row[4],           // Columna E: Nivel
      kda: row[6],             // Columna G: KDA
      winRate: row[12],        // Columna M (Índice 12): WinRate real (52%, etc.) [Arreglado]
      vision: row[16],         // Columna Q (Índice 16): Visión
      kp: row[17],             // Columna R (Índice 17): % Part. Asesinatos
      dpm: row[18],            // Columna S (Índice 18): DPM
      ultimoCampeon: row[19],  // Columna T (Índice 19): Último Campeón
      pentas: row[20]          // Columna U (Índice 20): Pentas
    };
  }).filter(item => item !== null);
};
