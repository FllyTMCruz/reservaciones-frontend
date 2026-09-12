import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-administracion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './administracion.html',
  styleUrl: './administracion.css'
})
export class Administracion implements OnInit {
  private authService = inject(AuthService);

  // Lista de usuarios simulada (posteriormente se conectará al backend de FastAPI)
  usuarios = [
    { id: '1', email: 'admin@sistema.com', nombre: 'Carlos Admin', rol: 'Administración' },
    { id: '2', email: 'coordinador@sistema.com', nombre: 'Ana Coordinadora', rol: 'Coordinador' },
    { id: '3', email: 'cliente@sistema.com', nombre: 'Juan Cliente', rol: 'Cliente' }
  ];

  async ngOnInit() {
    // Validación de seguridad inicial en la vista
    const rolActual = await this.authService.getRolActual();
    console.log('Panel de administración cargado por rol:', rolActual);
  }

  cambiarRol(usuarioId: string, nuevoRol: string) {
    // Lógica para enviar el cambio de rol al backend o Supabase
    alert(`Actualizando el rol del usuario ID ${usuarioId} a: ${nuevoRol}`);
  }
}