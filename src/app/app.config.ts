import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
// Importamos las herramientas HTTP y nuestro interceptor
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { jwtInterceptor } from './core/interceptors/jwt-interceptor';


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    // Registramos el interceptor globalmente
    provideHttpClient(withInterceptors([jwtInterceptor]))
  ]
};