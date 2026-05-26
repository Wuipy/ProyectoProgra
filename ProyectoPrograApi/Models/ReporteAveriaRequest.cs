namespace ProyectoPrograApi.Models;

public class ReporteAveriaRequest
{
    public string Nombre { get; set; } = string.Empty;
    public string Telefono { get; set; } = string.Empty;
    public string Direccion { get; set; } = string.Empty;
    public string Tipo { get; set; } = string.Empty;
    public string Prioridad { get; set; } = "Media";
    public string Descripcion { get; set; } = string.Empty;
    public string? Estado { get; set; }
}
