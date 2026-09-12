import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { EspaciosService } from '../../core/services/espacios.service';
import { Espacio } from '../../core/models/espacio.model';

@Component({
  selector: 'app-espacios',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
  mensajeExito = signal('');

  // --- Formulario de creación / edición ---
  mostrarFormulario = signal(false);
  modoEdicion = signal(false);
  guardando = signal(false);
  errorFormulario = signal('');

  formulario = {
    idEspacioEditando: null as number | null,
    nombre_espacio: '',
    capacidad_maxima: 1
  };

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

  abrirCreacion() {
    this.modoEdicion.set(false);
    this.errorFormulario.set('');
    this.formulario = { idEspacioEditando: null, nombre_espacio: '', capacidad_maxima: 1 };
    this.mostrarFormulario.set(true);
  }

  abrirEdicion(espacio: Espacio) {
    this.modoEdicion.set(true);
    this.errorFormulario.set('');
    this.formulario = {
      idEspacioEditando: espacio.id_espacio,
      nombre_espacio: espacio.nombre_espacio,
      capacidad_maxima: espacio.capacidad_maxima
    };
    this.mostrarFormulario.set(true);
  }

  cerrarFormulario() {
    this.mostrarFormulario.set(false);
    this.errorFormulario.set('');
  }

  guardarEspacio() {
    this.errorFormulario.set('');

    if (!this.formulario.nombre_espacio.trim()) {
      this.errorFormulario.set('El nombre del espacio es obligatorio.');
      return;
    }
    if (this.formulario.capacidad_maxima < 1 || this.formulario.capacidad_maxima > 300) {
      this.errorFormulario.set('La capacidad máxima debe estar entre 1 y 300.');
      return;
    }

    const payload = {
      nombre_espacio: this.formulario.nombre_espacio.trim(),
      capacidad_maxima: this.formulario.capacidad_maxima
    };

    this.guardando.set(true);

    const peticion = this.modoEdicion() && this.formulario.idEspacioEditando
      ? this.espaciosService.actualizar(this.formulario.idEspacioEditando, payload)
      : this.espaciosService.crear(payload);

    peticion.subscribe({
      next: () => {
        this.guardando.set(false);
        this.mostrarFormulario.set(false);
        this.mensajeExito.set(this.modoEdicion() ? 'Espacio actualizado.' : 'Espacio creado.');
        this.cargarEspacios();
        setTimeout(() => this.mensajeExito.set(''), 4000);
      },
      error: () => {
        this.guardando.set(false);
        this.errorFormulario.set('No se pudo guardar el espacio.');
      }
    });
  }

  eliminarEspacio(espacio: Espacio) {
    if (!confirm(`¿Seguro que quieres eliminar "${espacio.nombre_espacio}"?`)) return;

    this.espaciosService.eliminar(espacio.id_espacio).subscribe({
      next: () => {
        this.mensajeExito.set('Espacio eliminado.');
        this.cargarEspacios();
        setTimeout(() => this.mensajeExito.set(''), 4000);
      },
      error: (err) => {
        if (err?.status === 409) {
          this.errorMensaje.set('No se puede eliminar: el espacio tiene reservaciones asociadas.');
        } else {
          this.errorMensaje.set('No se pudo eliminar el espacio.');
        }
        setTimeout(() => this.errorMensaje.set(''), 5000);
      }
    });
  }
}
