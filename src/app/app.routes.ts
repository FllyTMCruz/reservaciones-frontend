import { Routes } from '@angular/router';
import { roleGuard } from './core/guards/role-guard';
import { authGuard } from './core/guards/auth-guard';
import { Espacios } from './features/espacios/espacios';
import { Administracion } from './features/administracion/administracion';
import { Calendario } from './features/calendario/calendario';
import { Login } from './features/auth/login/login';
import { Registro } from './features/auth/registro/registro';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
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
    path: 'calendario',
    component: Calendario,
    canActivate: [authGuard]
  },
  {
    path: 'espacios',
    component: Espacios
  },
  {
    path: 'administracion',
    component: Administracion,
    canActivate: [roleGuard],
    data: { rolesPermitidos: ['Administración'] }
  }
];