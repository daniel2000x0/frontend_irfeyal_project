import { Periodo, Modalidad, Curso, Paralelo, Asignatura, FechaAsistencia } from './catalogo';

describe('Catalogo models', () => {
  it('should create a Periodo', () => {
    const p: Periodo = {
      id_periodo: 1,
      malla: { descripcion: 'Malla 2026' },
      fecha_inicio: '2026-01-01',
      fecha_fin: '2026-12-31',
    };
    expect(p.malla.descripcion).toBe('Malla 2026');
  });

  it('should create a Modalidad', () => {
    const m: Modalidad = { id_modalidad: 1, descripcion: 'Presencial' };
    expect(m.descripcion).toBe('Presencial');
  });

  it('should create a Curso', () => {
    const c: Curso = { id_curso: 1, descripcion: 'Primero' };
    expect(c.descripcion).toBe('Primero');
  });

  it('should create a Paralelo', () => {
    const p: Paralelo = { id_paralelo: 1, descripcion: 'A' };
    expect(p.descripcion).toBe('A');
  });

  it('should create an Asignatura', () => {
    const a: Asignatura = { id_asignatura: 1, descripcion: 'Matemáticas' };
    expect(a.descripcion).toBe('Matemáticas');
  });

  it('should create a FechaAsistencia', () => {
    const f: FechaAsistencia = {
      idAsignatura: { descripcion: 'Matemáticas' },
      fecClase: '2026-06-19',
    };
    expect(f.idAsignatura.descripcion).toBe('Matemáticas');
    expect(f.fecClase).toBe('2026-06-19');
  });
});
