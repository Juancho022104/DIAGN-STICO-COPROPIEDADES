/**
 * Setup.js
 * Construye/reinicia la plantilla reutilizable: cabecera dinámica + matriz de 8 módulos.
 * Se ejecuta una vez por copropiedad nueva (o para reiniciar el checklist manteniendo el código).
 */

function inicializarPlantilla() {
  var ui = SpreadsheetApp.getUi();
  var resp = ui.alert(
    'Inicializar plantilla',
    'Esto (re)crea las hojas "Cabecera", "Checklist" y "Resumen". ' +
    'Si ya existe un checklist con datos, sus estados y observaciones se perderán. ¿Continuar?',
    ui.ButtonSet.YES_NO
  );
  if (resp !== ui.Button.YES) return;

  construirHojaCabecera_();
  construirHojaChecklist_();
  construirHojaResumen_();

  getSs_().setActiveSheet(getSs_().getSheetByName(RAVELL_CONFIG.SHEETS.CABECERA));
  ui.alert('Plantilla lista. Completa los datos en la hoja "Cabecera" y luego diligencia el "Checklist".');
}

function construirHojaCabecera_() {
  var sheet = getOrCreateSheet_(RAVELL_CONFIG.SHEETS.CABECERA);
  sheet.clear();
  sheet.setTabColor(RAVELL_CONFIG.MARCA.COLOR_PRIMARIO);

  sheet.getRange('B2:D2').merge().setValue('DIAGNÓSTICO DE EMPALME — DATOS GENERALES DE LA COPROPIEDAD')
    .setFontWeight('bold').setFontSize(13).setFontColor('#ffffff')
    .setBackground(RAVELL_CONFIG.MARCA.COLOR_PRIMARIO);

  var filas = [
    ['Nombre de la Copropiedad', ''],
    ['NIT', ''],
    ['Administrador Saliente', ''],
    ['Administrador Entrante (Ravell P.H.)', 'Ravell P.H. Soluciones Integrales S.A.S.'],
    ['Fecha de Diagnóstico', new Date()],
    ['Consultor Responsable', ''],
    ['ID de archivo del logo en Drive (opcional)', '']
  ];

  sheet.getRange(4, 2, filas.length, 2).setValues(filas);
  sheet.getRange(4, 2, filas.length, 1).setFontWeight('bold');
  sheet.getRange(8, 3).setNumberFormat('dd/mm/yyyy');

  sheet.setColumnWidth(1, 20);
  sheet.setColumnWidth(2, 280);
  sheet.setColumnWidth(3, 320);
}

function construirHojaChecklist_() {
  var sheet = getOrCreateSheet_(RAVELL_CONFIG.SHEETS.CHECKLIST);
  sheet.clear();
  sheet.clearFormats();
  sheet.setTabColor(RAVELL_CONFIG.MARCA.COLOR_SECUNDARIO);

  var headers = ['Módulo', 'Ítem', 'Descripción de verificación', 'Estado', 'Observaciones', 'Responsable', 'Fecha de Revisión'];
  sheet.getRange(2, 1, 1, headers.length).setValues([headers])
    .setFontWeight('bold').setBackground(RAVELL_CONFIG.MARCA.COLOR_PRIMARIO).setFontColor('#ffffff');

  var filaActual = RAVELL_CONFIG.CHECKLIST_FILA_INICIO;
  var filasData = [];
  RAVELL_CONFIG.MODULOS.forEach(function (modulo) {
    modulo.items.forEach(function (itemTexto, idx) {
      filasData.push([modulo.nombre, 'Ítem ' + (idx + 1), itemTexto, 'Pendiente', '', '', '']);
    });
  });

  if (filasData.length > 0) {
    sheet.getRange(filaActual, 1, filasData.length, 7).setValues(filasData);
  }

  // Validación de datos para la columna Estado.
  var estadoRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(RAVELL_CONFIG.ESTADOS, true)
    .setAllowInvalid(false)
    .build();
  sheet.getRange(filaActual, RAVELL_CONFIG.CHECKLIST_COLUMNAS.ESTADO, filasData.length, 1).setDataValidation(estadoRule);

  // Formato condicional por estado.
  aplicarFormatoCondicionalEstado_(sheet, filaActual, filasData.length);

  sheet.setFrozenRows(2);
  sheet.setColumnWidths(1, 1, 160);
  sheet.setColumnWidth(2, 70);
  sheet.setColumnWidth(3, 420);
  sheet.setColumnWidth(4, 100);
  sheet.setColumnWidth(5, 260);
  sheet.setColumnWidth(6, 140);
  sheet.setColumnWidth(7, 120);
}

function aplicarFormatoCondicionalEstado_(sheet, filaInicio, numFilas) {
  if (numFilas === 0) return;
  var rango = sheet.getRange(filaInicio, RAVELL_CONFIG.CHECKLIST_COLUMNAS.ESTADO, numFilas, 1);
  var reglas = Object.keys(RAVELL_CONFIG.COLOR_ESTADO).map(function (estado) {
    return SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo(estado)
      .setBackground(RAVELL_CONFIG.COLOR_ESTADO[estado])
      .setRanges([rango])
      .build();
  });
  var existentes = sheet.getConditionalFormatRules().filter(function (r) {
    return r.getRanges()[0].getA1Notation() !== rango.getA1Notation();
  });
  sheet.setConditionalFormatRules(existentes.concat(reglas));
}

function construirHojaResumen_() {
  var sheet = getOrCreateSheet_(RAVELL_CONFIG.SHEETS.RESUMEN);
  sheet.clear();
  sheet.setTabColor(RAVELL_CONFIG.MARCA.COLOR_PRIMARIO);
  sheet.getRange('B2').setValue('RESUMEN DE CUMPLIMIENTO')
    .setFontWeight('bold').setFontSize(13);
  sheet.getRange('B2:E2').merge();
  sheet.getRange('B4:E4').setValues([['Módulo', '% Cumplimiento', 'Cumple', 'No Cumple']])
    .setFontWeight('bold').setBackground(RAVELL_CONFIG.MARCA.COLOR_PRIMARIO).setFontColor('#ffffff');
  sheet.setColumnWidth(1, 20);
  sheet.setColumnWidth(2, 220);
  sheet.setColumnWidth(3, 130);
  sheet.setColumnWidth(4, 100);
  sheet.setColumnWidth(5, 110);
}
