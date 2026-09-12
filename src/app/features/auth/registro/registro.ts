import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './registro.html',
  styleUrl: './registro.css'
})
export class Registro {
  private authService = inject(AuthService);
  private router = inject(Router);

  credenciales = {
    nombre: '',
    email: '',
    password: ''
  };

  cargando = signal(false);
  errorMensaje = signal('');

  async registrarUsuario() {
    this.errorMensaje.set('');
    this.cargando.set(true);
    try {
      await this.authService.registrarUsuario(
        this.credenciales.email,
        this.credenciales.password,
        this.credenciales.nombre
      );
      alert('¡Registro exitoso! Por favor, inicia sesión.');
      this.router.navigate(['/login']);
    } catch (err: any) {
      this.errorMensaje.set('No se pudo completar el registro. ' + (err?.message ?? ''));
    } finally {
      this.cargando.set(false);
    }
  }
}