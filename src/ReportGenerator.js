/**
 * ReportGenerator.js
 * Genera el Informe Ejecutivo en Google Docs: membrete con logo corporativo,
 * título dinámico con el nombre del edificio, resumen de cumplimiento y hallazgos críticos.
 */

function generarInformeEjecutivo() {
  var analisis = construirAnalisis_();

  if (!analisis.cabecera.nombreCopropiedad) {
    SpreadsheetApp.getUi().alert('Completa primero el "Nombre de la Copropiedad" en la hoja Cabecera.');
    return;
  }

  var url = generarInformeEjecutivoCore_(analisis);
  SpreadsheetApp.getUi().alert('Informe Ejecutivo generado:\n' + url);
  return url;
}

/**
 * Construye el Google Doc a partir de un análisis ya calculado, sin depender de la UI de Sheets.
 * La usan tanto el menú de Sheets como la Web App.
 */
function generarInformeEjecutivoCore_(analisis) {
  var cabecera = analisis.cabecera;
  var nombreDoc = 'Informe Ejecutivo de Diagnóstico - ' + cabecera.nombreCopropiedad;
  var doc = DocumentApp.create(nombreDoc);
  var body = doc.getBody();
  body.setMarginTop(50).setMarginBottom(50);

  insertarMembrete_(body, cabecera);
  insertarTituloYDatos_(body, cabecera);
  insertarResumenCumplimiento_(body, analisis);
  insertarTablaPorModulo_(body, analisis);
  insertarHallazgosCriticos_(body, analisis);
  insertarCierre_(body, cabecera);

  doc.saveAndClose();
  moverInformeAlDriveDelProyecto_(doc.getId());

  return doc.getUrl();
}

/**
 * Inserta el logo corporativo de Ravell P.H. desde Drive (si se configuró un File ID en Cabecera).
 */
function insertarMembrete_(body, cabecera) {
  if (cabecera.logoDriveFileId) {
    try {
      var logoFile = DriveApp.getFileById(cabecera.logoDriveFileId);
      var img = body.appendImage(logoFile.getBlob());
      img.setWidth(140);
      img.setHeight(img.getHeight() * (140 / img.getWidth()));
      var imgParent = img.getParent();
      if (imgParent.getType() === DocumentApp.ElementType.PARAGRAPH) {
        imgParent.asParagraph().setAlignment(DocumentApp.HorizontalAlignment.CENTER);
      }
    } catch (e) {
      body.appendParagraph('[No fue posible cargar el logo corporativo: ' + e.message + ']')
        .setForegroundColor('#999999').setFontSize(8);
    }
  }

  var pieMembrete = body.appendParagraph(RAVELL_CONFIG.MARCA.NOMBRE_EMPRESA);
  pieMembrete.setAlignment(DocumentApp.HorizontalAlignment.CENTER)
    .setFontSize(10).setForegroundColor(RAVELL_CONFIG.MARCA.COLOR_PRIMARIO).setBold(true);

  var linea = body.appendParagraph('________________________________________________');
  linea.setAlignment(DocumentApp.HorizontalAlignment.CENTER).setForegroundColor('#cccccc');
}

function insertarTituloYDatos_(body, cabecera) {
  var titulo = body.appendParagraph('INFORME EJECUTIVO DE DIAGNÓSTICO DE EMPALME');
  titulo.setHeading(DocumentApp.ParagraphHeading.TITLE)
    .setAlignment(DocumentApp.HorizontalAlignment.CENTER)
    .setForegroundColor(RAVELL_CONFIG.MARCA.COLOR_PRIMARIO);

  var subtitulo = body.appendParagraph(String(cabecera.nombreCopropiedad).toUpperCase());
  subtitulo.setHeading(DocumentApp.ParagraphHeading.SUBTITLE)
    .setAlignment(DocumentApp.HorizontalAlignment.CENTER);

  body.appendParagraph('');

  var tablaDatos = body.appendTable([
    ['NIT', String(cabecera.nit || 'N/A')],
    ['Administrador Saliente', String(cabecera.administradorSaliente || 'N/A')],
    ['Administrador Entrante', String(cabecera.administradorEntrante || 'N/A')],
    ['Fecha de Diagnóstico', formatearFecha_(cabecera.fechaDiagnostico)],
    ['Consultor Responsable', String(cabecera.consultorResponsable || 'N/A')]
  ]);
  formatearTablaDatos_(tablaDatos);
  body.appendParagraph('');
}

function formatearTablaDatos_(tabla) {
  for (var i = 0; i < tabla.getNumRows(); i++) {
    var fila = tabla.getRow(i);
    fila.getCell(0).setBackgroundColor('#eef2f7');
    fila.getCell(0).editAsText().setBold(true);
  }
}

function insertarResumenCumplimiento_(body, analisis) {
  var h = body.appendParagraph('1. Resultado Global de Cumplimiento');
  h.setHeading(DocumentApp.ParagraphHeading.HEADING1).setForegroundColor(RAVELL_CONFIG.MARCA.COLOR_PRIMARIO);

  var resultado = body.appendParagraph('Porcentaje de cumplimiento global: ' + analisis.porcentajeGlobal + '%');
  resultado.setBold(true).setFontSize(14)
    .setForegroundColor(analisis.porcentajeGlobal >= 70 ? '#38761d' : '#990000');

  body.appendParagraph(
    'Se evaluaron ' + analisis.totalItems + ' ítems distribuidos en los 8 módulos de empalme Ravell P.H. ' +
    'De estos, ' + analisis.totalCumple + ' cumplen los requisitos y ' + analisis.totalNoCumple +
    ' presentan hallazgos que requieren plan de acción.'
  );
  body.appendParagraph('');
}

function insertarTablaPorModulo_(body, analisis) {
  var h = body.appendParagraph('2. Cumplimiento por Módulo');
  h.setHeading(DocumentApp.ParagraphHeading.HEADING1).setForegroundColor(RAVELL_CONFIG.MARCA.COLOR_PRIMARIO);

  var filas = [['Módulo', '% Cumplimiento', 'Cumple', 'No Cumple']];
  analisis.modulos.forEach(function (m) {
    filas.push([m.modulo, m.porcentaje + '%', String(m.cumple), String(m.noCumple)]);
  });

  var tabla = body.appendTable(filas);
  var encabezado = tabla.getRow(0);
  for (var c = 0; c < encabezado.getNumCells(); c++) {
    encabezado.getCell(c).setBackgroundColor(RAVELL_CONFIG.MARCA.COLOR_PRIMARIO);
    encabezado.getCell(c).editAsText().setBold(true).setForegroundColor('#ffffff');
  }
  body.appendParagraph('');
}

function insertarHallazgosCriticos_(body, analisis) {
  var h = body.appendParagraph('3. Hallazgos Críticos (No Cumple)');
  h.setHeading(DocumentApp.ParagraphHeading.HEADING1).setForegroundColor('#990000');

  if (analisis.hallazgosCriticos.length === 0) {
    body.appendParagraph('No se identificaron hallazgos críticos en el diagnóstico.').setItalic(true);
    return;
  }

  var filas = [['Módulo', 'Ítem', 'Observaciones', 'Responsable']];
  analisis.hallazgosCriticos.forEach(function (hallazgo) {
    filas.push([hallazgo.modulo, hallazgo.item, hallazgo.observaciones, hallazgo.responsable]);
  });

  var tabla = body.appendTable(filas);
  var encabezado = tabla.getRow(0);
  for (var c = 0; c < encabezado.getNumCells(); c++) {
    encabezado.getCell(c).setBackgroundColor('#990000');
    encabezado.getCell(c).editAsText().setBold(true).setForegroundColor('#ffffff');
  }
  for (var r = 1; r < tabla.getNumRows(); r++) {
    tabla.getRow(r).getCell(0).setBackgroundColor('#fdeaea');
  }
  body.appendParagraph('');
}

function insertarCierre_(body, cabecera) {
  var h = body.appendParagraph('4. Recomendación al Consejo de Administración');
  h.setHeading(DocumentApp.ParagraphHeading.HEADING1).setForegroundColor(RAVELL_CONFIG.MARCA.COLOR_PRIMARIO);
  body.appendParagraph(
    'Este informe se entrega como resultado del proceso de empalme administrativo realizado por ' +
    RAVELL_CONFIG.MARCA.NOMBRE_EMPRESA + ' en ' + String(cabecera.nombreCopropiedad) +
    '. Se recomienda al Consejo de Administración priorizar los hallazgos críticos listados en la ' +
    'sección 3 y definir un plan de acción con responsables y fechas de cierre.'
  );
  body.appendParagraph('');
  var firma = body.appendParagraph('Elaborado por: ' + (String(cabecera.consultorResponsable || '') || RAVELL_CONFIG.MARCA.NOMBRE_EMPRESA));
  firma.setBold(true);
}

/**
 * Mueve el Doc generado a la misma carpeta de Drive donde vive el Google Sheet (si existe),
 * para mantener todo el expediente de la copropiedad en un solo lugar.
 */
function moverInformeAlDriveDelProyecto_(docId) {
  try {
    var ssFile = DriveApp.getFileById(getSs_().getId());
    var carpetas = ssFile.getParents();
    if (carpetas.hasNext()) {
      var carpeta = carpetas.next();
      DriveApp.getFileById(docId).moveTo(carpeta);
    }
  } catch (e) {
    // Si no se puede mover (p. ej. permisos), el documento queda en la raíz de Drive del usuario.
  }
}
