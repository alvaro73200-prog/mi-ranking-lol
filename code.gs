/**
 * Oracle Lens — Backend (Google Apps Script)
 *
 * Sirve la aplicación web y conecta con la hoja de cálculo
 * que almacena los datos de los jugadores.
 */

/* ─── Configuración ─── */
const SPREADSHEET_ID = '1E3wstrDb5__RYcoN4-BEMg0u7GvOICgyUsfiCo8-wKo';
const SHEET_NAME     = 'Hoja 1';

/* ─── Punto de entrada web ─── */
function doGet() {
  return HtmlService.createTemplateFromFile('index')
    .evaluate()
    .setTitle('Oracle Lens — LOL Tracker')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/* ─── Incluir archivos HTML parciales ─── */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/* ─── Obtener datos de jugadores desde la hoja de cálculo ─── */
function obtenerDatosJugadores() {
  try {
    const ss   = SpreadsheetApp.openById(SPREADSHEET_ID);
    const hoja = ss.getSheetByName(SHEET_NAME);
    const data = hoja.getDataRange().getDisplayValues();

    if (data.length < 2) return [];

    const encabezados = data[0].map(h => h.trim());
    const filas       = data.slice(1);

    return filas.map(fila => {
      const obj = {};
      encabezados.forEach((encabezado, i) => {
        // Normalizar encabezados para uso en JavaScript:
        //   "%Victorias"       → "PorcentajeVictorias"
        //   "Campeon Favorito" → "CampeonFavorito"
        const key = encabezado
          .replace(/%/g, 'Porcentaje')
          .replace(/\s+/g, '');
        obj[key] = fila[i];
      });
      return obj;
    });
  } catch (error) {
    console.error('Error al obtener datos de jugadores:', error);
    return [];
  }
}
