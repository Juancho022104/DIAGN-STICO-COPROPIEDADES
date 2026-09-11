/**
 * Code.js
 * Punto de entrada: menú personalizado en Google Sheets.
 */

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Ravell P.H. Diagnóstico')
    .addItem('1. Inicializar plantilla (nueva copropiedad)', 'inicializarPlantilla')
    .addSeparator()
    .addItem('2. Calcular cumplimiento', 'calcularCumplimiento')
    .addItem('3. Generar Informe Ejecutivo (Google Doc)', 'generarInformeEjecutivo')
    .addToUi();
}
