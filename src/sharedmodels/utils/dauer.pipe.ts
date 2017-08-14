import {Pipe, PipeTransform} from '@angular/core';

@Pipe({ name: 'dauerPipe', pure: false })
export class DauerPipe implements PipeTransform {
  public transform(value: number): string {

    return this.formatTime(Math.round(value * 10) / 10);

  }
  private formatTime(t: number): string {
    let min: number = Math.floor(t / 60);
    let sec: number = t % 60;
    let secstr: string = sec < 10 ? '0' + sec.toString() : sec.toString();
    return +min + ':' + secstr.substr(0, 5);
  }
}
