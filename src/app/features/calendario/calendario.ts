import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
// Importaciones clave de FullCalendar
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-calendario',
  standalone: true,
  // ¡Muy importante importar FullCalendarModule aquí!
  imports: [CommonModule, FullCalendarModule],
  templateUrl: './calendario.html',
  styleUrl: './calendario.css'
})
export class Calendario {
  private authService = inject(AuthService);

  // Opciones de configuración para FullCalendar
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth', // Vista de mes por defecto
    plugins: [dayGridPlugin, interactionPlugin],
    
    // Datos de prueba (Luego los traeremos del endpoint de FastAPI)
    events: [
      { title: 'Boda - Auditorio Principal', date: '2026-09-18', color: '#28a745' },
      { title: 'Junta - Sala A', date: '2026-09-20', color: '#0056b3' }
    ],
    
    // Eventos de interacción del usuario
    dateClick: this.handleDateClick.bind(this),
    eventClick: this.handleEventClick.bind(this)
  };

  // Se ejecuta al hacer clic en un día vacío
  handleDateClick(arg: any) {
    // Aquí luego abriremos un modal para crear la reservación.
    // Recordatorio del backend: El tipo de evento (Boda, Graduación, etc.) debe ser texto libre.
    alert('¿Deseas iniciar una reservación para la fecha: ' + arg.dateStr + '?');
  }

  // Se ejecuta al hacer clic en un evento ya creado
  handleEventClick(arg: any) {
    // Aquí luego abriremos el detalle. 
    // Recordatorio: Solo el dueño puede editar/eliminar, y solo Administración/Coordinación puede confirmar/cancelar.
    alert('Detalles de la reservación: ' + arg.event.title);
  }
}