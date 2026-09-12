import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './registro.html', // Verifica que el nombre coincida con tu archivo
  styleUrl: './registro.css'
})
export class Registro {
  private authService = inject(AuthService);
  private router = inject(Router);

  // Objeto para guardar los datos del nuevo usuario
  credenciales = {
    nombre: '',
    email: '',
    password: ''
  };

  async registrarUsuario() {
    console.log('Registrando nuevo usuario con:', this.credenciales);
    // Aquí conectaremos la creación de usuario real en Supabase más adelante.
    // Por ahora, simulamos un registro exitoso y lo mandamos al login:
    alert('¡Registro exitoso! Por favor, inicia sesión.');
    this.router.navigate(['/login']);
  }
}