export type ModuloInterno = {
  id: string
  titulo: string
  ruta: string
  descripcion: string
  disponible: boolean
  /** Agrupa entradas del menu admin (p. ej. supervision vs gestion interna). */
  seccion?: string
}



export const MODULOS_ADMIN: ModuloInterno[] = [

  {

    id: 'abonados',

    titulo: 'Gestion de abonados',

    ruta: '/admin/abonados',

    descripcion: 'Consulta y administracion de abonados del acueducto.',

    disponible: false,

  },

  {

    id: 'solicitudes',

    titulo: 'Solicitudes de servicio',

    ruta: '/admin/solicitudes',

    descripcion: 'Revision y seguimiento de solicitudes enviadas por la comunidad.',

    disponible: false,

  },

  {
    id: 'averias',
    titulo: 'Gestion de averias',
    ruta: '/admin/averias',
    descripcion: 'Supervision de reportes AV, asignaciones y estados de atencion.',
    disponible: true,
    seccion: 'Supervision de campo',
  },
  {
    id: 'actividades-fontanero',
    titulo: 'Actividades de campo',
    ruta: '/admin/actividades-fontanero',
    descripcion: 'Revise y valide las actividades registradas por el fontanero en terreno.',
    disponible: true,
    seccion: 'Supervision de campo',
  },
  {
    id: 'lecturas-medidores',
    titulo: 'Lecturas de medidores',
    ruta: '/admin/lecturas-medidores',
    descripcion: 'Consulta de lecturas registradas por el fontanero, inconsistencias e historial.',
    disponible: true,
    seccion: 'Supervision de campo',
  },
  {
    id: 'proyectos',
    titulo: 'Gestion de proyectos',
    ruta: '/admin/proyectos',
    descripcion: 'Administracion de proyectos comunitarios publicados.',
    disponible: false,
  },

  {

    id: 'inventario',

    titulo: 'Gestion de inventario',

    ruta: '/admin/inventario',

    descripcion: 'Control de materiales, repuestos y existencias.',

    disponible: false,

  },

  {

    id: 'reportes',

    titulo: 'Reportes',

    ruta: '/admin/reportes',

    descripcion: 'Indicadores y reportes generales del sistema.',

    disponible: false,

  },

  {

    id: 'usuarios',

    titulo: 'Usuarios y roles',

    ruta: '/admin/usuarios',

    descripcion: 'Administracion de cuentas internas y permisos.',

    disponible: false,

  },

]



export const MODULOS_FONTANERO: ModuloInterno[] = [

  {

    id: 'averias',

    titulo: 'Averias asignadas',

    ruta: '/fontanero/averias-asignadas',

    descripcion: 'Reportes asignados por la administradora.',

    disponible: true,

  },

  {

    id: 'actividades',

    titulo: 'Actividades de campo',

    ruta: '/fontanero/actividades',

    descripcion: 'Registro de actividades realizadas en terreno.',

    disponible: true,

  },

  {

    id: 'lecturas',

    titulo: 'Lecturas de medidores',

    ruta: '/fontanero/lecturas-medidores',

    descripcion: 'Registro de lecturas y calculo de consumo.',

    disponible: true,

  },

  {

    id: 'materiales',

    titulo: 'Materiales utilizados',

    ruta: '/fontanero/materiales',

    descripcion: 'Salidas de materiales y consumo por trabajo.',

    disponible: false,

  },

  {

    id: 'trabajos',

    titulo: 'Estado de trabajos',

    ruta: '/fontanero/trabajos',

    descripcion: 'Resumen del avance de trabajos realizados.',

    disponible: false,

  },

]


