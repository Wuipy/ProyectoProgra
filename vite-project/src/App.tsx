import { PaginaAdminPlomeria } from './paginas/PaginaAdminPlomeria'
import { PaginaInicio } from './paginas/PaginaInicio'
import { PaginaLoginAdmin } from './paginas/PaginaLoginAdmin'
import { tieneSesionAdmin } from './servicios/authAdmin'
import './App.css'

function App() {
  if (window.location.pathname === '/login') {
    return <PaginaLoginAdmin />
  }

  if (window.location.pathname === '/admin/plomeria') {
    if (!tieneSesionAdmin()) {
      window.history.replaceState(null, '', '/login')
      return <PaginaLoginAdmin />
    }

    return <PaginaAdminPlomeria />
  }

  return <PaginaInicio />
}

export default App
