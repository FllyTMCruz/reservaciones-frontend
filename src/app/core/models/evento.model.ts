export type EstadoEvento = 'Pendiente' | 'Confirmado' | 'Cancelado';

export interface EventoReservacion {
  id_evento: number;
  id_usuario: string;
  id_espacio: number;
  fecha_inicio: string;
  fecha_fin: string;
  tipo_evento: string;
  invitados_estimados: number;
  estado_evento: EstadoEvento;
}