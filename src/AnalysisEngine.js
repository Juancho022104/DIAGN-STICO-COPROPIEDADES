/**
 * AnalysisEngine.js
 * Calcula el porcentaje de cumplimiento global y por módulo, y extrae los hallazgos críticos.
 */

/**
 * Ejecuta el cálculo y escribe el resultado en la hoja "Resumen".
 * Devuelve el objeto de análisis para ser reutilizado por el generador de informes.
 */
function calcularCumplimiento() {
  var analisis = construirAnalisis_();
  escribirResumen_(analisis);
  SpreadsheetApp.getUi().alert(
    'Cumplimiento global: ' + analisis.porcentajeGlobal + '%\n' +
    'Hallazgos críticos (No Cumple): ' + analisis.hallazgosCriticos.length
  );
  return analisis;
}

/**
 * Construye la estructura de análisis a partir del checklist actual, sin escribir en la hoja.
 */
function construirAnalisis_() {
  var filas = getFilasChecklist_();
  var porModulo = {};

  filas.forEach(function (fila) {
    if (!porModulo[fila.modulo]) {
      porModulo[fila.modulo] = { modulo: fila.modulo, cumple: 0, noCumple: 0, noAplica: 0, pendiente: 0, total: 0 };
    }
    var m = porModulo[fila.modulo];
    m.total++;
    if (fila.estado === 'Cumple') m.cumple++;
    else if (fila.estado === 'No Cumple') m.noCumple++;
    else if (fila.estado === 'No Aplica') m.noAplica++;
    else m.pendiente++;
  });

  var modulos = RAVELL_CONFIG.MODULOS.map(function (m) { return m.nombre; })
    .filter(function (nombre) { return porModulo[nombre]; })
    .map(function (nombre) {
      var m = porModulo[nombre];
      var base = m.cumple + m.noCumple; // No Aplica y Pendiente no cuentan en el % de cumplimiento efectivo
      m.porcentaje = base > 0 ? Math.round((m.cumple / base) * 100) : 0;
      return m;
    });

  var totalCumple = modulos.reduce(function (s, m) { return s + m.cumple; }, 0);
  var totalNoCumple = modulos.reduce(function (s, m) { return s + m.noCumple; }, 0);
  var baseGlobal = totalCumple + totalNoCumple;
  var porcentajeGlobal = baseGlobal > 0 ? Math.round((totalCumple / baseGlobal) * 100) : 0;

  var hallazgosCriticos = filas
    .filter(function (fila) { return fila.estado === 'No Cumple'; })
    .map(function (fila) {
      return {
        modulo: fila.modulo,
        item: fila.descripcion,
        observaciones: fila.observaciones || 'Sin observaciones registradas',
        responsable: fila.responsable || 'Por asignar'
      };
    });

  return {
    modulos: modulos,
    porcentajeGlobal: porcentajeGlobal,
    totalItems: filas.length,
    totalCumple: totalCumple,
    totalNoCumple: totalNoCumple,
    hallazgosCriticos: hallazgosCriticos,
    cabecera: getDatosCabecera_()
  };
}

function escribirResumen_(analisis) {
  var sheet = getOrCreateSheet_(RAVELL_CONFIG.SHEETS.RESUMEN);
  var filaInicio = 5;

  // Limpiar rango previo de datos (deja el encabezado de la fila 4 intacto).
  var maxFilasPosibles = RAVELL_CONFIG.MODULOS.length + 2;
  sheet.getRange(filaInicio, 1, maxFilasPosibles, 5).clearContent();

  var filas = analisis.modulos.map(function (m) {
    return [m.modulo, m.porcentaje + '%', m.cumple, m.noCumple];
  });
  if (filas.length > 0) {
    sheet.getRange(filaInicio, 2, filas.length, 4).setValues(filas);
  }

  var filaGlobal = filaInicio + filas.length + 1;
  sheet.getRange(filaGlobal, 2).setValue('CUMPLIMIENTO GLOBAL').setFontWeight('bold');
  sheet.getRange(filaGlobal, 3).setValue(analisis.porcentajeGlobal + '%').setFontWeight('bold')
    .setFontColor(analisis.porcentajeGlobal >= 70 ? '#38761d' : '#990000');

  var filaHallazgos = filaGlobal + 2;
  sheet.getRange(filaHallazgos, 2).setValue('Hallazgos críticos (No Cumple): ' + analisis.hallazgosCriticos.length)
    .setFontWeight('bold');
}
