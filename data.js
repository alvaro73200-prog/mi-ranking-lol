const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTYf88BuB-N4ZWgeQ_PQ4Nrk7onK2YRq5dsnwbxIlyYOpCL4GXjO4gnCSKahnqOEpRN269Rug_bWiJG/pub?output=csv';

window.fetchData = async function () {
  const url = CSV_URL + '&t=' + Date.now();
  const res = await fetch(url);
  if (!res.ok) throw new Error('No se pudo cargar el CSV');
  const text = await res.text();
  return parseCSV(text);
};

function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return [];

  const headers = splitCSVLine(lines[0]).map(h => h.trim());
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const values = splitCSVLine(lines[i]);
    if (!values.length || values.every(v => !v.trim())) continue;

    const obj = {};
    headers.forEach((h, idx) => obj[h] = (values[idx] || '').trim());

    const jugador = obj['Nombre'] || obj['Jugador'] || '';
    const tag = obj['Tag'] || '';
    const rango = obj['Rango'] || '';
    const lp = obj['LP'] || '';
    const wins = parseInt(obj['Wins'] || '0', 10) || 0;
    const losses = parseInt(obj['Losses'] || '0', 10) || 0;
    const winRate = obj['WinRate'] || '';
    const wr = winRate || (wins + losses > 0 ? Math.round((wins / (wins + losses)) * 100) + '%' : '0%');
    const vd = `${wins}W / ${losses}L`;

    rows.push({ jugador, tag, rango, lp, wr, vd });
  }

  return rows;
}

function splitCSVLine(line) {
  const result = [];
  let current = '';
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      insideQuotes = !insideQuotes;
    } else if (char === ',' && !insideQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}
