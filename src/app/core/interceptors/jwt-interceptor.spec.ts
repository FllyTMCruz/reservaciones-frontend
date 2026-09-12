import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { from, switchMap } from 'rxjs';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  // Inyectamos nuestro servicio de autenticación
  const authService = inject(AuthService);

  // Convertimos la promesa de Supabase a un Observable de Angular
  return from(authService.getToken()).pipe(
    switchMap(token => {
      // Si existe un token, clonamos la petición y agregamos la cabecera
      if (token) {
        const reqClonada = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
        return next(reqClonada); // Enviamos la petición modificada
      }
      
      // Si no hay token (ej. usuario no logueado), enviamos la petición tal cual
      return next(req); 
    })
  );
};