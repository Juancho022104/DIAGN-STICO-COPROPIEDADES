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
    FECHA_REVISION: 7
  },
  CHECKLIST_FILA_INICIO: 3,

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
    NOMBRE_EMPRESA: 'Ravell P.H. Soluciones Integrales S.A.S.'
  },

  // Los 8 módulos oficiales de empalme Ravell P.H. con su batería de ítems de verificación.
  MODULOS: [
    {
      nombre: '1. Marco Normativo',
      items: [
        'Reglamento de Propiedad Horizontal vigente y actualizado',
        'Certificado de existencia y representación legal vigente',
        'Actas de Asamblea de los últimos 3 años completas y firmadas',
        'Libro de Actas de Asamblea foliado y legalizado',
        'Libro de Actas de Consejo de Administración foliado',
        'Manual de Convivencia vigente y socializado'
      ]
    },
    {
      nombre: '2. Legal',
      items: [
        'Contrato de administración vigente con el administrador saliente',
        'Pólizas de manejo (Consejo, Administrador, Revisor Fiscal) vigentes',
        'Certificaciones de aportes a seguridad social del personal',
        'Contratos de prestación de servicios vigentes (vigilancia, aseo, etc.)',
        'Procesos judiciales o administrativos activos identificados y documentados'
      ]
    },
    {
      nombre: '3. Financiero / Cartera',
      items: [
        'Estados financieros (Balance General y Estado de Resultados) al corte',
        'Presupuesto anual aprobado por Asamblea',
        'Extractos bancarios conciliados de los últimos 3 meses',
        'Informe de cartera por edad de mora (0-30, 30-60, 60-90, +90 días)',
        'Soportes de pago de obligaciones tributarias (Renta, ICA, Retenciones)',
        'Relación de cuentas por pagar a proveedores',
        'Fondo de imprevistos constituido conforme a Ley 675 de 2001'
      ]
    },
    {
      nombre: '4. Técnico',
      items: [
        'Certificado de revisión técnica de ascensores vigente',
        'Certificado RETIE de instalaciones eléctricas comunes',
        'Certificado de revisión de sistemas contra incendios',
        'Mantenimientos preventivos de cubiertas, tanques e impermeabilizaciones al día',
        'Plan de mantenimiento de áreas comunes documentado',
        'Certificado de potabilidad del agua (tanques de almacenamiento)'
      ]
    },
    {
      nombre: '5. Jurídico',
      items: [
        'Poder de representación legal vigente del Administrador',
        'Actas de posesión del Consejo de Administración y Revisor Fiscal',
        'Reglamentos internos (parqueaderos, mascotas, zonas comunes) aprobados',
        'Cobro jurídico de cartera: estado de procesos ejecutivos en curso',
        'Contratos de arrendamiento de bienes comunes vigentes y formalizados'
      ]
    },
    {
      nombre: '6. SG-SST',
      items: [
        'Matriz de identificación de peligros y valoración de riesgos (IPVR)',
        'Plan de emergencias y contingencias actualizado',
        'Brigadas de emergencia conformadas y capacitadas',
        'Exámenes médicos ocupacionales del personal al día',
        'Afiliación a ARL de todo el personal vigente',
        'Reglamento de Higiene y Seguridad Industrial'
      ]
    },
    {
      nombre: '7. Archivo',
      items: [
        'Tablas de Retención Documental (TRD) definidas',
        'Archivo físico organizado por series documentales',
        'Correspondencia recibida y enviada con radicado',
        'Copias de seguridad digitales de documentos críticos',
        'Expedientes de personal completos y actualizados'
      ]
    },
    {
      nombre: '8. Inventario',
      items: [
        'Inventario de bienes muebles e inmuebles de zonas comunes',
        'Inventario de equipos técnicos (bombas, plantas eléctricas, ascensores)',
        'Inventario de dotación de personal operativo',
        'Actas de entrega de llaves, controles y dispositivos de acceso',
        'Registro fotográfico del estado actual de áreas comunes'
      ]
    }
  ]
};
