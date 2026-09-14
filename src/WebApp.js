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
      responsable: fila.responsable || '',
      cantidad: fila.cantidad || '',
      fotos: fila.fotos || []
    });
  });

  var modulos = RAVELL_CONFIG.MODULOS.map(function (m) {
    return {
      nombre: m.nombre,
      conCantidad: RAVELL_CONFIG.MODULOS_CON_CANTIDAD.indexOf(m.nombre) !== -1,
      items: itemsPorModulo[m.nombre] || []
    };
  });

  var logoFileId = cabecera.logoDriveFileId || RAVELL_CONFIG.MARCA.LOGO_DRIVE_FILE_ID_DEFAULT;

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
    estados: RAVELL_CONFIG.ESTADOS,
    logoDataUrl: obtenerLogoDataUrl_(logoFileId)
  };
}

/**
 * Devuelve el logo como data URL (base64) para mostrarlo en el encabezado del formulario web.
 */
function obtenerLogoDataUrl_(fileId) {
  if (!fileId) return null;
  try {
    var blob = DriveApp.getFileById(fileId).getBlob();
    return 'data:' + blob.getContentType() + ';base64,' + Utilities.base64Encode(blob.getBytes());
  } catch (e) {
    return null;
  }
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
 * Guarda el estado/observaciones/responsable/cantidad de cada ítem del checklist.
 * items: [{ filaSheet, estado, observaciones, responsable, cantidad }]
 */
function guardarChecklistWeb(items) {
  var sheet = getOrCreateSheet_(RAVELL_CONFIG.SHEETS.CHECKLIST);
  items.forEach(function (item) { escribirFilaChecklist_(sheet, item); });
  return { ok: true };
}

/**
 * Guarda un solo ítem del checklist. La usa el autoguardado del formulario web
 * para persistir cada cambio sin esperar a que el usuario pulse "Guardar".
 */
function guardarItemChecklistWeb(item) {
  var sheet = getOrCreateSheet_(RAVELL_CONFIG.SHEETS.CHECKLIST);
  escribirFilaChecklist_(sheet, item);
  return { ok: true };
}

function escribirFilaChecklist_(sheet, item) {
  if (!item.filaSheet) return;
  var col = RAVELL_CONFIG.CHECKLIST_COLUMNAS;
  sheet.getRange(item.filaSheet, col.ESTADO).setValue(item.estado || 'Pendiente');
  sheet.getRange(item.filaSheet, col.OBSERVACIONES).setValue(item.observaciones || '');
  sheet.getRange(item.filaSheet, col.RESPONSABLE).setValue(item.responsable || '');
  if (item.cantidad !== undefined) {
    sheet.getRange(item.filaSheet, col.CANTIDAD).setValue(item.cantidad || '');
  }
}

/**
 * Sube una foto (base64 desde el navegador) a una carpeta de Drive dedicada al ítem
 * y agrega su enlace a la columna "Fotos" del checklist, sin borrar las fotos anteriores
 * — así se puede documentar el antes/después del mismo ítem con el tiempo.
 */
function subirFotoItemWeb(filaSheet, nombreArchivo, mimeType, base64Data) {
  var carpeta = obtenerCarpetaFotosItem_(filaSheet);
  var blob = Utilities.newBlob(Utilities.base64Decode(base64Data), mimeType, nombreArchivo);
  var archivo = carpeta.createFile(blob);
  archivo.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

  var sheet = getOrCreateSheet_(RAVELL_CONFIG.SHEETS.CHECKLIST);
  var col = RAVELL_CONFIG.CHECKLIST_COLUMNAS;
  var celda = sheet.getRange(filaSheet, col.FOTOS);
  var actual = celda.getValue();
  var nuevaLista = (actual ? actual + ',' : '') + archivo.getUrl();
  celda.setValue(nuevaLista);

  return { ok: true, url: archivo.getUrl(), fotos: nuevaLista.split(',').map(function (u) { return u.trim(); }) };
}

/**
 * Carpeta de Drive "Fotos Diagnóstico - <Copropiedad>/Item <fila>", creándola si no existe.
 * Vive junto a la Sheet para que quede todo el expediente en un mismo lugar de Drive.
 */
function obtenerCarpetaFotosItem_(filaSheet) {
  var cabecera = getDatosCabecera_();
  var nombreRaiz = 'Fotos Diagnóstico - ' + (cabecera.nombreCopropiedad || 'Copropiedad');
  var carpetaPadre = obtenerCarpetaContenedoraDeLaSheet_();

  var carpetaRaiz = buscarOCrearSubcarpeta_(carpetaPadre, nombreRaiz);
  var carpetaItem = buscarOCrearSubcarpeta_(carpetaRaiz, 'Item ' + filaSheet);
  return carpetaItem;
}

function obtenerCarpetaContenedoraDeLaSheet_() {
  try {
    var ssFile = DriveApp.getFileById(getSs_().getId());
    var carpetas = ssFile.getParents();
    if (carpetas.hasNext()) return carpetas.next();
  } catch (e) {
    // Si falla, se usa la raíz de Drive del usuario.
  }
  return DriveApp.getRootFolder();
}

function buscarOCrearSubcarpeta_(carpetaPadre, nombre) {
  var existentes = carpetaPadre.getFoldersByName(nombre);
  if (existentes.hasNext()) return existentes.next();
  return carpetaPadre.createFolder(nombre);
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
