import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { retry } from 'rxjs/operators';
import { Asistencia, Clase } from '../models/asistencia';
import { Estudiante } from '../models/estudiante';
import { Periodo, Modalidad, Curso, Paralelo, Asignatura, FechaAsistencia } from '../models/catalogo';
import { CrearClaseDto, CrearAsistenciaDto } from '../dto';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AsistenciaService {
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  private url = environment.apiUrl + 'asistencia';

  constructor(private http: HttpClient) {}

  getAllPeriodo(): Observable<Periodo[]> {
    return this.http.get<Periodo[]>(`${this.url}/Periodo`).pipe(retry(1));
  }

  getAllModalidad(): Observable<Modalidad[]> {
    return this.http.get<Modalidad[]>(`${this.url}/Modalidad`).pipe(retry(1));
  }

  getAllCurso(): Observable<Curso[]> {
    return this.http.get<Curso[]>(`${this.url}/Curso`).pipe(retry(1));
  }

  getAllParalelo(): Observable<Paralelo[]> {
    return this.http.get<Paralelo[]>(`${this.url}/Paralelo`).pipe(retry(1));
  }

  getAllAsignatura(): Observable<Asignatura[]> {
    return this.http.get<Asignatura[]>(`${this.url}/asignaturas`).pipe(retry(1));
  }

  listarPeriodos(idEmpleado: number): Observable<Periodo[]> {
    return this.http.get<Periodo[]>(`${this.url}/Periodos/${idEmpleado}`).pipe(retry(1));
  }

  listarModalidad(idEmpleado: number, idPeriodo: number): Observable<Modalidad[]> {
    return this.http.get<Modalidad[]>(`${this.url}/modalidades/${idEmpleado}/${idPeriodo}`).pipe(retry(1));
  }

  listarCursos(idEmpleado: number, idPeriodo: number, idModalidad: number): Observable<Curso[]> {
    return this.http.get<Curso[]>(`${this.url}/cursos/${idEmpleado}/${idPeriodo}/${idModalidad}`).pipe(retry(1));
  }

  listarParalelo(idEmpleado: number, idPeriodo: number, idModalidad: number, idCurso: number): Observable<Paralelo[]> {
    return this.http.get<Paralelo[]>(`${this.url}/paralelos/${idEmpleado}/${idPeriodo}/${idModalidad}/${idCurso}`).pipe(retry(1));
  }

  listarAsignatura(idEmpleado: number, idPeriodo: number, idModalidad: number, idCurso: number, idParalelo: number): Observable<Asignatura[]> {
    return this.http.get<Asignatura[]>(`${this.url}/asignaturas/${idEmpleado}/${idPeriodo}/${idModalidad}/${idCurso}/${idParalelo}`).pipe(retry(1));
  }

  getFiltros(idModalidad: number, idPeriodo: number, idParalelo: number, idAsignatura: number, idCurso: number): Observable<Estudiante[]> {
    return this.http.get<Estudiante[]>(`${this.url}/filtrosdelaasistencia/${idModalidad}/${idPeriodo}/${idParalelo}/${idAsignatura}/${idCurso}`).pipe(retry(1));
  }

  getInfoEstudiante(id: number): Observable<Estudiante[]> {
    return this.http.get<Estudiante[]>(`${this.url}/buscarestudianteid/${id}`).pipe(retry(1));
  }

  getFechasFaltas(idEstudiante: number, idDocente: number, idAsignatura: number, idCurso: number, idParalelo: number, idModalidad: number, idPeriodo: number): Observable<FechaAsistencia[]> {
    return this.http.get<FechaAsistencia[]>(`${this.url}/mostrarfechasdefaltas/${idEstudiante}/${idDocente}/${idAsignatura}/${idCurso}/${idParalelo}/${idModalidad}/${idPeriodo}`).pipe(retry(1));
  }

  createClase(clase: CrearClaseDto): Observable<Clase> {
    return this.http.post<Clase>(`${this.url}/clasesave`, clase, { headers: this.headers }).pipe(retry(1));
  }

  actualizarClases(clase: Clase): Observable<Clase> {
    return this.http.put<Clase>(`${this.url}/claseactualizar/${clase.idClase}`, clase, { headers: this.headers }).pipe(retry(1));
  }

  buscarClase(): Observable<Clase> {
    return this.http.get<Clase>(`${this.url}/claseingresada`).pipe(retry(1));
  }

  validarClase(idDocente: number, idPeriodo: number, idModalidad: number, idCurso: number, idParalelo: number, idAsignatura: number, fecha: string): Observable<number> {
    return this.http.get<number>(`${this.url}/validarclass/${idDocente}/${idPeriodo}/${idModalidad}/${idCurso}/${idParalelo}/${idAsignatura}/${fecha}`).pipe(retry(1));
  }

  validarClaseObj(idModalidad: number, idPeriodo: number, idParalelo: number, idAsignatura: number, idCurso: number, fecha: string, docente: number): Observable<Asistencia[]> {
    return this.http.get<Asistencia[]>(`${this.url}/validarclase/${idModalidad}/${idPeriodo}/${idParalelo}/${idAsignatura}/${idCurso}/${fecha}/${docente}`).pipe(retry(1));
  }

  create(asistencia: CrearAsistenciaDto): Observable<Asistencia> {
    return this.http.post<Asistencia>(`${this.url}/asistenciasave`, asistencia, { headers: this.headers }).pipe(retry(1));
  }

  updateAsistencia(asistencia: CrearAsistenciaDto & { idAsistencia: number }): Observable<Asistencia> {
    return this.http.put<Asistencia>(`${this.url}/updateasistencia/${asistencia.idAsistencia}`, asistencia, { headers: this.headers }).pipe(retry(1));
  }

  getFiltrosActualizar(idModalidad: number, idPeriodo: number, idParalelo: number, idAsignatura: number, idCurso: number, fecha: string, docente: number): Observable<Asistencia[]> {
    return this.http.get<Asistencia[]>(`${this.url}/buscaractualizar/${idModalidad}/${idPeriodo}/${idParalelo}/${idAsignatura}/${idCurso}/${fecha}/${docente}`).pipe(retry(1));
  }

  exportInvoice(idEstudiante: number, idDocente: number, idAsignatura: number, idUsuario: number, fechaInicio: Date, fechaFin: Date): Observable<ArrayBuffer> {
    return this.http.get(`${this.url}/exportInvoice/${idEstudiante}/${idDocente}/${idAsignatura}/${idUsuario}/${fechaInicio}/${fechaFin}`, {
      responseType: 'arraybuffer',
    }).pipe(retry(1));
  }

  exportInvoiceCurso(idModalidad: number, idPeriodo: number, idParalelo: number, idAsignatura: number, idCurso: number, docente: number, idUsuario: number, fechaInicio: Date, fechaFin: Date): Observable<ArrayBuffer> {
    return this.http.get(`${this.url}/exportInvoicecurso/${idModalidad}/${idPeriodo}/${idParalelo}/${idAsignatura}/${idCurso}/${docente}/${idUsuario}/${fechaInicio}/${fechaFin}`, {
      responseType: 'arraybuffer',
    }).pipe(retry(1));
  }

  returnParalelo(idCurso: number): Observable<Paralelo[]> {
    return this.http.get<Paralelo[]>(`${this.url}/Paraleloaux/${idCurso}`).pipe(retry(1));
  }
}
