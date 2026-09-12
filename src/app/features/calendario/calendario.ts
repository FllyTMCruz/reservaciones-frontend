import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

import { EventosService } from '../../core/services/eventos.service';
import { EspaciosService } from '../../core/services/espacios.service';
import { AuthService } from '../../core/services/auth.service';
import { Espacio } from '../../core/models/espacio.model';
import { EventoReservacion } from '../../core/models/evento.model';

const COLOR_POR_ESTADO: Record<string, string> = {
  Pendiente: '#f0ad4e',
  Confirmado: '#28a745',
  Cancelado: '#d9534f'
};

@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [CommonModule, FormsModule, FullCalendarModule],
  templateUrl: './calendario.html',
  styleUrl: './calendario.css'
})
export class Calendario implements OnInit {
  private eventosService = inject(EventosService);
  private espaciosService = inject(EspaciosService);
  private authService = inject(AuthService);

  errorMensaje = signal('');
  mensajeExito = signal('');

  idUsuarioActual = signal<string | null>(null);
  rolUsuario = signal('');
  esGestion = signal(false);

  listaEspacios = signal<Espacio[]>([]);
  eventos = signal<EventoReservacion[]>([]);

  // --- Formulario de creación / edición de reservación ---
  mostrarFormulario = signal(false);
  modoEdicion = signal(false);
  guardandoReservacion = signal(false);
  errorFormulario = signal('');

  formulario = {
    idEventoEditando: null as number | null,
    fecha: '',
    horaInicio: '',
    horaFin: '',
    id_espacio: null as number | null,
    tipo_evento: '',
    invitados_estimados: 1
  };

  // --- Panel de detalle de un evento ---
  eventoSeleccionado = signal<EventoReservacion | null>(null);
  procesandoDetalle = signal(false);

  calendarOptions = signal<CalendarOptions>({
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    events: [],
    dateClick: this.handleDateClick.bind(this),
    eventClick: this.handleEventClick.bind(this)
  });

  async ngOnInit() {
    const [id, rol] = await Promise.all([
      this.authService.getIdUsuarioActual(),
      this.authService.getRolActual()
    ]);
    this.idUsuarioActual.set(id);
    this.rolUsuario.set(rol);
    this.esGestion.set(rol === 'Coordinador' || rol === 'Administración');

    this.espaciosService.listar().subscribe({
      next: (espacios) => this.listaEspacios.set(espacios),
      error: () => this.errorMensaje.set('No se pudieron cargar los espacios disponibles.')
    });

    this.cargarEventos();
  }

  cargarEventos() {
    this.eventosService.listar().subscribe({
      next: (eventos) => {
        this.eventos.set(eventos);
        const eventosMapeados = eventos.map(ev => ({
          id: String(ev.id_evento),
          title: `${ev.tipo_evento} (${ev.estado_evento})`,
          start: ev.fecha_inicio,
          end: ev.fecha_fin,
          color: COLOR_POR_ESTADO[ev.estado_evento] ?? '#0056b3'
        }));
        this.calendarOptions.update(opciones => ({ ...opciones, events: eventosMapeados }));
      },
      error: () => {
        this.errorMensaje.set('No se pudieron cargar las reservaciones.');
      }
    });
  }

  // ---------- Crear reservación ----------

  handleDateClick(arg: any) {
    this.errorFormulario.set('');
    this.modoEdicion.set(false);
    this.formulario = {
      idEventoEditando: null,
      fecha: arg.dateStr,
      horaInicio: '09:00',
      horaFin: '10:00',
      id_espacio: this.listaEspacios()[0]?.id_espacio ?? null,
      tipo_evento: '',
      invitados_estimados: 1
    };
    this.mostrarFormulario.set(true);
  }

  abrirEdicion(evento: EventoReservacion) {
    this.errorFormulario.set('');
    this.modoEdicion.set(true);
    // El backend devuelve fecha_inicio/fecha_fin como strings tipo
    // "2026-09-20T09:00:00" (datetime naive, sin timezone). Los cortamos
    // directo como texto en vez de pasar por Date/toISOString, que sí
    // convierte a UTC y correría la hora/fecha mostrada.
    this.formulario = {
      idEventoEditando: evento.id_evento,
      fecha: evento.fecha_inicio.slice(0, 10),
      horaInicio: evento.fecha_inicio.slice(11, 16),
      horaFin: evento.fecha_fin.slice(11, 16),
      id_espacio: evento.id_espacio,
      tipo_evento: evento.tipo_evento,
      invitados_estimados: evento.invitados_estimados
    };
    this.eventoSeleccionado.set(null);
    this.mostrarFormulario.set(true);
  }

  cerrarFormulario() {
    this.mostrarFormulario.set(false);
    this.errorFormulario.set('');
  }

  private construirPayload() {
    // OJO: fecha_inicio/fecha_fin en el backend son DateTime SIN timezone
    // (columna "naive"). Si aquí armáramos un Date y usáramos
    // toISOString(), JS lo convertiría a UTC y desplazaría la hora que
    // el usuario realmente eligió (ej. 9:00 AM local -> 15:00 en UTC-6).
    // Mandamos el string local tal cual, sin pasar por Date/UTC.
    return {
      id_espacio: this.formulario.id_espacio as number,
      fecha_inicio: `${this.formulario.fecha}T${this.formulario.horaInicio}:00`,
      fecha_fin: `${this.formulario.fecha}T${this.formulario.horaFin}:00`,
      tipo_evento: this.formulario.tipo_evento,
      invitados_estimados: this.formulario.invitados_estimados
    };
  }

  guardarReservacion() {
    this.errorFormulario.set('');

    if (!this.formulario.id_espacio) {
      this.errorFormulario.set('Selecciona un espacio.');
      return;
    }
    if (!this.formulario.tipo_evento.trim()) {
      this.errorFormulario.set('Indica el tipo de evento.');
      return;
    }
    if (this.formulario.invitados_estimados < 1 || this.formulario.invitados_estimados > 300) {
      this.errorFormulario.set('Los invitados estimados deben estar entre 1 y 300.');
      return;
    }
    if (this.formulario.horaFin <= this.formulario.horaInicio) {
      this.errorFormulario.set('La hora de fin debe ser posterior a la hora de inicio.');
      return;
    }

    const payload = this.construirPayload();
    this.guardandoReservacion.set(true);

    const peticion = this.modoEdicion() && this.formulario.idEventoEditando
      ? this.eventosService.actualizar(this.formulario.idEventoEditando, payload)
      : this.eventosService.crear(payload);

    peticion.subscribe({
      next: () => {
        this.guardandoReservacion.set(false);
        this.mostrarFormulario.set(false);
        this.mensajeExito.set(
          this.modoEdicion()
            ? 'Reservación actualizada correctamente.'
            : 'Reservación creada correctamente (queda en estado Pendiente).'
        );
        this.cargarEventos();
        setTimeout(() => this.mensajeExito.set(''), 4000);
      },
      error: (err) => {
        this.guardandoReservacion.set(false);
        if (err?.status === 409) {
          this.errorFormulario.set('Ese espacio ya está reservado en ese horario.');
        } else {
          this.errorFormulario.set('No se pudo guardar la reservación. Verifica los datos.');
        }
      }
    });
  }

  // ---------- Detalle / gestión de un evento ----------

  handleEventClick(arg: any) {
    const idEvento = Number(arg.event.id);
    const evento = this.eventos().find(e => e.id_evento === idEvento) ?? null;
    this.errorMensaje.set('');
    this.eventoSeleccionado.set(evento);
  }

  cerrarDetalle() {
    this.eventoSeleccionado.set(null);
  }

  esDueno(evento: EventoReservacion): boolean {
    return !!this.idUsuarioActual() && evento.id_usuario === this.idUsuarioActual();
  }

  cancelarReservacion(evento: EventoReservacion) {
    if (!confirm('¿Seguro que quieres cancelar esta reservación?')) return;
    this.procesandoDetalle.set(true);
    this.eventosService.eliminar(evento.id_evento).subscribe({
      next: () => {
        this.procesandoDetalle.set(false);
        this.eventoSeleccionado.set(null);
        this.mensajeExito.set('Reservación cancelada.');
        this.cargarEventos();
        setTimeout(() => this.mensajeExito.set(''), 4000);
      },
      error: () => {
        this.procesandoDetalle.set(false);
        this.errorMensaje.set('No se pudo cancelar la reservación.');
      }
    });
  }

  cambiarEstado(evento: EventoReservacion, estado: 'Confirmado' | 'Cancelado') {
    this.procesandoDetalle.set(true);
    this.eventosService.cambiarEstado(evento.id_evento, estado).subscribe({
      next: () => {
        this.procesandoDetalle.set(false);
        this.eventoSeleccionado.set(null);
        this.mensajeExito.set(`Reservación marcada como ${estado}.`);
        this.cargarEventos();
        setTimeout(() => this.mensajeExito.set(''), 4000);
      },
      error: () => {
        this.procesandoDetalle.set(false);
        this.errorMensaje.set('No se pudo actualizar el estado de la reservación.');
      }
    });
  }

  nombreEspacio(idEspacio: number): string {
    return this.listaEspacios().find(e => e.id_espacio === idEspacio)?.nombre_espacio ?? `Espacio #${idEspacio}`;
  }
}
