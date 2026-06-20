import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistrarAsistenciaComponent } from './registrar-asistencia.component';
import { AsistenciaService } from '../../services/asistencia.service';
import { AuthService } from '../../services/auth.service';
import { MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('RegistrarAsistenciaComponent', () => {
  let component: RegistrarAsistenciaComponent;
  let fixture: ComponentFixture<RegistrarAsistenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        BrowserAnimationsModule,
        RegistrarAsistenciaComponent,
      ],
      providers: [AsistenciaService, AuthService, MessageService, DatePipe],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistrarAsistenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with loading false', () => {
    expect(component.loading()).toBeFalse();
    expect(component.showDiv).toBeFalse();
  });

  it('should start with all filters hidden', () => {
    expect(component.filtros.showModalidad).toBeTrue();
    expect(component.filtros.showCurso).toBeTrue();
    expect(component.filtros.showParalelo).toBeTrue();
    expect(component.filtros.showAsignatura).toBeTrue();
  });

  it('should have empty arrays on init', () => {
    expect(component.periodos.length).toBe(0);
    expect(component.modalidades.length).toBe(0);
    expect(component.cursos.length).toBe(0);
    expect(component.paralelos.length).toBe(0);
    expect(component.asignaturas.length).toBe(0);
    expect(component.estudiantes.length).toBe(0);
    expect(component.estudiantesFaltas.length).toBe(0);
  });

  it('should enable modalidad when periodo > 0', () => {
    component.onPeriodo('crear', 1);
    expect(component.filtros.showModalidad).toBeFalse();
  });

  it('should not show modalidad when periodo is 0', () => {
    component.onPeriodo('crear', 0);
    expect(component.filtros.showModalidad).toBeTrue();
  });

  it('should change curso visibility on modalidad select', () => {
    component.onModalidad('crear', 1);
    expect(component.filtros.showCurso).toBeFalse();
  });

  it('should reset curso on modalidad = 0', () => {
    component.onModalidad('crear', 0);
    expect(component.filtros.showCurso).toBeTrue();
  });

  it('should show paralelo on curso select', () => {
    component.onCurso('crear', 1);
    expect(component.filtros.showParalelo).toBeFalse();
  });

  it('should show asignatura on paralelo select', () => {
    component.onParalelo('crear', 1);
    expect(component.filtros.showAsignatura).toBeFalse();
  });

  it('should clear estudiantesFaltas on asignatura select', () => {
    component.estudiantesFaltas = [1, 2, 3];
    component.onAsignatura('crear', 0);
    expect(component.estudiantesFaltas.length).toBe(0);
  });

  it('should add student to faltas on check', () => {
    component.onCheckFalta('5', true);
    expect(component.estudiantesFaltas).toContain(5);
  });

  it('should remove student from faltas on uncheck', () => {
    component.estudiantesFaltas = [5, 10];
    component.onCheckFalta('5', false);
    expect(component.estudiantesFaltas).not.toContain(5);
    expect(component.estudiantesFaltas).toContain(10);
  });

  it('should not remove non-existent student from faltas', () => {
    component.estudiantesFaltas = [10];
    component.onCheckFalta('5', false);
    expect(component.estudiantesFaltas.length).toBe(1);
  });

  it('should set validaFecha to false when fecha is empty', () => {
    component.fechaControl.setValue('');
    component.onValidarFecha();
    expect(component.validaFecha).toBeFalse();
  });

  it('should set showDiv true when all filters are selected', () => {
    component.filtros.idAsignatura = 1;
    component.filtros.idModalidad = 1;
    component.filtros.idPeriodo = 1;
    component.filtros.idParalelo = 1;
    component.filtros.idCurso = 1;
    component['validarHabilitarFecha']();
    expect(component.showDiv).toBeTrue();
  });

  it('should set showDiv false when filters are incomplete', () => {
    component.filtros.idAsignatura = 0;
    component.filtros.idModalidad = 1;
    component.filtros.idPeriodo = 1;
    component.filtros.idParalelo = 1;
    component.filtros.idCurso = 1;
    component['validarHabilitarFecha']();
    expect(component.showDiv).toBeFalse();
  });

  it('should open update dialog', () => {
    component.actualizar();
    expect(component.actualizarDialog).toBeTrue();
  });

  it('should validate fecha actualizar is empty', () => {
    component.fechaControlActu.setValue('');
    component.validaFechaActualizar();
    expect(component.validaFechaAct).toBeFalse();
  });

  it('should validate fecha actualizar is set', () => {
    component.fechaControlActu.setValue('2026-06-19');
    component.validaFechaActualizar();
    expect(component.validaFechaAct).toBeTrue();
  });

  it('should clean curso data on limpiarData', () => {
    component.estudiantes = [{ id_estudiante: 1, id_persona: { id_persona: 1, nombre: 'Test', apellido: 'User', cedula: '123' } }];
    component.estudiantesFaltas = [1];
    component.asignaturas = [{ id_asignatura: 1, descripcion: 'Math' }];
    component.cursos = [{ id_curso: 1, descripcion: 'First' }];
    component.paralelos = [{ id_paralelo: 1, descripcion: 'A' }];
    component['limpiarData']('crear');
    expect(component.estudiantes.length).toBe(0);
    expect(component.estudiantesFaltas.length).toBe(0);
    expect(component.asignaturas.length).toBe(0);
    expect(component.cursos.length).toBe(0);
    expect(component.paralelos.length).toBe(0);
  });
});
