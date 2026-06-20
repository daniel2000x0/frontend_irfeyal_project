export interface Estudiante {
  id_estudiante: number;
  id_persona: Persona;
}

export interface Persona {
  id_persona: number;
  nombre: string;
  apellido: string;
  cedula: string;
}
