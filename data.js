window.fetchData = async function() {
  const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTYf88BuB-N4ZWgeQ_PQ4Nrk7onK2YRq5dsnwbxIlyYOpCL4GXjO4gnCSKahnqOEpRN269Rug_bWiJG/pub?output=csv';

  const response = await fetch(`${SHEET_CSV_URL}&_=${Date.now()}`, {
    cache: 'no-store'
  });

  if (!response.ok) {
    throw new Error(`Error al cargar el CSV: ${response.status}`);
  }

  const csv = await response.text();

  const rows = csv
    .trim()
    .split(/\r?\n/)
    .map(row => row.split(',').map(cell => cell.trim().replace(/^"|"$/g, '')));

  return rows.slice(1).map(row => {
    if (row.length < 5) return null;

    return {
      jugador: row[0] || '',
      tag: row[1] || '',
      rango: row[2] || '',
      lp: row[3] || '',
      nivel: row[4] || '',
      kda: row[6] || '',
      winRate: row[11] || '',
      vision: row[16] || '',
      kp: row[17] || '',
      dpm: row[18] || '',
      ultimoCampeon: row[19] || '',
      pentas: row[20] || '',
      champMaestriaNombre: row[7] || ''
    };
  }).filter(Boolean);
};
