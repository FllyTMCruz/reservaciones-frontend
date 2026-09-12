import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { from, map } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return from(authService.estaAutenticado()).pipe(
    map(autenticado => {
      if (autenticado) return true;
      router.navigate(['/login']);
      return false;
    })
  );
};
