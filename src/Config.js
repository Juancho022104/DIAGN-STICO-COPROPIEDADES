/**
 * Config.js
 * Parámetros de arquitectura Multi-Edificio: nombres de hojas, celdas de cabecera,
 * catálogo de módulos/ítems y constantes visuales de Ravell P.H.
 * Cambiar de copropiedad = solo cambiar los valores de la hoja "Cabecera", nunca el código.
 */

var RAVELL_CONFIG = {

  SHEETS: {
    CABECERA: 'Cabecera',
    CHECKLIST: 'Checklist',
    RESUMEN: 'Resumen'
  },

  // Celdas de la hoja Cabecera. Estos son los únicos datos que cambian entre copropiedades.
  CABECERA_CELDAS: {
    NOMBRE_COPROPIEDAD: 'C4',
    NIT: 'C5',
    ADMINISTRADOR_SALIENTE: 'C6',
    ADMINISTRADOR_ENTRANTE: 'C7',
    FECHA_DIAGNOSTICO: 'C8',
    CONSULTOR_RESPONSABLE: 'C9',
    LOGO_DRIVE_FILE_ID: 'C10'
  },

  CHECKLIST_COLUMNAS: {
    MODULO: 1,
    ITEM: 2,
    DESCRIPCION: 3,
    ESTADO: 4,
    OBSERVACIONES: 5,
    RESPONSABLE: 6,
    FECHA_REVISION: 7,
    CANTIDAD: 8,
    FOTOS: 9
  },
  CHECKLIST_FILA_INICIO: 3,

  // Módulos donde tiene sentido capturar cantidad (p. ej. Inventario: "6 extintores").
  MODULOS_CON_CANTIDAD: ['8. Inventario Físico: Llaves, Accesos y Activos Fijos'],

  ESTADOS: ['Cumple', 'No Cumple', 'No Aplica', 'Pendiente'],

  COLOR_ESTADO: {
    'Cumple': '#d9ead3',
    'No Cumple': '#f4cccc',
    'No Aplica': '#efefef',
    'Pendiente': '#fff2cc'
  },

  MARCA: {
    COLOR_PRIMARIO: '#1c3f60',
    COLOR_SECUNDARIO: '#c9a227',
    NOMBRE_EMPRESA: 'Ravell P.H. Soluciones Integrales S.A.S.',
    // Logo oficial de Ravell P.H. en Drive. Se usa por defecto en el membrete del
    // Informe Ejecutivo y en el formulario web; el campo de Cabecera solo hace falta
    // diligenciarlo si alguna copropiedad necesita un logo distinto.
    LOGO_DRIVE_FILE_ID_DEFAULT: '11kmPv8v72Bu3RadPz9CiIYlAjmtDNo2Z'
  },

  // Los 8 módulos oficiales del "Requerimiento Formal de Entrega" (protocolo de empalme
  // y recepción de copropiedades) de Ravell P.H. Soluciones Integrales S.A.S.
  MODULOS: [
    {
      nombre: '1. Marco Normativo, Legal y Convivencia',
      items: [
        'Escritura Pública de Constitución de Propiedad Horizontal (RPH)',
        'Folio de Matrícula Inmobiliaria Matriz',
        'Escrituras de Reformas al RPH (si las hay)',
        'Actas de Asamblea General (mínimo últimos 3 años)',
        'Manual de Convivencia aprobado',
        'Protocolo de Mudanzas y Trasteos',
        'Protocolo de Uso de Parqueaderos',
        'Protocolo de Mascotas (Ley 1801 de 2016)',
        'Certificado de Lavado de Tanque(s) de Agua',
        'Certificado de Control de Plagas / Fumigación',
        'Protocolo de Rescate / Maniobra de Ascensor',
        'Licencia de Construcción y Acta de Entrega del Constructor',
        'Sanciones o Requerimientos de Curaduría, Planeación o Bomberos'
      ]
    },
    {
      nombre: '2. Representación Legal y Organismos de Control',
      items: [
        'Certificado de Representación Legal',
        'RUT actualizado ante la DIAN',
        'Registro Único de Beneficiarios (RUB)',
        'Datos del Consejo de Administración',
        'Datos del Comité de Convivencia',
        'Datos de Revisoría Fiscal / Contador saliente',
        'Contrato de Administración de la gestión saliente',
        'Paz y Salvo de Honorarios del Administrador Saliente'
      ]
    },
    {
      nombre: '3. Estados Financieros, Bancos y Cartera',
      items: [
        'Estados Financieros de Cierre',
        'Certificación Bancaria Cuenta Principal',
        'Certificación Cuenta Fondo de Imprevistos',
        'Tokens y Claves del Portal Bancario',
        'Arqueo de Caja Menor',
        'Reporte de Cartera por Unidad Privada',
        'Acuerdos de Pago Vigentes',
        'Declaraciones Tributarias (DIAN / Distrito)',
        'Copia / Acceso al Software Contable',
        // Anexo 3-A · Información requerida por el área de contabilidad
        'Balance de prueba (por cuenta) de enero a agosto de 2026',
        'Balance por terceros de enero a agosto de 2026',
        'Movimiento contable por cuenta y por tercero de enero a agosto de 2026',
        'Reporte de terceros del software con la información completa para reporte de exógena',
        'Libro Diario, impreso en los libros oficiales',
        'Libro Mayor y Balances, impreso en los libros oficiales',
        'Libro de Inventarios y Balances, impreso en los libros oficiales',
        'Libro de Actas (contable)',
        'Libro de Accionistas (si aplica)',
        'Nómina en Excel de enero a agosto (si aplica)',
        'Estados Financieros con Revelaciones 2025 (5 estados financieros)',
        'Estados Financieros con Revelaciones a agosto de 2026',
        'Informe de Auditoría o Revisoría Fiscal 2025',
        'Ejecución presupuestal de enero a agosto de 2026',
        'Manual de Políticas Contables',
        'Memorandos Técnicos (si aplican)',
        'Detalle de Impuesto Diferido (si aplica)',
        'Declaración de Renta con anexos (papel de trabajo) 2025 (si aplica)',
        'Conciliación Contable y Fiscal — Formato 2516, año 2025 (si aplica)',
        'Declaraciones de IVA bimestrales o cuatrimestrales con anexos, 2026 (si aplica)',
        'Certificados de Retención de IVA (si aplica) 2026',
        'Declaraciones de Retención en la Fuente mensuales con anexos, año 2026',
        'Declaraciones de ICA bimestrales o anuales con anexos, año 2026 (si aplica)',
        'Certificados de Retención de ICA (si aplica) 2026',
        'Declaraciones de Retención de ICA bimestrales con anexos, año 2026 (si aplica)',
        'Conciliaciones bancarias mensuales, enero a agosto de 2026',
        'Partidas conciliatorias y su seguimiento, enero a agosto de 2026',
        'Cartera por cliente y edad de cartera a agosto de 2026',
        'Relación de copropietarios con coeficiente y datos de facturación',
        'Cuadro de Activos Fijos conciliado con las cuentas contables',
        'Vida útil según política contable',
        'Cálculo de depreciación de activos fijos',
        'Detalle por tercero y edad de los saldos por pagar (Proveedores)',
        'Usuario y clave del portal de la DIAN, y clave de firma',
        'Usuario y clave de la Secretaría de Hacienda (firma y medios magnéticos)',
        'Usuario y clave de la planilla de seguridad social (PILA)',
        'Clave de Cámara de Comercio (si aplica)',
        'Claves de otras entidades donde se realicen reportes'
      ]
    },
    {
      nombre: '4. Operación Técnica y Mantenimientos Críticos',
      items: [
        'Certificado de Inspección ONAC del Ascensor',
        'Hoja de Vida y Bitácora del Ascensor',
        'Estado de Bombas e Hidroneumático',
        'Inspección del Tanque de Reserva',
        'Ficha Técnica del Portón Vehicular',
        'Sistema de CCTV y Citofonía',
        'Contratos Vigentes de Servicios y Mantenimiento',
        // Anexo 4-A · Cuadro maestro de mantenimientos preventivos
        'Mantenimiento preventivo: Ascensor (frecuencia, últ./próx. fecha, proveedor)',
        'Mantenimiento preventivo: Bombas / Sistema hidroneumático',
        'Mantenimiento preventivo: Tanque de reserva de agua',
        'Mantenimiento preventivo: Planta eléctrica / UPS (si aplica)',
        'Mantenimiento preventivo: Red y sistema contra incendios',
        'Mantenimiento preventivo: Portón vehicular',
        'Mantenimiento preventivo: CCTV y citofonía'
      ]
    },
    {
      nombre: '5. Expedientes Jurídicos, Derechos de Petición y Tutelas',
      items: [
        'Expedientes de Cobro Jurídico',
        'Títulos Ejecutivos (Certificados Art. 48)',
        'Paz y Salvo / Sustitución de Apoderado',
        'Acciones de Tutela Activas o Falladas',
        'Querellas / Procesos de Inspección de Policía',
        'Derechos de Petición Pendientes'
      ]
    },
    {
      nombre: '6. Seguros, SG-SST y Cumplimiento Regulatorio',
      items: [
        'Póliza Todo Riesgo de Zonas Comunes (Art. 15 Ley 675)',
        'Cobertura de Equipos (Ascensor / Bombas)',
        'Sistema de Gestión SG-SST',
        'Habeas Data / Tratamiento de Datos Personales',
        'Sistema de Prevención y Atención de Emergencias'
      ]
    },
    {
      nombre: '7. Archivo Físico, Libros y Censo de Residentes',
      items: [
        'Libro de Actas de Asamblea',
        'Libro de Actas de Consejo',
        'Censo de Propietarios, Residentes, Vehículos y Mascotas'
      ]
    },
    {
      nombre: '8. Inventario Físico: Llaves, Accesos y Activos Fijos',
      items: [
        // 8-A · Llaves y dispositivos de acceso
        'Llaves maestras / copia (cuarto de máquinas del ascensor y llave de rescate)',
        'Llaves del cuarto de bombas de agua e hidroneumático',
        'Llaves de subestación eléctrica y tableros principales',
        'Llaves de terraza, cubiertas y depósitos comunales',
        'Controles remotos / tags (portón de acceso vehicular y puerta peatonal)',
        // 8-B · Inventario de activos fijos
        'Mobiliario de oficina de administración y zonas comunes',
        'Equipos de cómputo (computadores, portátiles)',
        'Impresora(s) / escáner',
        'Grabador digital de video (DVR / NVR)',
        'Herramientas y equipos de mantenimiento',
        'Elementos de dotación de la administración'
      ]
    }
  ]
};
