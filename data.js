const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTYf88BuB-N4ZWgeQ_PQ4Nrk7onK2YRq5dsnwbxIlyYOpCL4GXjO4gnCSKahnqOEpRN269Rug_bWiJG/pub?output=csv';

function parseCSV(text) {
  return text
    .trim()
    .split(/\r?\n/)
    .map(row => row.split(','));
}

async function fetchData() {
  const url = `${CSV_URL}?_=${Date.now()}`;
  const response = await fetch(url, { cache: 'no-store' });

  if (!response.ok) {
    throw new Error(`Error al cargar CSV: ${response.status}`);
  }

  const csvText = await response.text();
  const rows = parseCSV(csvText);

  if (!rows.length) return [];

  const data = rows.slice(1).map(row => ({
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
    pentas: row[20] || ''
  }));

  return data;
}

window.fetchData = fetchData;
