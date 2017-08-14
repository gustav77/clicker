import {Pipe, PipeTransform} from '@angular/core';

@Pipe({ name: 'decimalPipe', pure: false })
export class DecimalPipe implements PipeTransform {
  public transform(value: number): string {

    return this.formatTime(Math.round(value * 100) / 100);

  }
  private formatTime(t: number): string {
    let min: number = Math.floor(t / 60);
    let sec: number = t % 60;
    let secstr: string = sec < 10 ? '0' + sec.toString() : sec.toString();
    return +min + ':' + secstr.substr(0, 5);
  }
}
