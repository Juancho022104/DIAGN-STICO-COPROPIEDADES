# Diagnóstico de Copropiedades — Ravell P.H. Soluciones Integrales S.A.S.

Sistema de Google Apps Script para la recepción, empalme y diagnóstico de nuevas
copropiedades, con **arquitectura Multi-Edificio**: la misma plantilla de Google
Sheets se reutiliza para cualquier copropiedad (Edificio Calle 76, Edificio Terra
93, etc.) cambiando únicamente los datos de la hoja **Cabecera** — nunca el código.

## Arquitectura

```
src/
  appsscript.json      Manifiesto del proyecto (script vinculado a Sheets + Web App)
  Config.js             Único punto de configuración: celdas de cabecera,
                         catálogo de los 8 módulos e ítems, colores de marca
  Code.js                Menú personalizado (onOpen)
  Setup.js               Construye/reinicia la plantilla (Cabecera, Checklist, Resumen)
  Utils.js                Helpers de lectura/escritura de la hoja
  AnalysisEngine.js       Motor de análisis: % de cumplimiento y hallazgos críticos
  ReportGenerator.js      Genera el Informe Ejecutivo en Google Docs con logo y membrete
  WebApp.js               Backend de la Web App (doGet + funciones para el formulario)
  Index.html              Formulario web (estructura)
  CSS.html                Estilos del formulario web
  JS.html                 Lógica del cliente del formulario web
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

## Uso

### Opción A — Formulario web (recomendado, automático)

La operación diaria se hace desde la **Web App**, no editando la Sheet a mano:

1. Abre la URL de la Web App (ver "Publicar la Web App" más abajo).
2. Pestaña **Datos Generales**: diligencia Nombre de la Copropiedad, NIT,
   administradores, fecha y consultor → **Guardar Datos Generales**.
3. Sección **Checklist por Módulo**: se carga automáticamente con los 8
   módulos e ítems; marca Estado, Observaciones y Responsable por ítem →
   **Guardar Checklist**.
4. **Calcular Cumplimiento** — muestra el % global y los hallazgos críticos.
5. **Generar Informe Ejecutivo** — genera el Google Doc y muestra el enlace
   para abrirlo directamente.

Por detrás, el formulario sigue leyendo y escribiendo en las hojas Cabecera,
Checklist y Resumen — así que el menú de Sheets (Opción B) y la Web App
siempre están sincronizados sobre los mismos datos.

### Opción B — Menú en Sheets (manual, alternativa)

1. **Inicializar plantilla** — una sola vez por copropiedad nueva.
2. Completar la hoja **Cabecera** y diligenciar el **Checklist**.
3. **Calcular cumplimiento** — actualiza la hoja Resumen.
4. **Generar Informe Ejecutivo** — produce el Google Doc final.

### Publicar la Web App (paso manual, una vez por copropiedad)

En el editor de Apps Script: **Implementar → Nueva implementación →
Aplicación web**. Configura:
- Ejecutar como: **Yo (tu cuenta)** — así la app puede escribir en la Sheet
  aunque quien la use no tenga permisos directos sobre ella.
- Quién tiene acceso: **Cualquier usuario con cuenta de Google** (requiere
  login, adecuado porque el diagnóstico maneja datos financieros/legales
  sensibles).

Copia la URL de la Web App que te entrega — esa es la que compartes con tu
equipo. Cada vez que el código cambie y se despliegue vía GitHub Actions,
debes volver a **Implementar → Gestionar implementaciones → Editar → Nueva
versión** para que la Web App tome el código actualizado (es el mismo paso
manual que Google exige siempre, no se puede automatizar).

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

   (El Script ID ya está fijado directamente en `.github/workflows/deploy.yml`,
   no requiere secreto porque no es información sensible por sí sola.)
4. Desde el editor de Apps Script, ejecutar una vez `inicializarPlantilla()`
   (o `onOpen`) para autorizar los permisos de Sheets/Docs/Drive.
5. Subir el logo corporativo de Ravell P.H. a Drive y pegar su File ID en la
   celda correspondiente de la hoja Cabecera.

De ahí en adelante, cada push a `main` actualiza el código del proyecto de
Apps Script automáticamente vía el workflow `.github/workflows/deploy.yml`.
