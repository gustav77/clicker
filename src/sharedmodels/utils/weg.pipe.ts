import {Pipe, PipeTransform} from '@angular/core';

@Pipe({ name: 'wegPipe', pure: false })
export class WegPipe implements PipeTransform {
  public transform(value: number): string {

    return ' ' + Math.round(value * 100) / 100 + 'm';

  }
}
