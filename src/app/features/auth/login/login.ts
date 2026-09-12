import { Component, inject } from '@angular/core';
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

  credenciales = {
    email: '',
    password: ''
  };

  cargando = false;
  errorMensaje = '';

  async iniciarSesion() {
    this.errorMensaje = '';
    this.cargando = true;
    try {
      await this.authService.iniciarSesion(this.credenciales.email, this.credenciales.password);
      this.router.navigate(['/calendario']);
    } catch (err: any) {
      this.errorMensaje = 'Correo o contraseña incorrectos.';
    } finally {
      this.cargando = false;
    }
  }
}