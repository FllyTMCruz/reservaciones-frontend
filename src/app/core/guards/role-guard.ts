import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { from, switchMap, map } from 'rxjs';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Obtenemos la lista de roles que tienen permiso para entrar a esta vista
  const rolesPermitidos = route.data['rolesPermitidos'] as Array<string>;

  // Primero confirmamos que haya sesión. Sin esto, "sin sesión" y "rol
  // incorrecto" se trataban igual, porque getRolActual() devuelve
  // 'Cliente' por defecto cuando no hay usuario logueado.
  return from(authService.estaAutenticado()).pipe(
    switchMap(autenticado => {
      if (!autenticado) {
        router.navigate(['/login']);
        return from(Promise.resolve('__sin_sesion__'));
      }
      return from(authService.getRolActual());
    }),
    map(rolActual => {
      if (rolActual === '__sin_sesion__') {
        return false;
      }

      // Si el rol del usuario está incluido en la lista de permitidos, pasa.
      if (rolesPermitidos && rolesPermitidos.includes(rolActual)) {
        return true;
      }

      // Está autenticado pero con un rol que no aplica a esta vista.
      router.navigate(['/']);
      return false;
    })
  );
};
