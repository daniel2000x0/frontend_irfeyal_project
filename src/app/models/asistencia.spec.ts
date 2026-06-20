import { Asistencia, Clase } from './asistencia';

describe('Asistencia', () => {
  it('should create an Asistencia with default values', () => {
    const item: Asistencia = {
      idAsistencia: 0,
      estadoAsis: false,
      idClase: 0,
      idEstudiante: 0,
    };
    expect(item).toBeTruthy();
    expect(item.estadoAsis).toBeFalse();
  });

  it('should represent an absence when estadoAsis is true', () => {
    const falta: Asistencia = {
      idAsistencia: 1,
      estadoAsis: true,
      idClase: 10,
      idEstudiante: 5,
    };
    expect(falta.estadoAsis).toBeTrue();
    expect(falta.idEstudiante).toBe(5);
  });

  it('should represent a presence when estadoAsis is false', () => {
    const presente: Asistencia = {
      idAsistencia: 2,
      estadoAsis: false,
      idClase: 10,
      idEstudiante: 3,
    };
    expect(presente.estadoAsis).toBeFalse();
  });
});

describe('Clase', () => {
  it('should create a Clase with all properties', () => {
    const clase: Clase = {
      idClase: 1,
      fecClase: '2026-06-19T05:00:00.000+00:00',
      id_modalidad: 1,
      id_periodo: 2,
      idDocente: 3,
      idAsignatura: 4,
      idParalelo: 5,
      idCurso: 6,
    };
    expect(clase).toBeTruthy();
    expect(clase.idDocente).toBe(3);
    expect(clase.idAsignatura).toBe(4);
  });
});
