import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AsistenciaService } from './asistencia.service';
import { environment } from '../../environments/environment';
import { Periodo } from '../models/catalogo';

describe('AsistenciaService', () => {
  let service: AsistenciaService;
  let httpMock: HttpTestingController;
  const apiUrl = environment.apiUrl + 'asistencia';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AsistenciaService],
    });
    service = TestBed.inject(AsistenciaService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all periodos', () => {
    const mockPeriodos: Periodo[] = [
      { id_periodo: 1, malla: { descripcion: 'Malla 2026' }, fecha_inicio: '2026-01-01', fecha_fin: '2026-12-31' },
    ];

    service.getAllPeriodo().subscribe(periodos => {
      expect(periodos.length).toBe(1);
      expect(periodos[0].id_periodo).toBe(1);
    });

    const req = httpMock.expectOne(`${apiUrl}/Periodo`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPeriodos);
  });

  it('should fetch all modalidades', () => {
    service.getAllModalidad().subscribe(data => {
      expect(data).toBeDefined();
    });

    const req = httpMock.expectOne(`${apiUrl}/Modalidad`);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('should fetch all cursos', () => {
    service.getAllCurso().subscribe();

    const req = httpMock.expectOne(`${apiUrl}/Curso`);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('should fetch all paralelos', () => {
    service.getAllParalelo().subscribe();

    const req = httpMock.expectOne(`${apiUrl}/Paralelo`);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('should fetch all asignaturas', () => {
    service.getAllAsignatura().subscribe();

    const req = httpMock.expectOne(`${apiUrl}/asignaturas`);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('should list periods by employee', () => {
    service.listarPeriodos(1).subscribe();

    const req = httpMock.expectOne(`${apiUrl}/Periodos/1`);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('should list modalidades by employee and period', () => {
    service.listarModalidad(1, 2).subscribe();

    const req = httpMock.expectOne(`${apiUrl}/modalidades/1/2`);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('should list cursos by employee, period and modality', () => {
    service.listarCursos(1, 2, 3).subscribe();

    const req = httpMock.expectOne(`${apiUrl}/cursos/1/2/3`);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('should list paralelos by filters', () => {
    service.listarParalelo(1, 2, 3, 4).subscribe();

    const req = httpMock.expectOne(`${apiUrl}/paralelos/1/2/3/4`);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('should list asignaturas by filters', () => {
    service.listarAsignatura(1, 2, 3, 4, 5).subscribe();

    const req = httpMock.expectOne(`${apiUrl}/asignaturas/1/2/3/4/5`);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('should get filtered students', () => {
    service.getFiltros(1, 2, 3, 4, 5).subscribe();

    const req = httpMock.expectOne(`${apiUrl}/filtrosdelaasistencia/1/2/3/4/5`);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('should get student info by id', () => {
    service.getInfoEstudiante(10).subscribe();

    const req = httpMock.expectOne(`${apiUrl}/buscarestudianteid/10`);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('should get absence dates for a student', () => {
    service.getFechasFaltas(1, 2, 3, 4, 5, 6, 7).subscribe();

    const req = httpMock.expectOne(`${apiUrl}/mostrarfechasdefaltas/1/2/3/4/5/6/7`);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('should create a clase', () => {
    const clase = { idClase: 0, fecClase: '2026-06-19T05:00:00.000+00:00', id_modalidad: 1, id_periodo: 2, idDocente: 3, idAsignatura: 4, idParalelo: 5, idCurso: 6 };

    service.createClase(clase).subscribe(res => {
      expect(res.idClase).toBe(1);
    });

    const req = httpMock.expectOne(`${apiUrl}/clasesave`);
    expect(req.request.method).toBe('POST');
    req.flush({ ...clase, idClase: 1 });
  });

  it('should update a clase', () => {
    const clase = { idClase: 1, fecClase: '2026-06-19T05:00:00.000+00:00', id_modalidad: 1, id_periodo: 2, idDocente: 3, idAsignatura: 4, idParalelo: 5, idCurso: 6 };

    service.actualizarClases(clase).subscribe();

    const req = httpMock.expectOne(`${apiUrl}/claseactualizar/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(clase);
  });

  it('should find the last created clase', () => {
    service.buscarClase().subscribe();

    const req = httpMock.expectOne(`${apiUrl}/claseingresada`);
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('should validate if a class already exists', () => {
    service.validarClase(1, 2, 3, 4, 5, 6, '2026-06-19').subscribe(count => {
      expect(count).toBe(1);
    });

    const req = httpMock.expectOne(`${apiUrl}/validarclass/1/2/3/4/5/6/2026-06-19`);
    expect(req.request.method).toBe('GET');
    req.flush(1);
  });

  it('should validate class by object', () => {
    service.validarClaseObj(1, 2, 3, 4, 5, '2026-06-19', 7).subscribe();

    const req = httpMock.expectOne(`${apiUrl}/validarclase/1/2/3/4/5/2026-06-19/7`);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('should create an attendance record', () => {
    const asistencia = { idAsistencia: 0, estadoAsis: false, idClase: 1, idEstudiante: 5 };

    service.create(asistencia).subscribe(res => {
      expect(res.idAsistencia).toBe(1);
    });

    const req = httpMock.expectOne(`${apiUrl}/asistenciasave`);
    expect(req.request.method).toBe('POST');
    req.flush({ ...asistencia, idAsistencia: 1 });
  });

  it('should update an attendance record', () => {
    const asistencia = { idAsistencia: 1, estadoAsis: true, idClase: 1, idEstudiante: 5 };

    service.updateAsistencia(asistencia).subscribe();

    const req = httpMock.expectOne(`${apiUrl}/updateasistencia/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(asistencia);
  });

  it('should get attendance records for update', () => {
    service.getFiltrosActualizar(1, 2, 3, 4, 5, '2026-06-19', 7).subscribe();

    const req = httpMock.expectOne(`${apiUrl}/buscaractualizar/1/2/3/4/5/2026-06-19/7`);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('should export individual invoice as PDF', () => {
    const blob = new ArrayBuffer(10);
    service.exportInvoice(1, 2, 3, 4, new Date('2026-01-01'), new Date('2026-06-19')).subscribe(data => {
      expect(data.byteLength).toBe(10);
    });

    const req = httpMock.expectOne(reqUrl => reqUrl.url.includes('/exportInvoice/'));
    expect(req.request.method).toBe('GET');
    expect(req.request.responseType).toBe('arraybuffer');
    req.flush(blob);
  });

  it('should export course invoice as PDF', () => {
    const blob = new ArrayBuffer(10);
    service.exportInvoiceCurso(1, 2, 3, 4, 5, 6, 7, new Date('2026-01-01'), new Date('2026-06-19')).subscribe(data => {
      expect(data.byteLength).toBe(10);
    });

    const req = httpMock.expectOne(reqUrl => reqUrl.url.includes('/exportInvoicecurso/'));
    expect(req.request.method).toBe('GET');
    expect(req.request.responseType).toBe('arraybuffer');
    req.flush(blob);
  });

  it('should return paralelos by course', () => {
    service.returnParalelo(1).subscribe();

    const req = httpMock.expectOne(`${apiUrl}/Paraleloaux/1`);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });
});
