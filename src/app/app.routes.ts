import { Routes } from '@angular/router';
import { ListarAsistenciaComponent } from './pages/listar-asistencia/listar-asistencia.component';
import { RegistrarAsistenciaComponent } from './pages/registrar-asistencia/registrar-asistencia.component';

export const routes: Routes = [
  { path: '', redirectTo: 'asistencia/listar', pathMatch: 'full' },
  {
    path: 'asistencia',
    children: [
      { path: 'listar', component: ListarAsistenciaComponent },
      { path: 'registrar', component: RegistrarAsistenciaComponent },
      { path: '**', redirectTo: 'listar' },
    ],
  },
  { path: '**', redirectTo: 'asistencia/listar' },
];
