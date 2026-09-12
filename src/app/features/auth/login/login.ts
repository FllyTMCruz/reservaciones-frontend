import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // <-- Necesario para capturar los inputs
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

  // Objeto para guardar lo que el usuario escriba
  credenciales = {
    email: '',
    password: ''
  };

  async iniciarSesion() {
    console.log('Intentando iniciar sesión con:', this.credenciales);
    // Aquí conectaremos la función real de FastAPI/Supabase más adelante.
    // Por ahora, simulamos un inicio de sesión exitoso y lo mandamos al calendario:
    this.router.navigate(['/calendario']);
  }
}
