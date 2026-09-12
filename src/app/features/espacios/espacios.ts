import { Component, OnInit, inject } from '@angular/core';
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

  rolUsuario = '';
  puedeEditar = false;
  listaEspacios: Espacio[] = [];
  cargando = true;
  errorMensaje = '';

  async ngOnInit() {
    this.rolUsuario = await this.authService.getRolActual();
    this.puedeEditar = this.rolUsuario === 'Administración' || this.rolUsuario === 'Coordinador';
    this.cargarEspacios();
  }

  cargarEspacios() {
    this.cargando = true;
    this.errorMensaje = '';
    this.espaciosService.listar().subscribe({
      next: (data) => {
        this.listaEspacios = data;
        this.cargando = false;
      },
      error: () => {
        this.errorMensaje = 'No se pudieron cargar los espacios.';
        this.cargando = false;
      }
    });
  }
}