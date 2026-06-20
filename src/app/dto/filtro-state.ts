export class FiltroState {
  idPeriodo = 0;
  idModalidad = 0;
  idCurso = 0;
  idParalelo = 0;
  idAsignatura = 0;
  showModalidad = true;
  showCurso = true;
  showParalelo = true;
  showAsignatura = true;

  limpiarCursos(): void {
    this.idCurso = 0;
    this.idParalelo = 0;
    this.idAsignatura = 0;
    this.showCurso = true;
    this.showParalelo = true;
    this.showAsignatura = true;
  }

  seleccionarPeriodo(id: number): void {
    this.idPeriodo = id;
    this.idModalidad = 0;
    this.limpiarCursos();
    this.showModalidad = id === 0;
  }

  seleccionarModalidad(id: number): void {
    this.idModalidad = id;
    this.limpiarCursos();
    this.showCurso = id === 0;
    if (id === 0) {
      this.showModalidad = true;
      this.showParalelo = true;
      this.showAsignatura = true;
    }
  }

  seleccionarCurso(id: number): void {
    this.idCurso = id;
    this.idParalelo = 0;
    this.idAsignatura = 0;
    this.showParalelo = id === 0;
    if (id === 0) {
      this.showCurso = true;
      this.showAsignatura = true;
    }
  }

  seleccionarParalelo(id: number): void {
    this.idParalelo = id;
    this.idAsignatura = 0;
    this.showAsignatura = id === 0;
    if (id === 0) {
      this.showParalelo = true;
    }
  }

  seleccionarAsignatura(id: number): void {
    this.idAsignatura = id;
  }

  filtrosActivos(): boolean {
    return this.idPeriodo > 0
      && this.idModalidad > 0
      && this.idCurso > 0
      && this.idParalelo > 0
      && this.idAsignatura > 0;
  }
}
