import {Segment, PIAFFE} from './segment';
import {Vector, Position} from './vector';
import {Gang} from './gang';
export class Piaffe extends Segment {
  private _dauer: number;
  constructor(comment: string, start: Vector, dauer: number) {
    super(comment, start, start, PIAFFE, undefined, undefined, undefined);
    this._dauer = dauer;
  }
  public punkte(): Position[] {
    return [{x: this.start().x, y: this.start().y, direction: 0, hand: this.hand(), stellung: this.stellung(), gang: this.gang()}];
  }
  public dauer(): number {
    return this._dauer;
  }
  public toJSON(): any {
    return {_comment: this.comment(), _start: this.start(), class: PIAFFE, _dauer: this.dauer()};
  }
  public gang(): Gang {
    return {name: 'Piaffe', speed: 0};
  }
}
export function piaffe_fromJSON(json: string): Piaffe {
  'use strict';
  let tmp: any = JSON.parse(json);
  return piaffe_fromObject(tmp);
}
export function piaffe_fromObject(tmp: any): Piaffe {
  'use strict';
  return new Piaffe(tmp._comment, tmp._start, tmp._dauer);
}
