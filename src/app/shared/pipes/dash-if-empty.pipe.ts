import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dash',
})
export class DashIfEmptyPipe implements PipeTransform {
  transform(value: string | number | undefined | null): string {
    if (typeof value === 'number') {
      return Number.isFinite(value) ? `${value}` : '-';
    }

    return !value ? '-' : value;
  }
}
