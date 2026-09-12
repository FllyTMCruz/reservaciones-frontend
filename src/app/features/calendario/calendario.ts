import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

import { EventosService } from '../../core/services/eventos.service';

const COLOR_POR_ESTADO: Record<string, string> = {
  Pendiente: '#f0ad4e',
  Confirmado: '#28a745',
  Cancelado: '#d9534f'
};

@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [CommonModule, FullCalendarModule],
  templateUrl: './calendario.html',
  styleUrl: './calendario.css'
})
export class Calendario implements OnInit {
  private eventosService = inject(EventosService);

  errorMensaje = '';

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    events: [],
    dateClick: this.handleDateClick.bind(this),
    eventClick: this.handleEventClick.bind(this)
  };

  ngOnInit() {
    this.cargarEventos();
  }

  cargarEventos() {
    this.eventosService.listar().subscribe({
      next: (eventos) => {
        const eventosMapeados = eventos.map(ev => ({
          id: String(ev.id_evento),
          title: ev.tipo_evento,
          start: ev.fecha_inicio,
          end: ev.fecha_fin,
          color: COLOR_POR_ESTADO[ev.estado_evento] ?? '#0056b3'
        }));
        // Reasignamos el objeto completo (no mutamos) para que FullCalendar detecte el cambio.
        this.calendarOptions = { ...this.calendarOptions, events: eventosMapeados };
      },
      error: () => {
        this.errorMensaje = 'No se pudieron cargar las reservaciones.';
      }
    });
  }

  handleDateClick(arg: any) {
    // Aquí después abrimos el modal de creación (POST /eventos/).
    alert('¿Deseas iniciar una reservación para la fecha: ' + arg.dateStr + '?');
  }

  handleEventClick(arg: any) {
    // Aquí después abrimos el detalle/edición.
    alert('Detalles de la reservación: ' + arg.event.title);
  }
}