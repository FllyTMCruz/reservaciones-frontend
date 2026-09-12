import { Component, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';
// Importa el Navbar (asegúrate de que la ruta sea correcta)
import { Navbar } from './shared/navbar/navbar';

const RUTAS_SIN_NAVBAR = ['/login', '/registro'];

@Component({
  imports: [CommonModule, RouterOutlet, Navbar],
  standalone: true,
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('reservaciones-frontend');
  protected readonly mostrarNavbar = signal(true);

  constructor(private router: Router) {
    this.mostrarNavbar.set(!RUTAS_SIN_NAVBAR.includes(this.router.url));

    this.router.events
      .pipe(filter((evento): evento is NavigationEnd => evento instanceof NavigationEnd))
      .subscribe((evento) => {
        this.mostrarNavbar.set(!RUTAS_SIN_NAVBAR.includes(evento.urlAfterRedirects));
      });
  }
}
