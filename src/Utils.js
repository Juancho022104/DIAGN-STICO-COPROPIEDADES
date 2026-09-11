/**
 * Utils.js
 * Helpers compartidos para leer/escribir la hoja de cálculo.
 */

function getSs_() {
  return SpreadsheetApp.getActiveSpreadsheet();
}

function getOrCreateSheet_(nombre) {
  var ss = getSs_();
  var sheet = ss.getSheetByName(nombre);
  if (!sheet) sheet = ss.insertSheet(nombre);
  return sheet;
}

/**
 * Lee los datos generales de cabecera (los únicos campos que cambian entre copropiedades).
 */
function getDatosCabecera_() {
  var sheet = getSs_().getSheetByName(RAVELL_CONFIG.SHEETS.CABECERA);
  if (!sheet) throw new Error('No existe la hoja "Cabecera". Ejecuta primero "Inicializar plantilla".');
  var c = RAVELL_CONFIG.CABECERA_CELDAS;
  return {
    nombreCopropiedad: sheet.getRange(c.NOMBRE_COPROPIEDAD).getValue(),
    nit: sheet.getRange(c.NIT).getValue(),
    administradorSaliente: sheet.getRange(c.ADMINISTRADOR_SALIENTE).getValue(),
    administradorEntrante: sheet.getRange(c.ADMINISTRADOR_ENTRANTE).getValue(),
    fechaDiagnostico: sheet.getRange(c.FECHA_DIAGNOSTICO).getValue(),
    consultorResponsable: sheet.getRange(c.CONSULTOR_RESPONSABLE).getValue(),
    logoDriveFileId: sheet.getRange(c.LOGO_DRIVE_FILE_ID).getValue()
  };
}

/**
 * Lee todas las filas del checklist con sus columnas nombradas.
 */
function getFilasChecklist_() {
  var sheet = getOrCreateSheet_(RAVELL_CONFIG.SHEETS.CHECKLIST);
  var lastRow = sheet.getLastRow();
  var inicio = RAVELL_CONFIG.CHECKLIST_FILA_INICIO;
  if (lastRow < inicio) return [];

  var numFilas = lastRow - inicio + 1;
  var values = sheet.getRange(inicio, 1, numFilas, 7).getValues();
  var col = RAVELL_CONFIG.CHECKLIST_COLUMNAS;

  return values
    .map(function (fila, idx) {
      return {
        filaSheet: inicio + idx,
        modulo: fila[col.MODULO - 1],
        item: fila[col.ITEM - 1],
        descripcion: fila[col.DESCRIPCION - 1],
        estado: fila[col.ESTADO - 1],
        observaciones: fila[col.OBSERVACIONES - 1],
        responsable: fila[col.RESPONSABLE - 1],
        fechaRevision: fila[col.FECHA_REVISION - 1]
      };
    })
    .filter(function (fila) { return fila.item; });
}

function formatearFecha_(fecha) {
  if (!fecha) return 'N/A';
  if (Object.prototype.toString.call(fecha) === '[object Date]') {
    return Utilities.formatDate(fecha, RAVELL_CONFIG.CABECERA_CELDAS.TIMEZONE || 'America/Bogota', 'dd/MM/yyyy');
  }
  return String(fecha);
}
