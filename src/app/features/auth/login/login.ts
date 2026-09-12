import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);

  // credenciales se queda como objeto normal: [(ngModel)] SÍ notifica a Angular
  // automáticamente incluso sin zone.js.
  credenciales = {
    email: '',
    password: ''
  };

  cargando = signal(false);
  errorMensaje = signal('');

  async iniciarSesion() {
    this.errorMensaje.set('');
    this.cargando.set(true);
    try {
      await this.authService.iniciarSesion(this.credenciales.email, this.credenciales.password);
      this.router.navigate(['/calendario']);
    } catch (err: any) {
      this.errorMensaje.set('Correo o contraseña incorrectos.');
    } finally {
      this.cargando.set(false);
    }
  }
}