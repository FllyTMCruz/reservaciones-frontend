/**
 * Configuración pública utilizada por la aplicación.
 *
 * No incluir secretos aquí: este archivo forma parte del bundle del navegador.
 */
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000/api',
  publicKeys: {
    // Agregar aquí únicamente llaves diseñadas para exponerse al cliente.
  },
} as const;
