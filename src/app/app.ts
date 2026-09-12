import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// Importa el Navbar (asegúrate de que la ruta sea correcta)
import { Navbar } from './shared/navbar/navbar';
@Component({
  imports: [RouterOutlet, Navbar],
  standalone: true,
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('reservaciones-frontend');
}
