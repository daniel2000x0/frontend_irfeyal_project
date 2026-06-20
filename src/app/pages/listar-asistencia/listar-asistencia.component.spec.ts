import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListarAsistenciaComponent } from './listar-asistencia.component';
import { AsistenciaService } from '../../services/asistencia.service';
import { AuthService } from '../../services/auth.service';
import { MessageService } from 'primeng/api';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ListarAsistenciaComponent', () => {
  let component: ListarAsistenciaComponent;
  let fixture: ComponentFixture<ListarAsistenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        BrowserAnimationsModule,
        ListarAsistenciaComponent,
      ],
      providers: [AsistenciaService, AuthService, MessageService],
    }).compileComponents();

    fixture = TestBed.createComponent(ListarAsistenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with loading false', () => {
    expect(component.loading()).toBeFalse();
    expect(component.loadingEstudiante()).toBeFalse();
  });

  it('should start with showModalidad true', () => {
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
  });

  it('should reset all filters when periodo is 0', () => {
    component.onPeriodo(0);
    expect(component.filtros.idPeriodo).toBe(0);
    expect(component.filtros.showModalidad).toBeTrue();
  });

  it('should load modalidades when periodo is selected', () => {
    component.onPeriodo(1);
    expect(component.filtros.idPeriodo).toBe(1);
    expect(component.filtros.showModalidad).toBeFalse();
  });

  it('should reset student data on modalidad change to 0', () => {
    component.onModalidad(0);
    expect(component.filtros.idModalidad).toBe(0);
    expect(component.filtros.showModalidad).toBeTrue();
  });

  it('should clear report flags on periodo change', () => {
    component.botonReportes = true;
    component.onPeriodo(1);
    expect(component.botonReportes).toBeFalse();
  });

  it('should handle onCurso with id', () => {
    component.onCurso(5);
    expect(component.filtros.idCurso).toBe(5);
    expect(component.filtros.showParalelo).toBeFalse();
  });

  it('should handle onCurso with 0', () => {
    component.onCurso(0);
    expect(component.filtros.showAsignatura).toBeTrue();
    expect(component.filtros.showParalelo).toBeTrue();
  });

  it('should set showAsignatura false on paralelo select', () => {
    component.onParalelo(3);
    expect(component.filtros.idParalelo).toBe(3);
    expect(component.filtros.showAsignatura).toBeFalse();
  });

  it('should handle paralelo = 0', () => {
    component.onParalelo(0);
    expect(component.filtros.showAsignatura).toBeTrue();
  });

  it('should disable report buttons when asignatura is 0', () => {
    component.onAsignatura(0);
    expect(component.botonReportes).toBeFalse();
    expect(component.estudiantes.length).toBe(0);
  });

  it('should validate date range correctly', () => {
    component.fechaInicioStr = '2026-06-01';
    component.fechaFinStr = '2026-06-19';
    component['validarRango']('2026-06-01', '2026-06-19', 'curso');
    expect(component.validarRangoCurso).toBeTrue();
  });

  it('should reject invalid date range', () => {
    component.fechaInicioStr = '2026-06-19';
    component.fechaFinStr = '2026-06-01';
    component['validarRango']('2026-06-19', '2026-06-01', 'curso');
    expect(component.validarRangoCurso).toBeFalse();
  });

  it('should validate individual date range correctly', () => {
    component['validarRango']('2026-06-01', '2026-06-19', 'indi');
    expect(component.validarRangoIndi).toBeTrue();
  });

  it('should reject invalid individual date range', () => {
    component['validarRango']('2026-06-19', '2026-06-01', 'indi');
    expect(component.validarRangoIndi).toBeFalse();
  });
});
