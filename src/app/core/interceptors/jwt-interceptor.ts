import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { from, switchMap } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  // Solo adjuntamos el token en las llamadas a NUESTRA API,
  // no en las llamadas que Supabase haga por su cuenta.
  return from(authService.getToken()).pipe(
    switchMap(token => {
      if (token) {
        const clonado = req.clone({
          setHeaders: { Authorization: `Bearer ${token}` }
        });
        return next(clonado);
      }
      return next(req);
    })
  );
};