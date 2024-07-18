import { Pipe, PipeTransform } from '@angular/core';
import { Filter } from '@shared/models/filter.model';

@Pipe({
  name: 'filterToSpanish',
  standalone: true,
})
export class FilterToSpanishPipe implements PipeTransform {
  transform(value: Filter): string {
    const dictionary = {
      all: 'Todas',
      pending: 'Pendientes',
      completed: 'Completadas',
    };

    return dictionary[value];
  }
}
