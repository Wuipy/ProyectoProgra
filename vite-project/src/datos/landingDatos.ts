export const serviciosDisponibles = [
  {
    titulo: 'Solicitud de nuevo servicio de agua',
    descripcion: 'Inicie tramites para nueva conexion o disponibilidad de agua.',
    accion: 'Solicitar',
    destino: '#solicitar-servicio',
    icono: 'NS',
  },
  {
    titulo: 'Reporte de averias',
    descripcion: 'Informe fugas, baja presion, falta de agua o rupturas.',
    accion: 'Reportar',
    destino: '#reportar-averia',
    icono: 'RA',
  },
  {
    titulo: 'Consulta publica',
    descripcion: 'Revise el estado de una solicitud con su numero de seguimiento.',
    accion: 'Consultar',
    destino: '#consulta-publica',
    icono: 'CP',
  },
  {
    titulo: 'Certificaciones',
    descripcion: 'Acceda a la seccion de certificaciones y tramites comunales.',
    accion: 'Ver tramite',
    destino: '#solicitar-servicio',
    icono: 'CT',
  },
  {
    titulo: 'Informacion de proyectos',
    descripcion: 'Conozca mejoras futuras para la red de distribucion.',
    accion: 'Ver proyectos',
    destino: '#proyectos',
    icono: 'PR',
  },
  {
    titulo: 'Contacto con la ASADA',
    descripcion: 'Encuentre telefono, correo, horario y ubicacion de atencion.',
    accion: 'Contactar',
    destino: '#contacto',
    icono: 'CA',
  },
]

export const comunicados = [
  {
    fecha: '20 mayo 2026',
    titulo: 'Aviso de mantenimiento programado',
    descripcion: 'Revision preventiva de valvulas y lineas principales durante la manana.',
    estado: 'Programado',
  },
  {
    fecha: '18 mayo 2026',
    titulo: 'Interrupcion temporal del servicio',
    descripcion: 'Corte temporal por reparacion de tuberia en el sector central.',
    estado: 'Informativo',
  },
  {
    fecha: '15 mayo 2026',
    titulo: 'Uso responsable del agua',
    descripcion: 'Se recomienda evitar desperdicios y reportar fugas visibles oportunamente.',
    estado: 'Recomendacion',
  },
]

export const proyectosFuturos = [
  {
    titulo: 'Mejora de redes de distribucion',
    descripcion: 'Sustitucion progresiva de tuberias antiguas en sectores prioritarios.',
    estado: 'Planificado',
  },
  {
    titulo: 'Nuevos tanques de almacenamiento',
    descripcion: 'Evaluacion tecnica para aumentar la capacidad de reserva comunal.',
    estado: 'En estudio',
  },
  {
    titulo: 'Colocacion de hidrantes',
    descripcion: 'Instalacion en puntos estrategicos para fortalecer la respuesta local.',
    estado: 'Gestion',
  },
  {
    titulo: 'Expansion y mejora del acueducto',
    descripcion: 'Analisis de crecimiento de demanda y futuras ampliaciones del sistema.',
    estado: 'Futuro',
  },
]
