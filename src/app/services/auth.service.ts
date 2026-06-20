import { Injectable, signal } from '@angular/core';
import { Usuario } from '../models/usuario';

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly usuario = signal<Usuario>({
    id_usuario: 1,
    empleado: { id_empleado: 1 },
    roles: ['ROLE_Administrador'],
  });
}
