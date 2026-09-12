import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { EspaciosService } from '../../core/services/espacios.service';
import { Espacio } from '../../core/models/espacio.model';

@Component({
  selector: 'app-espacios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './espacios.html',
  styleUrl: './espacios.css'
})
export class Espacios implements OnInit {
  private authService = inject(AuthService);
  private espaciosService = inject(EspaciosService);

  rolUsuario = signal('');
  puedeEditar = signal(false);
  listaEspacios = signal<Espacio[]>([]);
  cargando = signal(true);
  errorMensaje = signal('');

  async ngOnInit() {
    const rol = await this.authService.getRolActual();
    this.rolUsuario.set(rol);
    this.puedeEditar.set(rol === 'Administración' || rol === 'Coordinador');
    this.cargarEspacios();
  }

  cargarEspacios() {
    this.cargando.set(true);
    this.errorMensaje.set('');
    this.espaciosService.listar().subscribe({
      next: (data) => {
        this.listaEspacios.set(data);
        this.cargando.set(false);
      },
      error: () => {
        this.errorMensaje.set('No se pudieron cargar los espacios.');
        this.cargando.set(false);
      }
    });
  }
}
