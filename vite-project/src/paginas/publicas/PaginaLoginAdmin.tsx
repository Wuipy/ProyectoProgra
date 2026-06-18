import logoAsada from '../../assets/logo-asada.svg'
import {
  iniciarSesionAdmin,
  obtenerRutaInicioSesion,
  tieneSesionActiva,
} from '../../lib/auth'
import { FormEvent, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export function PaginaLoginAdmin() {
  const navigate = useNavigate()
  const [usuario, setUsuario] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)

  useEffect(() => {
    if (tieneSesionActiva()) {
      navigate(obtenerRutaInicioSesion(), { replace: true })
    }
  }, [navigate])

  const enviarLogin = async (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault()
    setError('')
    setEnviando(true)

    const sesionValida = await iniciarSesionAdmin(usuario, contrasena)
    setEnviando(false)

    if (!sesionValida) {
      setError('Usuario o contrasena incorrectos.')
      return
    }

    navigate(obtenerRutaInicioSesion())
  }

  return (
    <main className="pagina-login-admin">
      <section className="login-admin-panel" aria-labelledby="titulo-login-admin">
        <div className="login-admin-marca">
          <Link className="marca" to="/" aria-label="Volver al inicio de SIGASJ">
            <img src={logoAsada} alt="Logo ASADA San Juan" />
            <span className="marca-copy">
              <strong>SIGASJ</strong>
              <small>ASADA San Juan de Santa Cruz</small>
            </span>
          </Link>
        </div>

        <div className="login-admin-copy">
          <p className="etiqueta">Acceso al sistema</p>
          <h1 id="titulo-login-admin">Iniciar sesion</h1>
          <p>Ingrese sus credenciales para acceder al sistema operativo de la ASADA.</p>
        </div>

        <form className="login-admin-formulario" onSubmit={enviarLogin} noValidate>
          <label className="campo">
            <span>Usuario</span>
            <input
              autoComplete="username"
              value={usuario}
              onChange={(evento) => setUsuario(evento.target.value)}
              placeholder="admin"
            />
          </label>

          <label className="campo">
            <span>Contrasena</span>
            <input
              autoComplete="current-password"
              type="password"
              value={contrasena}
              onChange={(evento) => setContrasena(evento.target.value)}
              placeholder="admin1234"
            />
          </label>

          {error && (
            <div className="login-admin-error" role="alert">
              {error}
            </div>
          )}

          <button className="boton-login-admin" type="submit" disabled={enviando}>
            {enviando ? 'Validando...' : 'Iniciar sesion'}
          </button>
        </form>

        <Link className="login-admin-volver" to="/">
          Volver al portal publico
        </Link>
      </section>
    </main>
  )
}
