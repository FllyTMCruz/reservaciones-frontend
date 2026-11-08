import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
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
  Pendiente: '#f59e0b',
  Confirmado: '#10b981',
  Cancelado: '#f43f5e'
};

@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [CommonModule, FormsModule, FullCalendarModule, RouterModule],
  templateUrl: './calendario.html',
  styleUrl: './calendario.css'
})
export class Calendario implements OnInit {
  private eventosService = inject(EventosService);
  private espaciosService = inject(EspaciosService);
  private authService = inject(AuthService);
  private router = inject(Router);

  errorMensaje = signal('');
  mensajeExito = signal('');

  idUsuarioActual = signal<string | null>(null);
  rolUsuario = signal('');
  esGestion = signal(false);

  listaEspacios = signal<Espacio[]>([]);
  eventos = signal<EventoReservacion[]>([]);
  filtroCategoria = signal('todos');
  fechaSeleccionada = signal(new Date().toISOString().slice(0, 10));

  // --- Espacios filtrados por categoría en cápsula hero ---
  espaciosFiltrados = computed(() => {
    const cat = this.filtroCategoria();
    const esp = this.listaEspacios();
    if (cat === 'todos') return esp;
    if (cat === 'jardines') return esp.filter(e => e.nombre_espacio.toLowerCase().includes('jard') || e.nombre_espacio.toLowerCase().includes('terraza'));
    if (cat === 'auditorios') return esp.filter(e => e.nombre_espacio.toLowerCase().includes('audit'));
    if (cat === 'gala') return esp.filter(e => e.nombre_espacio.toLowerCase().includes('gala') || e.nombre_espacio.toLowerCase().includes('salón') || e.nombre_espacio.toLowerCase().includes('salon'));
    if (cat === 'salas') return esp.filter(e => e.nombre_espacio.toLowerCase().includes('sala') || e.nombre_espacio.toLowerCase().includes('ejecutiv'));
    return esp;
  });

  // --- Eventos correspondientes al día seleccionado ---
  eventosDelDia = computed(() => {
    const f = this.fechaSeleccionada();
    return this.eventos().filter(e => e.fecha_inicio.startsWith(f));
  });

  // --- Formulario de creación / edición de reservación ---
  mostrarFormulario = signal(false);
  modoEdicion = signal(false);
  guardandoReservacion = signal(false);
  errorFormulario = signal('');

  formulario = {
    idEventoEditando: null as number | null,
    fecha: new Date().toISOString().slice(0, 10),
    horaInicio: '09:00',
    horaFin: '12:00',
    id_espacio: null as number | null,
    tipo_evento: '',
    invitados_estimados: 50
  };

  // --- Panel de detalle de un evento ---
  eventoSeleccionado = signal<EventoReservacion | null>(null);
  procesandoDetalle = signal(false);

  calendarOptions = signal<CalendarOptions>({
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    events: [],
    dateClick: this.handleDateClick.bind(this),
    eventClick: this.handleEventClick.bind(this),
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth'
    },
    buttonText: {
      today: 'Hoy',
      month: 'Mes'
    }
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
      next: (espacios) => {
        this.listaEspacios.set(espacios);
        if (!this.formulario.id_espacio && espacios.length > 0) {
          this.formulario.id_espacio = espacios[0].id_espacio;
        }
      },
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
          backgroundColor: COLOR_POR_ESTADO[ev.estado_evento] ?? '#0056b3',
          borderColor: COLOR_POR_ESTADO[ev.estado_evento] ?? '#0056b3',
          textColor: '#ffffff'
        }));
        this.calendarOptions.update(opciones => ({ ...opciones, events: eventosMapeados }));
      },
      error: () => {
        this.errorMensaje.set('No se pudieron cargar las reservaciones.');
      }
    });
  }

  // ---------- Categorías & Fecha ----------

  seleccionarCategoria(cat: string) {
    this.filtroCategoria.set(cat);
    const filtrados = this.espaciosFiltrados();
    if (filtrados.length > 0 && !filtrados.some(e => e.id_espacio === this.formulario.id_espacio)) {
      this.formulario.id_espacio = filtrados[0].id_espacio;
    }
  }

  fechaSeleccionadaFormateada(): string {
    try {
      const partes = this.fechaSeleccionada().split('-');
      if (partes.length === 3) {
        const y = Number(partes[0]);
        const m = Number(partes[1]);
        const d = Number(partes[2]);
        const fecha = new Date(y, m - 1, d);
        return fecha.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
      }
      return this.fechaSeleccionada();
    } catch {
      return this.fechaSeleccionada();
    }
  }

  diaSeleccionadoNumero(): string {
    try {
      const partes = this.fechaSeleccionada().split('-');
      return partes[2] || '1';
    } catch {
      return '1';
    }
  }

  // ---------- Crear reservación ----------

  handleDateClick(arg: any) {
    this.fechaSeleccionada.set(arg.dateStr);
    this.formulario.fecha = arg.dateStr;

    // Si el usuario está autenticado, opcionalmente puede crear de una vez
    if (this.idUsuarioActual()) {
      this.abrirModalNuevaReserva(arg.dateStr);
    }
  }

  abrirModalNuevaReserva(fecha?: string) {
    if (!this.idUsuarioActual()) {
      this.router.navigate(['/login']);
      return;
    }
    const fechaUsar = fecha || this.fechaSeleccionada();
    this.errorFormulario.set('');
    this.modoEdicion.set(false);
    this.formulario = {
      idEventoEditando: null,
      fecha: fechaUsar,
      horaInicio: '09:00',
      horaFin: '12:00',
      id_espacio: this.formulario.id_espacio || this.listaEspacios()[0]?.id_espacio || null,
      tipo_evento: '',
      invitados_estimados: 50
    };
    this.mostrarFormulario.set(true);
  }

  abrirEdicion(evento: EventoReservacion) {
    this.errorFormulario.set('');
    this.modoEdicion.set(true);
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

  guardarDesdeBarra() {
    if (!this.idUsuarioActual()) {
      this.router.navigate(['/login']);
      return;
    }
    if (!this.formulario.tipo_evento.trim()) {
      this.errorFormulario.set('');
      this.modoEdicion.set(false);
      this.mostrarFormulario.set(true);
      return;
    }
    this.guardarReservacion();
  }

  reservarEspacio(idEspacio: number) {
    if (!this.idUsuarioActual()) {
      this.router.navigate(['/login']);
      return;
    }
    this.formulario.id_espacio = idEspacio;
    this.modoEdicion.set(false);
    this.errorFormulario.set('');
    this.mostrarFormulario.set(true);
  }

  private construirPayload() {
    return {
      id_espacio: this.formulario.id_espacio as number,
      fecha_inicio: `${this.formulario.fecha}T${this.formulario.horaInicio}:00`,
      fecha_fin: `${this.formulario.fecha}T${this.formulario.horaFin}:00`,
      tipo_evento: this.formulario.tipo_evento.trim(),
      invitados_estimados: this.formulario.invitados_estimados
    };
  }

  guardarReservacion() {
    if (!this.idUsuarioActual()) {
      this.router.navigate(['/login']);
      return;
    }
    this.errorFormulario.set('');

    if (!this.formulario.id_espacio) {
      this.errorFormulario.set('Selecciona un espacio.');
      this.mostrarFormulario.set(true);
      return;
    }
    if (!this.formulario.tipo_evento.trim()) {
      this.errorFormulario.set('Indica el tipo de evento.');
      this.mostrarFormulario.set(true);
      return;
    }
    if (this.formulario.invitados_estimados < 1 || this.formulario.invitados_estimados > 300) {
      this.errorFormulario.set('Los invitados estimados deben estar entre 1 y 300.');
      this.mostrarFormulario.set(true);
      return;
    }
    if (this.formulario.horaFin <= this.formulario.horaInicio) {
      this.errorFormulario.set('La hora de fin debe ser posterior a la hora de inicio.');
      this.mostrarFormulario.set(true);
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
        setTimeout(() => this.mensajeExito.set(''), 4500);
      },
      error: (err) => {
        this.guardandoReservacion.set(false);
        this.mostrarFormulario.set(true);
        if (err?.status === 409) {
          this.errorFormulario.set('Ese espacio ya está reservado en ese horario.');
        } else if (err?.error?.detail) {
          this.errorFormulario.set(err.error.detail);
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

  capacidadEspacio(idEspacio: number): number {
    return this.listaEspacios().find(e => e.id_espacio === idEspacio)?.capacidad_maxima ?? 300;
  }
}
