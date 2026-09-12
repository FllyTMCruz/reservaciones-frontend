import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { from, map } from 'rxjs';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  // Obtenemos la lista de roles que tienen permiso para entrar a esta vista
  const rolesPermitidos = route.data['rolesPermitidos'] as Array<string>;

  // Convertimos la promesa a un Observable para que Angular lo procese
  return from(authService.getRolActual()).pipe(
    map(rolActual => {
      // Si el rol del usuario está incluido en la lista de permitidos, pasa.
      if (rolesPermitidos && rolesPermitidos.includes(rolActual)) {
        return true;
      }
      
      // Si no tiene el rol correcto, lo pateamos a la página principal
      router.navigate(['/']);
      return false;
    })
  );
};