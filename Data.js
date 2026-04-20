// data.js - Tu LOL Tracker CSV auto
const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTYf88BuB-N4ZWgeQ_PQ4Nrk7onK2YRq5dsnwbxIlyYOpCL4GXjO4gnCSKahnqOEpRN269Rug_bWiJG/pub?output=csv';

async function fetchData() {
  try {
    const url = `${CSV_URL}?t=${Date.now()}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Error ${response.status}`);
    const csvText = await response.text();
    return parseCSV(csvText);
  } catch (error) {
    console.error('Error CSV:', error);
    return [];
  }
}

function parseCSV(text) {
  const lines = text.trim().split('\n');
  const headersRaw = lines[0].split(',').map(h => h.trim().toLowerCase());
  const headerMap = {
    'nombre': 'jugador', 'tag': 'tagline', 'rango': 'rango', 'lp': 'lp',
    'winrate': 'wr%', 'wins': 'v', 'losses': 'd'
  };
  const data = [];
  lines.slice(1).forEach(line => {
    const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
    if (!values[0]) return;
    const row = { jugador: values[0], tagline: '', rango: '', lp: '', wr: '', vd: '' };
    headersRaw.forEach((header, i) => {
      const target = headerMap[header] || header;
      if (target in row) row[target] = values[i] || '';
    });
    const wins = parseInt(row.v) || 0;
    const losses = parseInt(row.d) || 0;
    row.vd = `${wins}W / ${losses}L`;
    row.wr = row.wr || `${Math.round((wins / (wins + losses)) * 100) || 0}%`;
    data.push(row);
  });
  return data;
}

window.fetchData = fetchData;