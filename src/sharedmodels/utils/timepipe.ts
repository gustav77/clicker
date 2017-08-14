import {Pipe, PipeTransform} from '@angular/core';

@Pipe({ name: 'timePipe', pure: false })
export class TimePipe implements PipeTransform {
  public transform(value: number, unit?: string): any {
    if (value === undefined)
      return '';
    return this.formatTime(value, unit);
  }
  private formatTime(time: number, unit?: string): string {
    let t: number;
    if (unit === 'ms')
      t = Math.round(time / 1000); // input in millisekunden
    else
      t = time;
    let min: number = Math.floor(t / 60);
    let sec: number = Math.round(t % 60);
    let secstr: string = sec < 10 ? '0' + sec.toString() : sec.toString();
    return +min + ':' + secstr ;
  }
}
