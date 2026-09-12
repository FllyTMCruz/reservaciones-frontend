export type RolUsuario = 'Cliente' | 'Coordinador' | 'Administración';

export interface Usuario {
  id_usuario: string;
  nombre: string;
  correo: string;
  rol: RolUsuario;
}