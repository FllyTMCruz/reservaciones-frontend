import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment';
import { Usuario, RolUsuario } from '../models/usuario.model';

@Injectable({ providedIn: 'root' })
export class UsuariosService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/usuarios`;

  listar(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.baseUrl}/`);
  }

  cambiarRol(idUsuario: string, rol: RolUsuario): Observable<Usuario> {
    return this.http.patch<Usuario>(`${this.baseUrl}/${idUsuario}/rol`, { rol });
  }
}