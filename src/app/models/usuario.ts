export interface Usuario {
  id_usuario: number;
  empleado?: { id_empleado: number };
  roles: string[];
}
