import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  rolUsuario: string = '';

  async ngOnInit() {
    // Leemos el rol para saber qué pestañas mostrar
    this.rolUsuario = await this.authService.getRolActual();
  }

  async cerrarSesion() {
    await this.authService.cerrarSesion();
    this.router.navigate(['/login']);
  }
}
