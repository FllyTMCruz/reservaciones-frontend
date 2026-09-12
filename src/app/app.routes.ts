import { Routes } from '@angular/router';
import { roleGuard } from './core/guards/role-guard';

// Importamos los componentes que acabas de crear
import { Espacios } from './features/espacios/espacios';
import { Administracion } from './features/administracion/administracion';
import { Calendario } from './features/calendario/calendario';
import { Login } from './features/auth/login/login';
import { Registro } from './features/auth/registro/registro';
export const routes: Routes = [
  {
    path: 'calendario',
    component: Calendario
    // Aquí podrías agregar un guard para validar que solo usuarios logueados entren
  },
  {
    path: 'espacios',
    component: Espacios
    // La consulta de espacios está abierta a cualquier usuario autenticado
  },
  {
    path: 'administracion',
    component: Administracion,
    canActivate: [roleGuard], // <-- ¡Aquí entra en acción tu Guard!
    data: { rolesPermitidos: ['Administración'] } // Solo este rol puede entrar
  },
  {
  path: 'login',
  component: Login
},
{
  path: 'registro',
  component: Registro
},
  {
    // Ruta por defecto: Si el usuario entra a la raíz, lo mandamos al calendario
    path: '',
    redirectTo: 'calendario',
    pathMatch: 'full'
  }
  
];