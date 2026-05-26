using Microsoft.AspNetCore.Mvc;
using ProyectoPrograApi.Models;

namespace ProyectoPrograApi.Controllers;

[ApiController]
[Route("api/reportes-averias")]
public class ReportesAveriasController : ControllerBase
{
    private static readonly List<ReporteAveria> Reportes =
    [
        new()
        {
            Id = "AV-0001",
            Nombre = "Carlos Ramirez",
            Telefono = "8888-1122",
            Direccion = "Barrio Central, San Jose",
            Tipo = "Fuga de agua",
            Prioridad = "Alta",
            Descripcion = "Fuga visible cerca del medidor principal.",
            Estado = "Pendiente",
            Fecha = new DateOnly(2026, 5, 25),
        },
        new()
        {
            Id = "AV-0002",
            Nombre = "Maria Lopez",
            Telefono = "8888-3344",
            Direccion = "Residencial Las Flores",
            Tipo = "Baja presion",
            Prioridad = "Media",
            Descripcion = "La presion baja durante la manana.",
            Estado = "En revision",
            Fecha = new DateOnly(2026, 5, 25),
        },
    ];

    [HttpGet]
    public ActionResult<IEnumerable<ReporteAveria>> ObtenerReportes()
    {
        return Ok(Reportes.OrderByDescending(reporte => reporte.Fecha).ThenBy(reporte => reporte.Id));
    }

    [HttpGet("{id}")]
    public ActionResult<ReporteAveria> ObtenerReporte(string id)
    {
        var reporte = Reportes.FirstOrDefault(item => item.Id.Equals(id, StringComparison.OrdinalIgnoreCase));

        return reporte is null ? NotFound() : Ok(reporte);
    }

    [HttpPost]
    public ActionResult<ReporteAveria> CrearReporte(ReporteAveriaRequest request)
    {
        var reporte = new ReporteAveria
        {
            Id = CrearId(),
            Nombre = request.Nombre,
            Telefono = request.Telefono,
            Direccion = request.Direccion,
            Tipo = request.Tipo,
            Prioridad = string.IsNullOrWhiteSpace(request.Prioridad) ? "Media" : request.Prioridad,
            Descripcion = request.Descripcion,
            Estado = string.IsNullOrWhiteSpace(request.Estado) ? "Pendiente" : request.Estado,
            Fecha = DateOnly.FromDateTime(DateTime.Today),
        };

        Reportes.Insert(0, reporte);

        return CreatedAtAction(nameof(ObtenerReporte), new { id = reporte.Id }, reporte);
    }

    [HttpPut("{id}")]
    public ActionResult<ReporteAveria> ActualizarReporte(string id, ReporteAveriaRequest request)
    {
        var reporte = Reportes.FirstOrDefault(item => item.Id.Equals(id, StringComparison.OrdinalIgnoreCase));

        if (reporte is null)
        {
            return NotFound();
        }

        reporte.Nombre = request.Nombre;
        reporte.Telefono = request.Telefono;
        reporte.Direccion = request.Direccion;
        reporte.Tipo = request.Tipo;
        reporte.Prioridad = string.IsNullOrWhiteSpace(request.Prioridad) ? reporte.Prioridad : request.Prioridad;
        reporte.Descripcion = request.Descripcion;
        reporte.Estado = string.IsNullOrWhiteSpace(request.Estado) ? reporte.Estado : request.Estado;

        return Ok(reporte);
    }

    [HttpDelete("{id}")]
    public IActionResult EliminarReporte(string id)
    {
        var reporte = Reportes.FirstOrDefault(item => item.Id.Equals(id, StringComparison.OrdinalIgnoreCase));

        if (reporte is null)
        {
            return NotFound();
        }

        Reportes.Remove(reporte);

        return NoContent();
    }

    private static string CrearId()
    {
        var siguiente = Reportes.Count + 1;
        return $"AV-{siguiente.ToString().PadLeft(4, '0')}";
    }
}
