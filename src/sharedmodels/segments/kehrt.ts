import {Segment, KEHRT} from './segment';
import {Line} from './line';
import { Position, Vector } from './vector';
import { Gang} from './gang';
import { bogen_fromPoints } from './bogen';
export class Kehrt extends Segment {
  private _punkte: Position[];
  private _center: Vector;
  constructor(comment: string, _start: Vector, _end: Vector, _center: Vector, gang: Gang, stellung: string, hand: string) {
    super(comment, _start, _end, KEHRT, gang, stellung, hand);
    this._center = _center;
  }
  public center(): Vector {
    return this._center;
  }
  public punkte(): Position[] {
    if (!this._punkte) {
      let tb = bogen_fromPoints('', this.start(), this._center, this.gang(), '', undefined,
                                this.hand(), '', 180);
      let tl = new Line('', tb.end(), this.end(), undefined, undefined);
      this._punkte = tb.punkte().concat(tl.punkte());
    }
    return this._punkte;
  }
  public toJSON(): any {
    return { comment: this.comment(), start: this.start(), end: this.end(),
             center: this._center, gang: this.gang(), stellung: this.stellung(), hand: this.hand(), class: KEHRT };
  }
}
export function kehrt_fromJSON(json: string): Kehrt {
  'use strict';
  let tmp: any = JSON.parse(json);
  return kehrt_fromObject(tmp);
}
export function kehrt_fromObject(tmp: any): Kehrt {
  'use strict';
  return new Kehrt(tmp.comment, tmp.start, tmp.end, tmp.center,
                   tmp.gang, tmp.stellung, tmp.hand);
}
export function kehrt_fromPoints(comment: string, start: Vector, center: Vector, end: Vector, gang: Gang,
                                 stellung: string, hand: string): Kehrt {
  'use strict';
  return new Kehrt(comment, start, end, center, gang, stellung, hand);
}
