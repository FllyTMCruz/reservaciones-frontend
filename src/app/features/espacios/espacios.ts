import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necesario para usar *ngIf y *ngFor
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-espacios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './espacios.html',
  styleUrl: './espacios.css'
})
export class Espacios implements OnInit {
  private authService = inject(AuthService);
  
  rolUsuario: string = '';
  puedeEditar: boolean = false; 
  
  // Datos de prueba (Luego los traeremos de FastAPI)
  listaEspacios = [
    { id: 1, nombre: 'Sala de Juntas A', capacidad: 10, descripcion: 'Proyector, pantalla y pizarra blanca.' },
    { id: 2, nombre: 'Auditorio Principal', capacidad: 50, descripcion: 'Micrófonos, escenario y sonido envolvente.' },
    { id: 3, nombre: 'Terraza Abierta', capacidad: 25, descripcion: 'Espacio al aire libre ideal para eventos casuales.' }
  ];

  async ngOnInit() {
    // Al cargar la pantalla, leemos el rol del usuario actual
    this.rolUsuario = await this.authService.getRolActual();
    
    // Verificamos si tiene permisos elevados para ocultar/mostrar botones
    this.puedeEditar = this.rolUsuario === 'Administración' || this.rolUsuario === 'Coordinador';
  }
}