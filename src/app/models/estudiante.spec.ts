import { Estudiante, Persona } from './estudiante';

describe('Estudiante', () => {
  it('should create an Estudiante with Persona', () => {
    const p: Persona = { id_persona: 1, nombre: 'Juan', apellido: 'Pérez', cedula: '1234567890' };
    const e: Estudiante = { id_estudiante: 10, id_persona: p };
    expect(e.id_persona.nombre).toBe('Juan');
    expect(e.id_persona.apellido).toBe('Pérez');
  });
});
