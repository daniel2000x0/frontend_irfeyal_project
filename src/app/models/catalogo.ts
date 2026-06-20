export interface Periodo {
  id_periodo: number;
  malla: { descripcion: string };
  fecha_inicio: string;
  fecha_fin: string;
  descripcion?: string;
}

export interface Modalidad {
  id_modalidad: number;
  descripcion: string;
}

export interface Curso {
  id_curso: number;
  descripcion: string;
}

export interface Paralelo {
  id_paralelo: number;
  descripcion: string;
}

export interface Asignatura {
  id_asignatura: number;
  descripcion: string;
}

export interface FechaAsistencia {
  idAsignatura: { descripcion: string };
  fecClase: string;
}
