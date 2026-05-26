import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table'

const estados = ['Pendiente', 'En revision', 'Resuelta']

const confirmarEliminacion = (reporte, onEliminar) => {
  const confirmado = window.confirm(`Deseas eliminar el reporte ${reporte.id}?`)

  if (confirmado) {
    onEliminar(reporte.id)
  }
}

export function ReporteAveriasTable({
  filtroGlobal = '',
  onCambiarEstado,
  onEditar,
  onEliminar,
  reportes,
}) {
  const columnas = [
    {
      accessorKey: 'id',
      header: 'Numero',
    },
    {
      accessorKey: 'nombre',
      header: 'Nombre',
      cell: ({ row }) => (
        <>
          <strong>{row.original.nombre}</strong>
          <span>{row.original.telefono}</span>
        </>
      ),
    },
    {
      accessorKey: 'tipo',
      header: 'Tipo',
      cell: ({ row }) => (
        <>
          <strong>{row.original.tipo}</strong>
          <span>{row.original.descripcion}</span>
        </>
      ),
    },
    {
      accessorKey: 'prioridad',
      header: 'Prioridad',
      cell: ({ row }) => (
        <span className={`prioridad prioridad--${(row.original.prioridad ?? 'Media').toLowerCase()}`}>
          {row.original.prioridad ?? 'Media'}
        </span>
      ),
    },
    {
      accessorKey: 'estado',
      header: 'Estado',
      cell: ({ row }) => (
        <select
          aria-label={`Estado de ${row.original.id}`}
          onChange={(evento) => onCambiarEstado(row.original.id, evento.target.value)}
          value={row.original.estado}
        >
          {estados.map((estado) => (
            <option key={estado}>{estado}</option>
          ))}
        </select>
      ),
    },
    {
      accessorKey: 'fecha',
      header: 'Fecha',
    },
    {
      id: 'acciones',
      header: 'Acciones',
      cell: ({ row }) => (
        <div className="reporte-tabla__acciones">
          <button type="button" onClick={() => onEditar(row.original)}>
            Editar
          </button>
          <button type="button" onClick={() => confirmarEliminacion(row.original, onEliminar)}>
            Eliminar
          </button>
        </div>
      ),
    },
  ]

  const tabla = useReactTable({
    columns: columnas,
    data: reportes,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: 'includesString',
    state: {
      globalFilter: filtroGlobal,
    },
  })

  const filas = tabla.getRowModel().rows

  return (
    <div className="reporte-tabla-contenedor">
      {filas.length === 0 && (
        <p className="reporte-tabla-vacia">No hay reportes que coincidan con la busqueda.</p>
      )}

      <table className="reporte-tabla">
        <thead>
          {tabla.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {filas.map((fila) => (
            <tr key={fila.id}>
              {fila.getVisibleCells().map((celda) => (
                <td key={celda.id}>
                  {flexRender(celda.column.columnDef.cell, celda.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
