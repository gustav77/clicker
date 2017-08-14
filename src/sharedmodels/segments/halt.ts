import {Segment, HALT} from './segment';
import {Vector, Position} from './vector';
import {Gang} from './gang';
export class Halt extends Segment {
  private _dauer: number;
  constructor(comment: string, start: Vector, dauer: number) {
    super(comment, start, start, HALT, undefined, undefined, undefined);
    this._dauer = dauer;
  }
  public punkte(): Position[] {
    return [{x: this.start().x, y: this.start().y, direction: 0, hand: this.hand(), stellung: this.stellung(), gang: this.gang()}];
  }
  public dauer(): number {
    return this._dauer;
  }
  public toJSON(): any {
    return {_comment: this.comment(), _start: this.start(), class: HALT, _dauer: this.dauer()};
  }
  public gang(): Gang {
    return {name:'Halt', speed: 0};
  }
}
export function halt_fromJSON(json: string): Halt {
  'use strict';
  let tmp: any = JSON.parse(json);
  return halt_fromObject(tmp);
}
export function halt_fromObject(tmp: any): Halt {
  'use strict';
  return new Halt(tmp._comment, tmp._start, tmp._dauer);
}
