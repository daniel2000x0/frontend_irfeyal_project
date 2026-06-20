import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AsistenciaService } from './asistencia.service';
import { FiltroState } from '../dto';

@Injectable({ providedIn: 'root' })
export class ReporteService {
  constructor(private svc: AsistenciaService) {}

  generarReporteCurso(
    filtros: FiltroState,
    empleadoId: number,
    idUsuario: number,
    fechaInicio: Date,
    fechaFin: Date,
  ): Observable<ArrayBuffer> {
    return this.svc.exportInvoiceCurso(
      filtros.idModalidad,
      filtros.idPeriodo,
      filtros.idParalelo,
      filtros.idAsignatura,
      filtros.idCurso,
      empleadoId,
      idUsuario,
      fechaInicio,
      fechaFin,
    );
  }

  generarReporteIndividual(
    idEstudiante: number,
    empleadoId: number,
    idAsignatura: number,
    idUsuario: number,
    fechaInicio: Date,
    fechaFin: Date,
  ): Observable<ArrayBuffer> {
    return this.svc.exportInvoice(idEstudiante, empleadoId, idAsignatura, idUsuario, fechaInicio, fechaFin);
  }

  abrirPDF(data: ArrayBuffer): void {
    window.open(URL.createObjectURL(new Blob([data], { type: 'application/pdf' })));
  }
}
