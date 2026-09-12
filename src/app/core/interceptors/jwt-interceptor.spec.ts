import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import {
  HttpClient,
  provideHttpClient,
  withInterceptors
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';
import { AuthService } from '../services/auth.service';
import { jwtInterceptor } from './jwt-interceptor';

describe('jwtInterceptor', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;

  function configurar(token: string | null) {
    const authServiceMock = {
      getToken: vi.fn().mockResolvedValue(token)
    };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([jwtInterceptor])),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: authServiceMock }
      ]
    });

    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  }

  afterEach(() => {
    httpMock.verify();
  });

  it('agrega el header Authorization cuando hay token', async () => {
    configurar('token-de-prueba');

    httpClient.get('/api/eventos').subscribe();

    // El interceptor resuelve authService.getToken() de forma asíncrona
    // (es una Promise), así que dejamos que el microtask se procese antes
    // de que la petición llegue al backend simulado.
    await Promise.resolve();
    await Promise.resolve();

    const peticion = httpMock.expectOne('/api/eventos');
    expect(peticion.request.headers.get('Authorization')).toBe('Bearer token-de-prueba');
    peticion.flush({});
  });

  it('no agrega el header Authorization cuando no hay sesión', async () => {
    configurar(null);

    httpClient.get('/api/eventos').subscribe();

    await Promise.resolve();
    await Promise.resolve();

    const peticion = httpMock.expectOne('/api/eventos');
    expect(peticion.request.headers.has('Authorization')).toBeFalsy();
    peticion.flush({});
  });
});
