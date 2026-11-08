import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';
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

  estaAutenticado = signal(false);
  rolUsuario = signal('');

  async ngOnInit() {
    await this.actualizarEstadoAuth();

    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(() => {
        this.actualizarEstadoAuth();
      });
  }

  async actualizarEstadoAuth() {
    const auth = await this.authService.estaAutenticado();
    this.estaAutenticado.set(auth);
    if (auth) {
      const rol = await this.authService.getRolActual();
      this.rolUsuario.set(rol);
    } else {
      this.rolUsuario.set('');
    }
  }

  async cerrarSesion() {
    await this.authService.cerrarSesion();
    await this.actualizarEstadoAuth();
    this.router.navigate(['/calendario']);
  }
}
