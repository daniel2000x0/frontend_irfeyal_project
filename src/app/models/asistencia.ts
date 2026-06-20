export interface Asistencia {
  idAsistencia: number;
  estadoAsis: boolean;
  idClase: number;
  idEstudiante: number;
}

export interface Clase {
  idClase: number;
  fecClase: string;
  id_modalidad: number;
  id_periodo: number;
  idDocente: number;
  idAsignatura: number;
  idParalelo: number;
  idCurso: number;
}
