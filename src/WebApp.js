/**
 * WebApp.js
 * Backend de la Web App: sirve el formulario HTML y expone las funciones que
 * el cliente llama vía google.script.run. La Google Sheet sigue siendo la base
 * de datos (Cabecera, Checklist, Resumen); el formulario solo lee/escribe ahí.
 */

function doGet(e) {
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('Diagnóstico de Empalme - Ravell P.H.')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Permite incluir CSS.html y JS.html dentro de Index.html con <?!= include('CSS'); ?>
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 * Datos iniciales para pintar el formulario: cabecera actual + checklist agrupado por módulo.
 */
function cargarDatosIniciales() {
  var cabecera = getDatosCabecera_();
  var filas = getFilasChecklist_();

  var itemsPorModulo = {};
  filas.forEach(function (fila) {
    if (!itemsPorModulo[fila.modulo]) itemsPorModulo[fila.modulo] = [];
    itemsPorModulo[fila.modulo].push({
      filaSheet: fila.filaSheet,
      item: fila.item,
      descripcion: fila.descripcion,
      estado: fila.estado || 'Pendiente',
      observaciones: fila.observaciones || '',
      responsable: fila.responsable || ''
    });
  });

  var modulos = RAVELL_CONFIG.MODULOS.map(function (m) {
    return { nombre: m.nombre, items: itemsPorModulo[m.nombre] || [] };
  });

  return {
    cabecera: {
      nombreCopropiedad: cabecera.nombreCopropiedad || '',
      nit: cabecera.nit || '',
      administradorSaliente: cabecera.administradorSaliente || '',
      administradorEntrante: cabecera.administradorEntrante || '',
      fechaDiagnostico: formatearFechaInput_(cabecera.fechaDiagnostico),
      consultorResponsable: cabecera.consultorResponsable || '',
      logoDriveFileId: cabecera.logoDriveFileId || ''
    },
    modulos: modulos,
    estados: RAVELL_CONFIG.ESTADOS
  };
}

function formatearFechaInput_(fecha) {
  if (!fecha) return '';
  if (Object.prototype.toString.call(fecha) === '[object Date]') {
    return Utilities.formatDate(fecha, 'America/Bogota', 'yyyy-MM-dd');
  }
  return '';
}

/**
 * Guarda los datos generales enviados desde el formulario web.
 */
function guardarCabeceraWeb(datos) {
  var sheet = getOrCreateSheet_(RAVELL_CONFIG.SHEETS.CABECERA);
  var c = RAVELL_CONFIG.CABECERA_CELDAS;

  sheet.getRange(c.NOMBRE_COPROPIEDAD).setValue(datos.nombreCopropiedad || '');
  sheet.getRange(c.NIT).setValue(datos.nit || '');
  sheet.getRange(c.ADMINISTRADOR_SALIENTE).setValue(datos.administradorSaliente || '');
  sheet.getRange(c.ADMINISTRADOR_ENTRANTE).setValue(datos.administradorEntrante || '');
  sheet.getRange(c.FECHA_DIAGNOSTICO).setValue(datos.fechaDiagnostico ? new Date(datos.fechaDiagnostico) : '');
  sheet.getRange(c.CONSULTOR_RESPONSABLE).setValue(datos.consultorResponsable || '');
  sheet.getRange(c.LOGO_DRIVE_FILE_ID).setValue(datos.logoDriveFileId || '');

  return { ok: true };
}

/**
 * Guarda el estado/observaciones/responsable de cada ítem del checklist.
 * items: [{ filaSheet, estado, observaciones, responsable }]
 */
function guardarChecklistWeb(items) {
  var sheet = getOrCreateSheet_(RAVELL_CONFIG.SHEETS.CHECKLIST);
  var col = RAVELL_CONFIG.CHECKLIST_COLUMNAS;

  items.forEach(function (item) {
    if (!item.filaSheet) return;
    sheet.getRange(item.filaSheet, col.ESTADO).setValue(item.estado || 'Pendiente');
    sheet.getRange(item.filaSheet, col.OBSERVACIONES).setValue(item.observaciones || '');
    sheet.getRange(item.filaSheet, col.RESPONSABLE).setValue(item.responsable || '');
  });

  return { ok: true };
}

/**
 * Calcula el cumplimiento (mismo motor que el menú de Sheets) y lo devuelve al formulario.
 */
function calcularCumplimientoWeb() {
  var analisis = construirAnalisis_();
  escribirResumen_(analisis);
  return {
    porcentajeGlobal: analisis.porcentajeGlobal,
    totalItems: analisis.totalItems,
    totalCumple: analisis.totalCumple,
    totalNoCumple: analisis.totalNoCumple,
    modulos: analisis.modulos,
    hallazgosCriticos: analisis.hallazgosCriticos
  };
}

/**
 * Genera el Informe Ejecutivo en Google Docs desde la Web App y devuelve su URL.
 */
function generarInformeWeb() {
  var analisis = construirAnalisis_();

  if (!analisis.cabecera.nombreCopropiedad) {
    return { ok: false, message: 'Completa primero el Nombre de la Copropiedad.' };
  }

  escribirResumen_(analisis);
  var url = generarInformeEjecutivoCore_(analisis);
  return { ok: true, url: url };
}
