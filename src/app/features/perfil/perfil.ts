import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuariosService } from '../../core/services/usuarios.service';
import { Usuario } from '../../core/models/usuario.model';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css'
})
export class Perfil implements OnInit {
  private usuariosService = inject(UsuariosService);

  usuario = signal<Usuario | null>(null);
  nombreEditable = '';
  cargando = signal(true);
  guardando = signal(false);
  errorMensaje = signal('');
  mensajeExito = signal('');

  ngOnInit() {
    this.cargarPerfil();
  }

  cargarPerfil() {
    this.cargando.set(true);
    this.errorMensaje.set('');
    this.usuariosService.obtenerMiPerfil().subscribe({
      next: (data) => {
        this.usuario.set(data);
        this.nombreEditable = data.nombre;
        this.cargando.set(false);
      },
      error: () => {
        this.errorMensaje.set('No se pudo cargar tu perfil.');
        this.cargando.set(false);
      }
    });
  }

  guardarNombre() {
    if (!this.nombreEditable.trim()) {
      this.errorMensaje.set('El nombre no puede estar vacío.');
      return;
    }

    this.guardando.set(true);
    this.errorMensaje.set('');
    this.usuariosService.actualizarMiPerfil(this.nombreEditable.trim()).subscribe({
      next: (actualizado) => {
        this.usuario.set(actualizado);
        this.guardando.set(false);
        this.mensajeExito.set('Perfil actualizado.');
        setTimeout(() => this.mensajeExito.set(''), 4000);
      },
      error: () => {
        this.guardando.set(false);
        this.errorMensaje.set('No se pudo actualizar tu perfil.');
      }
    });
  }
}
