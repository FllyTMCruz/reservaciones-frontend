import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuariosService } from '../../core/services/usuarios.service';
import { Usuario, RolUsuario } from '../../core/models/usuario.model';

@Component({
  selector: 'app-administracion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './administracion.html',
  styleUrl: './administracion.css'
})
export class Administracion implements OnInit {
  private usuariosService = inject(UsuariosService);

  usuarios = signal<Usuario[]>([]);
  cargando = signal(true);
  errorMensaje = signal('');

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.cargando.set(true);
    this.errorMensaje.set('');
    this.usuariosService.listar().subscribe({
      next: (data) => {
        this.usuarios.set(data);
        this.cargando.set(false);
      },
      error: () => {
        this.errorMensaje.set('No se pudo cargar la lista de usuarios.');
        this.cargando.set(false);
      }
    });
  }

  cambiarRol(idUsuario: string, nuevoRol: string) {
    this.usuariosService.cambiarRol(idUsuario, nuevoRol as RolUsuario).subscribe({
      next: (usuarioActualizado) => {
        this.usuarios.update(lista =>
          lista.map(u => (u.id_usuario === idUsuario ? usuarioActualizado : u))
        );
      },
      error: () => alert('No se pudo actualizar el rol.')
    });
  }
}