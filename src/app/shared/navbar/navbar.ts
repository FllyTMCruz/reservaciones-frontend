import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // <-- ¡Crucial para usar routerLink!
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule], 
  templateUrl: './navbar.html', // Recuerda ajustar si tu archivo dice .component.html
  styleUrl: './navbar.css'
})
export class Navbar implements OnInit {
  private authService = inject(AuthService);
  rolUsuario: string = '';

  async ngOnInit() {
    // Leemos el rol para saber qué pestañas mostrar
    this.rolUsuario = await this.authService.getRolActual();
  }
}