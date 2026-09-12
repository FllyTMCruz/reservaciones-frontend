import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment';
import { EventoReservacion } from '../models/evento.model';

@Injectable({ providedIn: 'root' })
export class EventosService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/eventos`;

  listar(): Observable<EventoReservacion[]> {
    return this.http.get<EventoReservacion[]>(`${this.baseUrl}/`);
  }

  crear(data: {
    id_espacio: number;
    fecha_inicio: string;
    fecha_fin: string;
    tipo_evento: string;
    invitados_estimados: number;
  }): Observable<EventoReservacion> {
    return this.http.post<EventoReservacion>(`${this.baseUrl}/`, data);
  }
}