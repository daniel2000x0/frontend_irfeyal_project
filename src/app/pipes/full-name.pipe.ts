import { Pipe, PipeTransform } from '@angular/core';
import { Persona } from '../models/estudiante';

@Pipe({ name: 'fullName', standalone: true })
export class FullNamePipe implements PipeTransform {
  transform(persona: Persona | null | undefined): string {
    if (!persona) return '';
    return `${persona.nombre} ${persona.apellido}`;
  }
}
