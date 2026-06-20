import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, forkJoin, takeUntil } from 'rxjs';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { Toolbar } from 'primeng/toolbar';
import { Select } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { ButtonDirective } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { Checkbox } from 'primeng/checkbox';
import { Ripple } from 'primeng/ripple';
import { AsistenciaService } from '../../services/asistencia.service';
import { AuthService } from '../../services/auth.service';
import { Estudiante } from '../../models/estudiante';
import { Asistencia, Clase } from '../../models/asistencia';
import { Periodo, Modalidad, Curso, Paralelo, Asignatura } from '../../models/catalogo';
import { FiltroState, CrearClaseDto, DestType } from '../../dto';

@Component({
  selector: 'app-registrar-asistencia',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    Toast,
    Toolbar,
    Select,
    TableModule,
    ButtonDirective,
    Dialog,
    Checkbox,
    Ripple,
  ],
  templateUrl: './registrar-asistencia.component.html',
  styleUrl: './registrar-asistencia.component.scss',
  providers: [MessageService, DatePipe],
})
export class RegistrarAsistenciaComponent implements OnInit, OnDestroy {
  loading = signal(false);
  showDiv = false;

  periodos: Periodo[] = [];
  modalidades: Modalidad[] = [];
  cursos: Curso[] = [];
  paralelos: Paralelo[] = [];
  asignaturas: Asignatura[] = [];

  filtros = new FiltroState();
  filtrosActu = new FiltroState();

  estudiantes: Estudiante[] = [];
  estudiantesFaltas: number[] = [];

  claseActual: Clase = this.claseVacia();
  idClaseActual = 0;
  countClase = 0;

  actualizarDialog = false;
  asistenciaActualizar: Asistencia[] = [];

  periodosActu: Periodo[] = [];
  modalidadesActu: Modalidad[] = [];
  cursosActu: Curso[] = [];
  paralelosActu: Paralelo[] = [];
  asignaturasActu: Asignatura[] = [];

  fechaControl = new FormControl('');
  fechaControlActu = new FormControl('');
  fechaSeleccionada = '';
  validaFecha = false;
  validaFechaAct = false;

  filterValue = '';

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
    private router: Router,
    private datePipe: DatePipe,
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
      next: data => {
        this.periodos = data;
        this.periodosActu = data;
      },
      error: () => this.mostrarError('Error al cargar periodos'),
    });
  }

  private cargarCursos(dest: DestType): void {
    const f = dest === 'crear' ? this.filtros : this.filtrosActu;
    const call = this.isAdmin
      ? this.svc.getAllCurso()
      : this.svc.listarCursos(this.empleadoId, f.idPeriodo, f.idModalidad);
    call.pipe(takeUntil(this.destroy$)).subscribe({
      next: data => {
        if (dest === 'crear') this.cursos = data;
        else this.cursosActu = data;
      },
      error: () => this.mostrarError('Error al cargar cursos'),
    });
  }

  private cargarModalidades(dest: DestType): void {
    const f = dest === 'crear' ? this.filtros : this.filtrosActu;
    const call = this.isAdmin
      ? this.svc.getAllModalidad()
      : this.svc.listarModalidad(this.empleadoId, f.idPeriodo);
    call.pipe(takeUntil(this.destroy$)).subscribe({
      next: data => {
        if (dest === 'crear') this.modalidades = data;
        else this.modalidadesActu = data;
      },
      error: () => this.mostrarError('Error al cargar modalidades'),
    });
  }

  private cargarParalelos(dest: DestType): void {
    const f = dest === 'crear' ? this.filtros : this.filtrosActu;
    const call = this.isAdmin
      ? this.svc.getAllParalelo()
      : this.svc.listarParalelo(this.empleadoId, f.idPeriodo, f.idModalidad, f.idCurso);
    call.pipe(takeUntil(this.destroy$)).subscribe({
      next: data => {
        if (dest === 'crear') this.paralelos = data;
        else this.paralelosActu = data;
      },
      error: () => this.mostrarError('Error al cargar paralelos'),
    });
  }

  private cargarAsignaturas(dest: DestType): void {
    const f = dest === 'crear' ? this.filtros : this.filtrosActu;
    const call = this.isAdmin
      ? this.svc.getAllAsignatura()
      : this.svc.listarAsignatura(this.empleadoId, f.idPeriodo, f.idModalidad, f.idCurso, f.idParalelo);
    call.pipe(takeUntil(this.destroy$)).subscribe({
      next: data => {
        if (dest === 'crear') this.asignaturas = data;
        else this.asignaturasActu = data;
      },
      error: () => this.mostrarError('Error al cargar asignaturas'),
    });
  }

  private claseVacia(): Clase {
    return {
      idClase: 0,
      fecClase: '',
      id_modalidad: 0,
      id_periodo: 0,
      idDocente: 0,
      idAsignatura: 0,
      idParalelo: 0,
      idCurso: 0,
    };
  }

  onPeriodo(dest: DestType, id: number): void {
    this.limpiarData(dest);
    const f = dest === 'crear' ? this.filtros : this.filtrosActu;
    f.seleccionarPeriodo(id);
    if (id === 0) return;
    this.cargarModalidades(dest);
    if (dest === 'crear') this.validarHabilitarFecha();
  }

  onModalidad(dest: DestType, id: number): void {
    this.limpiarData(dest);
    const f = dest === 'crear' ? this.filtros : this.filtrosActu;
    f.seleccionarModalidad(id);
    if (id === 0) return;
    this.cargarCursos(dest);
    if (dest === 'crear') this.validarHabilitarFecha();
  }

  onCurso(dest: DestType, id: number): void {
    this.limpiarData(dest);
    const f = dest === 'crear' ? this.filtros : this.filtrosActu;
    f.seleccionarCurso(id);
    if (id === 0) return;
    this.cargarParalelos(dest);
    if (dest === 'crear') this.validarHabilitarFecha();
  }

  onParalelo(dest: DestType, id: number): void {
    this.limpiarData(dest);
    const f = dest === 'crear' ? this.filtros : this.filtrosActu;
    f.seleccionarParalelo(id);
    if (id === 0) return;
    this.cargarAsignaturas(dest);
    if (dest === 'crear') this.validarHabilitarFecha();
  }

  onAsignatura(dest: DestType, id: number): void {
    const f = dest === 'crear' ? this.filtros : this.filtrosActu;
    f.seleccionarAsignatura(id);
    if (dest === 'actu') return;
    this.estudiantesFaltas = [];
    if (id === 0) {
      this.estudiantes = [];
      return;
    }
    this.svc.getFiltros(f.idModalidad, f.idPeriodo, f.idParalelo, f.idAsignatura, f.idCurso)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: data => {
          this.estudiantes = data;
          if (data.length === 0) {
            this.mostrarAdvertencia('No se encontraron registros');
            this.limpiarTodo();
          }
        },
        error: () => this.mostrarError('Error al cargar estudiantes'),
      });
    this.validarHabilitarFecha();
  }

  private validarHabilitarFecha(): void {
    this.showDiv = this.filtros.filtrosActivos();
  }

  onCheckFalta(value: string, checked: boolean): void {
    const id = parseInt(value, 10);
    if (checked) {
      this.estudiantesFaltas.push(id);
    } else {
      const idx = this.estudiantesFaltas.indexOf(id);
      if (idx > -1) this.estudiantesFaltas.splice(idx, 1);
    }
  }

  onValidarFecha(): void {
    const valor = this.fechaControl.value;
    if (!valor) {
      this.validaFecha = false;
      this.mostrarError('Ingrese una fecha');
      return;
    }
    const fechaSel = new Date(valor);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    fechaSel.setHours(0, 0, 0, 0);

    if (fechaSel.getTime() !== hoy.getTime()) {
      this.validaFecha = false;
      this.mostrarError('La fecha debe ser la actual');
      return;
    }
    this.fechaSeleccionada = this.datePipe.transform(valor, "yyyy-MM-dd") + 'T05:00:00.000+00:00';
    this.svc.validarClase(this.empleadoId, this.filtros.idPeriodo, this.filtros.idModalidad, this.filtros.idCurso, this.filtros.idParalelo, this.filtros.idAsignatura, this.fechaSeleccionada)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: data => {
          this.countClase = data;
          this.validaFecha = true;
        },
        error: () => this.mostrarError('Error al validar fecha'),
      });
  }

  submit(): void {
    if (!this.filtros.filtrosActivos() || !this.validaFecha || this.estudiantes.length < 1) {
      this.mostrarAdvertencia('Por favor complete todos los filtros y seleccione una fecha');
      this.fechaControl.setValue('');
      return;
    }

    if (this.countClase > 0) {
      this.fechaControl.setValue('');
      this.mostrarAdvertencia('Ya existe asistencia para esta fecha. Actualice el registro si desea realizar cambios.');
      return;
    }

    this.crearClaseYAguardar();
  }

  private crearClaseYAguardar(): void {
    const dto: CrearClaseDto = {
      idClase: 0,
      fecClase: this.fechaSeleccionada,
      id_periodo: this.filtros.idPeriodo,
      id_modalidad: this.filtros.idModalidad,
      idAsignatura: this.filtros.idAsignatura,
      idParalelo: this.filtros.idParalelo,
      idCurso: this.filtros.idCurso,
      idDocente: this.empleadoId,
    };

    this.svc.createClase(dto)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: clase => {
          this.idClaseActual = clase.idClase;
          this.guardarAsistencias();
        },
        error: () => this.mostrarError('Error al crear la clase'),
      });
  }

  private guardarAsistencias(): void {
    const idsEstudiantes = this.estudiantes.map(e => e.id_estudiante);
    const asistiendo = idsEstudiantes.filter(id => !this.estudiantesFaltas.includes(id));

    const asistencias$ = asistiendo.map(id =>
      this.svc.create({ idAsistencia: 0, estadoAsis: false, idClase: this.idClaseActual, idEstudiante: id })
    );

    const faltas$ = this.estudiantesFaltas.map(id =>
      this.svc.create({ idAsistencia: 0, estadoAsis: true, idClase: this.idClaseActual, idEstudiante: id })
    );

    forkJoin([...asistencias$, ...faltas$])
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.mostrarExito('Asistencia creada con éxito');
          this.router.navigate(['/asistencia/listar']);
        },
        error: () => this.mostrarError('Error al guardar asistencias'),
      });
  }

  actualizar(): void {
    this.actualizarDialog = true;
  }

  buscarActualizar(): void {
    const f = this.filtrosActu;
    if (!f.filtrosActivos() || !this.validaFechaAct) {
      this.mostrarError('Complete todos los filtros y seleccione una fecha');
      return;
    }
    const fecha = this.fechaControlActu.value ?? '';
    this.svc.getFiltrosActualizar(f.idModalidad, f.idPeriodo, f.idParalelo, f.idAsignatura, f.idCurso, fecha, this.empleadoId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: data => {
          this.asistenciaActualizar = data;
          if (data.length === 0) {
            this.mostrarAdvertencia('No se encontraron asistencias');
            this.limpiarActuCompleto();
          }
        },
        error: () => this.mostrarError('Error al buscar asistencias'),
      });
  }

  validaFechaActualizar(): void {
    if (!this.fechaControlActu.value) {
      this.validaFechaAct = false;
      this.mostrarError('Ingrese una fecha');
    } else {
      this.validaFechaAct = true;
    }
  }

  cambioFalta(value: string, checked: boolean): void {
    const id = parseInt(value, 10);
    const asistencia = this.asistenciaActualizar.find(a => a.idAsistencia === id);
    if (!asistencia) return;
    asistencia.estadoAsis = checked;
    this.svc.updateAsistencia(asistencia)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this.mostrarExito('Asistencia actualizada'),
        error: () => this.mostrarError('Error al actualizar asistencia'),
      });
  }

  private limpiarData(dest: DestType): void {
    this.estudiantesFaltas = [];
    this.estudiantes = [];
    if (dest === 'crear') {
      this.asignaturas = [];
      this.cursos = [];
      this.paralelos = [];
    } else {
      this.asignaturasActu = [];
      this.cursosActu = [];
      this.paralelosActu = [];
    }
  }

  private limpiarTodo(): void {
    this.estudiantes = [];
    this.asignaturas = [];
    this.modalidades = [];
    this.cursos = [];
    this.paralelos = [];
    this.estudiantesFaltas = [];
    this.filtros = new FiltroState();
    this.cargarPeriodos();
  }

  private limpiarActuCompleto(): void {
    this.asistenciaActualizar = [];
    this.asignaturasActu = [];
    this.modalidadesActu = [];
    this.cursosActu = [];
    this.paralelosActu = [];
    this.periodosActu = [];
    this.filtrosActu = new FiltroState();
    this.cargarPeriodos();
  }

  trackById(_index: number, item: any): number {
    return item.id_estudiante ?? item.idAsistencia ?? 0;
  }

  private mostrarError(m: string): void {
    setTimeout(() => this.msg.add({ severity: 'error', summary: 'Error', detail: m }), 500);
  }

  private mostrarAdvertencia(m: string): void {
    setTimeout(() => this.msg.add({ severity: 'warn', summary: 'Advertencia', detail: m }), 500);
  }

  private mostrarExito(m: string): void {
    setTimeout(() => this.msg.add({ severity: 'success', summary: 'Éxito', detail: m }), 500);
  }
}
