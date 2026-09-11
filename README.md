# Diagnóstico de Copropiedades — Ravell P.H. Soluciones Integrales S.A.S.

Sistema de Google Apps Script para la recepción, empalme y diagnóstico de nuevas
copropiedades, con **arquitectura Multi-Edificio**: la misma plantilla de Google
Sheets se reutiliza para cualquier copropiedad (Edificio Calle 76, Edificio Terra
93, etc.) cambiando únicamente los datos de la hoja **Cabecera** — nunca el código.

## Arquitectura

```
src/
  appsscript.json      Manifiesto del proyecto (script vinculado a Sheets)
  Config.js             Único punto de configuración: celdas de cabecera,
                         catálogo de los 8 módulos e ítems, colores de marca
  Code.js                Menú personalizado (onOpen)
  Setup.js               Construye/reinicia la plantilla (Cabecera, Checklist, Resumen)
  Utils.js                Helpers de lectura/escritura de la hoja
  AnalysisEngine.js       Motor de análisis: % de cumplimiento y hallazgos críticos
  ReportGenerator.js      Genera el Informe Ejecutivo en Google Docs con logo y membrete
```

### 1. Cabecera dinámica (hoja "Cabecera")

Campos que cambian por copropiedad: Nombre de la Copropiedad, NIT, Administrador
Saliente, Administrador Entrante, Fecha de Diagnóstico, Consultor Responsable y
el ID del archivo de Drive del logo (opcional, si se quiere sobreescribir el logo
por defecto).

### 2. Ingesta por módulos (hoja "Checklist")

La función `inicializarPlantilla()` precarga automáticamente los 8 módulos
oficiales de empalme Ravell P.H. (Marco Normativo, Legal, Financiero/Cartera,
Técnico, Jurídico, SG-SST, Archivo, Inventario) con su batería de ítems de
verificación, definidos en `Config.js`.

### 3. Revisión operativa

Cada ítem tiene una columna **Estado** con lista desplegable (`Cumple`, `No
Cumple`, `No Aplica`, `Pendiente`) con formato condicional de color, y una
columna de **Observaciones** libre.

### 4. Informe Ejecutivo con identidad visual

`generarInformeEjecutivo()` crea un Google Doc que:
- Inserta el logo corporativo de Ravell P.H. desde Drive (usando el File ID
  configurado en Cabecera).
- Construye el título y los datos generales tomando dinámicamente el nombre
  del edificio desde la hoja de cálculo.
- Incluye resumen de cumplimiento global, tabla por módulo y tabla de
  hallazgos críticos ("No Cumple") con observaciones y responsable.
- Se guarda en la misma carpeta de Drive del Google Sheet, listo para
  entregar al Consejo de Administración.

### 5. Motor de análisis

`calcularCumplimiento()` calcula el % de cumplimiento global y por módulo
(Cumple / (Cumple + No Cumple), excluyendo "No Aplica" y "Pendiente") y lo
escribe en la hoja "Resumen".

## Uso (menú "Ravell P.H. Diagnóstico" en Sheets)

1. **Inicializar plantilla** — una sola vez por copropiedad nueva.
2. Completar la hoja **Cabecera** y diligenciar el **Checklist**.
3. **Calcular cumplimiento** — actualiza la hoja Resumen.
4. **Generar Informe Ejecutivo** — produce el Google Doc final.

## Despliegue (clasp + GitHub Actions)

Este repo está preparado para el flujo: editar código → push a `main` →
GitHub Actions sube el código al proyecto de Apps Script automáticamente.

Pasos manuales de configuración inicial (una vez):

1. Crear la Google Sheet plantilla y, desde `Extensiones → Apps Script`,
   copiar el `Script ID` del proyecto generado (o usar `clasp create --type
   sheets --parentId <ID_DEL_SHEET>` para vincularlo vía clasp).
2. Copiar `.clasp.json.example` a `.clasp.json` y pegar ese Script ID
   localmente (este archivo está en `.gitignore`, no se sube al repo).
3. En GitHub → *Settings → Secrets and variables → Actions*, crear:
   - `CLASP_CREDENTIALS`: contenido de `~/.clasprc.json` tras `clasp login`.
   - `APPS_SCRIPT_ID`: el mismo Script ID del paso 1.
4. Desde el editor de Apps Script, ejecutar una vez `inicializarPlantilla()`
   (o `onOpen`) para autorizar los permisos de Sheets/Docs/Drive.
5. Subir el logo corporativo de Ravell P.H. a Drive y pegar su File ID en la
   celda correspondiente de la hoja Cabecera.

De ahí en adelante, cada push a `main` actualiza el código del proyecto de
Apps Script automáticamente vía el workflow `.github/workflows/deploy.yml`.
