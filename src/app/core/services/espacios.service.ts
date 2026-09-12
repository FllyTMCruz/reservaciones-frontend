import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment';
import { Espacio } from '../models/espacio.model';

@Injectable({ providedIn: 'root' })
export class EspaciosService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/espacios`;

  listar(): Observable<Espacio[]> {
    return this.http.get<Espacio[]>(`${this.baseUrl}/`);
  }

  crear(data: { nombre_espacio: string; capacidad_maxima: number }): Observable<Espacio> {
    return this.http.post<Espacio>(`${this.baseUrl}/`, data);
  }

  eliminar(idEspacio: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${idEspacio}`);
  }
}