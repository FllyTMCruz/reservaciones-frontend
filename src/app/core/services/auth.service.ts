// Ruta recomendada: src/app/core/services/auth.service.ts
import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environment'; // Importamos las credenciales

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabase: SupabaseClient;

  constructor() {
    // Inicializamos el cliente de Supabase
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  // Función para registrar un nuevo usuario
  async registrarUsuario(email: string, password: string, nombre: string, rol?: string) {
    
    // Preparamos el objeto con los datos adicionales
    const userData: any = { nombre: nombre };
    
    // Si el formulario envía un rol (para Administrador o Coordinador), lo agregamos.
    // Si no, el backend le asignará 'Cliente' por defecto automáticamente.
    if (rol) {
      userData.rol = rol;
    }
    // Llamada a Supabase respetando la estructura exigida por el backend
    const { data, error } = await this.supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: userData 
      }
    });

    if (error) {
      throw error;
    }
    
    return data;
  }
    // Inicia sesión con correo y contraseña
  async iniciarSesion(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      throw error;
    }

    return data;
  }

  // Cierra la sesión actual
  async cerrarSesion() {
    await this.supabase.auth.signOut();
  }

  // Útil para el guard de "solo usuarios logueados"
  async estaAutenticado(): Promise<boolean> {
    const { data } = await this.supabase.auth.getSession();
    return !!data.session;
  }
  
  //Obtiene el Token JWT del usuario autenticado actualmente
   async getToken(): Promise<string | null> {
        const {data}= await this.supabase.auth.getSession();
        return data.session?.access_token || null;
    }
    
    // Obtiene el rol del usuario logueado desde los metadatos de Supabase
async getRolActual(): Promise<string> {
  const { data } = await this.supabase.auth.getSession();
  // Buscamos el rol guardado. Si no existe, recordamos que el backend asume 'Cliente' por defecto.
  return data.session?.user?.user_metadata?.['rol'] || 'Cliente';
}

    // Obtiene el id (UUID) del usuario logueado actualmente, o null si no hay sesión
    async getIdUsuarioActual(): Promise<string | null> {
      const { data } = await this.supabase.auth.getSession();
      return data.session?.user?.id ?? null;
    }
}
