import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subject, forkJoin, takeUntil } from 'rxjs';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { Toolbar } from 'primeng/toolbar';
import { Select } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { ButtonDirective } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { DatePicker } from 'primeng/datepicker';
import { InputText } from 'primeng/inputtext';
import { Ripple } from 'primeng/ripple';
import { AsistenciaService } from '../../services/asistencia.service';
import { AuthService } from '../../services/auth.service';
import { Estudiante } from '../../models/estudiante';
import { Periodo, Modalidad, Curso, Paralelo, Asignatura, FechaAsistencia } from '../../models/catalogo';
import { FiltroState } from '../../dto';

@Component({
  selector: 'app-listar-asistencia',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    Toast,
    Toolbar,
    Select,
    TableModule,
    ButtonDirective,
    Dialog,
    DatePicker,
    InputText,
    Ripple,
  ],
  templateUrl: './listar-asistencia.component.html',
  styleUrl: './listar-asistencia.component.scss',
  providers: [MessageService],
})
export class ListarAsistenciaComponent implements OnInit, OnDestroy {
  loading = signal(false);
  loadingEstudiante = signal(false);

  periodos: Periodo[] = [];
  modalidades: Modalidad[] = [];
  cursos: Curso[] = [];
  paralelos: Paralelo[] = [];
  asignaturas: Asignatura[] = [];

  filtros = new FiltroState();

  estudiantes: Estudiante[] = [];
  estudianteInfo: Estudiante[] = [];
  fechasFaltas: FechaAsistencia[] = [];
  showDialog = false;
  idEstudiante = 0;

  protected filterValue = '';
  fechaInicio = new FormControl('');
  fechaFin = new FormControl('');
  fechaInicioIndi = new FormControl('');
  fechaFinIndi = new FormControl('');

  fechaInicioStr = '';
  fechaFinStr = '';
  fechaInicioStrIndi = '';
  fechaFinStrIndi = '';

  validarRangoCurso = false;
  validarRangoIndi = false;
  botonReportes = false;
  showFechaFinCurso = false;
  showFechaFinIndi = false;

  private destroy$ = new Subject<void>();

  private get empleadoId(): number {
    return this.auth.usuario().empleado?.id_empleado ?? 0;
  }

  private get isAdmin(): boolean {
    return this.auth.usuario().roles.some(r => r === 'ROLE_Administrador');
  }

  constructor(
    private svc: AsistenciaService,
    private auth: AuthService,
    private msg: MessageService,
  ) {}

  ngOnInit(): void {
    this.cargarPeriodos();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private cargarPeriodos(): void {
    const call = this.isAdmin
      ? this.svc.getAllPeriodo()
      : this.svc.listarPeriodos(this.empleadoId);
    call.pipe(takeUntil(this.destroy$)).subscribe({
      next: data => (this.periodos = data),
      error: () => this.mostrarError('Error al cargar periodos'),
    });
  }

  private cargarCursos(): void {
    const call = this.isAdmin
      ? this.svc.getAllCurso()
      : this.svc.listarCursos(this.empleadoId, this.filtros.idPeriodo, this.filtros.idModalidad);
    call.pipe(takeUntil(this.destroy$)).subscribe({
      next: data => (this.cursos = data),
      error: () => this.mostrarError('Error al cargar cursos'),
    });
  }

  private cargarModalidades(): void {
    const call = this.isAdmin
      ? this.svc.getAllModalidad()
      : this.svc.listarModalidad(this.empleadoId, this.filtros.idPeriodo);
    call.pipe(takeUntil(this.destroy$)).subscribe({
      next: data => (this.modalidades = data),
      error: () => this.mostrarError('Error al cargar modalidades'),
    });
  }

  private cargarParalelos(): void {
    const call = this.isAdmin
      ? this.svc.getAllParalelo()
      : this.svc.listarParalelo(this.empleadoId, this.filtros.idPeriodo, this.filtros.idModalidad, this.filtros.idCurso);
    call.pipe(takeUntil(this.destroy$)).subscribe({
      next: data => (this.paralelos = data),
      error: () => this.mostrarError('Error al cargar paralelos'),
    });
  }

  private cargarAsignaturas(): void {
    const call = this.isAdmin
      ? this.svc.getAllAsignatura()
      : this.svc.listarAsignatura(this.empleadoId, this.filtros.idPeriodo, this.filtros.idModalidad, this.filtros.idCurso, this.filtros.idParalelo);
    call.pipe(takeUntil(this.destroy$)).subscribe({
      next: data => (this.asignaturas = data),
      error: () => this.mostrarError('Error al cargar asignaturas'),
    });
  }

  private limpiarDatosDependientes(): void {
    this.estudiantes = [];
    this.asignaturas = [];
    this.cursos = [];
    this.paralelos = [];
    this.botonReportes = false;
    this.showDialog = false;
  }

  onPeriodo(id: number): void {
    this.limpiarDatosDependientes();
    this.filtros.seleccionarPeriodo(id);
    if (id === 0) return;
    this.cargarModalidades();
  }

  onModalidad(id: number): void {
    this.limpiarDatosDependientes();
    this.filtros.seleccionarModalidad(id);
    if (id === 0) return;
    this.cargarCursos();
  }

  onCurso(id: number): void {
    this.limpiarDatosDependientes();
    this.filtros.seleccionarCurso(id);
    if (id === 0) return;
    this.cargarParalelos();
  }

  onParalelo(id: number): void {
    this.limpiarDatosDependientes();
    this.filtros.seleccionarParalelo(id);
    if (id === 0) return;
    this.cargarAsignaturas();
  }

  onAsignatura(id: number): void {
    this.showDialog = false;
    this.filtros.seleccionarAsignatura(id);
    this.botonReportes = id > 0;
    if (id === 0) {
      this.estudiantes = [];
      this.botonReportes = false;
      return;
    }
    this.svc.getFiltros(this.filtros.idModalidad, this.filtros.idPeriodo, this.filtros.idParalelo, this.filtros.idAsignatura, this.filtros.idCurso)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: data => {
          this.estudiantes = data;
          if (data.length === 0) {
            this.periodos = [];
            this.modalidades = [];
            this.cursos = [];
            this.paralelos = [];
            this.asignaturas = [];
            this.filtros = new FiltroState();
            this.cargarPeriodos();
          }
        },
        error: () => this.mostrarError('Error al cargar estudiantes'),
      });
  }

  trackById(_index: number, item: any): number {
    return item.id_estudiante ?? item.idAsistencia ?? 0;
  }

  mostrarInfo(id: number): void {
    this.idEstudiante = id;
    this.loadingEstudiante.set(true);

    forkJoin([
      this.svc.getInfoEstudiante(id),
      this.svc.getFechasFaltas(id, this.empleadoId, this.filtros.idAsignatura, this.filtros.idCurso, this.filtros.idParalelo, this.filtros.idModalidad, this.filtros.idPeriodo),
    ]).pipe(takeUntil(this.destroy$)).subscribe({
      next: ([info, faltas]) => {
        this.estudianteInfo = info;
        this.fechasFaltas = faltas;
        this.showDialog = true;
        this.loadingEstudiante.set(false);
      },
      error: () => {
        this.mostrarError('Error al obtener información del estudiante');
        this.loadingEstudiante.set(false);
      },
    });
  }

  reporteCurso(): void {
    if (!this.validarRangoCurso) {
      this.mostrarError('Seleccione un rango de fechas válido');
      return;
    }
    const inicio = new Date(this.fechaInicioStr);
    const fin = new Date(this.fechaFinStr);
    this.svc.exportInvoiceCurso(this.filtros.idModalidad, this.filtros.idPeriodo, this.filtros.idParalelo, this.filtros.idAsignatura, this.filtros.idCurso, this.empleadoId, this.auth.usuario().id_usuario, inicio, fin)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: data => window.open(URL.createObjectURL(new Blob([data], { type: 'application/pdf' }))),
        error: () => this.mostrarError('Error al generar reporte del curso'),
      });
  }

  reporteIndividual(): void {
    if (!this.validarRangoIndi) {
      this.mostrarError('Seleccione un rango de fechas válido');
      return;
    }
    const inicio = new Date(this.fechaInicioStrIndi);
    const fin = new Date(this.fechaFinStrIndi);
    this.svc.exportInvoice(this.idEstudiante, this.empleadoId, this.filtros.idAsignatura, this.auth.usuario().id_usuario, inicio, fin)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: data => window.open(URL.createObjectURL(new Blob([data], { type: 'application/pdf' }))),
        error: () => this.mostrarError('Error al generar reporte individual'),
      });
  }

  onSelectFechaInicioCurso(): void {
    this.fechaInicioStr = this.fechaInicio.value ?? '';
    this.fechaFinStr = this.fechaFin.value ?? '';
    this.validarRango(this.fechaInicioStr, this.fechaFinStr, 'curso');
    this.showFechaFinCurso = true;
  }

  onSelectFechaFinCurso(): void {
    this.fechaInicioStr = this.fechaInicio.value ?? '';
    this.fechaFinStr = this.fechaFin.value ?? '';
    this.validarRango(this.fechaInicioStr, this.fechaFinStr, 'curso');
  }

  onSelectFechaInicioIndi(): void {
    this.fechaInicioStrIndi = this.fechaInicioIndi.value ?? '';
    this.fechaFinStrIndi = this.fechaFinIndi.value ?? '';
    this.validarRango(this.fechaInicioStrIndi, this.fechaFinStrIndi, 'indi');
    this.showFechaFinIndi = true;
  }

  onSelectFechaFinIndi(): void {
    this.fechaInicioStrIndi = this.fechaInicioIndi.value ?? '';
    this.fechaFinStrIndi = this.fechaFinIndi.value ?? '';
    this.validarRango(this.fechaInicioStrIndi, this.fechaFinStrIndi, 'indi');
  }

  private validarRango(inicio: string, fin: string, tipo: 'curso' | 'indi'): void {
    const dInicio = new Date(inicio);
    const dFin = new Date(fin);
    if (dInicio > dFin) {
      if (tipo === 'curso') this.validarRangoCurso = false;
      else this.validarRangoIndi = false;
      this.mostrarError('La fecha inicial debe ser menor o igual a la fecha final');
    } else {
      if (tipo === 'curso') this.validarRangoCurso = true;
      else this.validarRangoIndi = true;
    }
  }

  private mostrarError(mensaje: string): void {
    setTimeout(() => {
      this.msg.add({ severity: 'error', summary: 'Error', detail: mensaje });
    }, 500);
  }
}
