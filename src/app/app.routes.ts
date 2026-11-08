import { Routes } from '@angular/router';
import { roleGuard } from './core/guards/role-guard';
import { authGuard } from './core/guards/auth-guard';
import { Espacios } from './features/espacios/espacios';
import { Administracion } from './features/administracion/administracion';
import { Calendario } from './features/calendario/calendario';
import { Login } from './features/auth/login/login';
import { Registro } from './features/auth/registro/registro';
import { Perfil } from './features/perfil/perfil';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'calendario',
    pathMatch: 'full'
  },
  {
    path: 'calendario',
    component: Calendario
  },
  {
    path: 'espacios',
    component: Espacios
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
    path: 'perfil',
    component: Perfil,
    canActivate: [authGuard]
  },
  {
    path: 'administracion',
    component: Administracion,
    canActivate: [roleGuard],
    data: { rolesPermitidos: ['Administración'] }
  }
];
