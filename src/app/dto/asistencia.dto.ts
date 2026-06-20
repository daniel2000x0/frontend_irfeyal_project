export interface CrearClaseDto {
  idClase: number;
  fecClase: string;
  id_periodo: number;
  id_modalidad: number;
  idDocente: number;
  idAsignatura: number;
  idParalelo: number;
  idCurso: number;
}

export interface CrearAsistenciaDto {
  idAsistencia: number;
  estadoAsis: boolean;
  idClase: number;
  idEstudiante: number;
}

export type DestType = 'crear' | 'actu';
