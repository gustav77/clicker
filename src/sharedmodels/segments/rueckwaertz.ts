/**
 * immutable
 */
import {Segment, RUECKWAERTZ} from './segment';
import {vector_distance, vector_setLength, vector_subtract, position_add } from './vector';
import {Vector, Position} from './vector';
import {ANZAHL_PUNKTE_PRO_EINHEIT} from './spur';
import {Gang} from './gang';
export class Rueckwaertz extends Segment {
  private _punkte: Position[];
  constructor(comment: string, _start: Vector, _end: Vector, gang: Gang, stellung: string) {
    super(comment, _start, _end, RUECKWAERTZ, gang, stellung, undefined);
  }
  public toJSON(): any {
    return {_comment: this.comment(), _start: this.start(), _end: this.end(),
            _gang: this.gang(), _stellung: this.stellung(), class: RUECKWAERTZ};

  }
  /**
   * lazy, punkte werden nur einmal berechnet und dann gecached
   */
  public punkte(): Position[] {
    let standpunkte: Position[] = [];
    if (!this._punkte) {
      if (!this.start() || !this.end())
        return [];

      // let increment: number = 1 / (this.laenge() * ANZAHL_PUNKTE_PRO_EINHEIT * 10); // 0.001;
      // let faktor: number = 0;

      let stepVector: Vector = vector_setLength(1 / ANZAHL_PUNKTE_PRO_EINHEIT, vector_subtract(this.end(), this.start()));
      let nextPunkt: Position = {x: this.start().x, y: this.start().y, direction: 0, hand: this.hand(), stellung: this.stellung(), gang: this.gang()};
      standpunkte.push( nextPunkt );

      do {
        nextPunkt = position_add(nextPunkt, stepVector);
        standpunkte.push( {x: nextPunkt.x, y: nextPunkt.y, direction: 0, hand: this.hand(), stellung: this.stellung(), gang: this.gang()} );
      } while (vector_distance(nextPunkt, this.end()) > 1 / ANZAHL_PUNKTE_PRO_EINHEIT );

      standpunkte.push( {x: this.end().x, y: this.end().y, direction: 0, hand: this.hand(), stellung: this.stellung(), gang: this.gang()} );

      this._punkte = standpunkte;
    }
    return this._punkte;
  }
  // die line von a nach b soll nicht gleich der line von b nach a sein!
  public equals(that: Rueckwaertz): boolean {
    return (this.start().x === that.start().x) &&
            (this.start().y === that.start().y) &&
            (this.end().x === that.end().x) &&
            (this.end().y === that.end().y);
  }

}
export function rueckwaertz_fromJSON(json: string): Rueckwaertz {
  'use strict';
  let tmp: any = JSON.parse(json);
  return rueckwaertz_fromObject(tmp);
}
export function rueckwaertz_fromObject(tmp: any): Rueckwaertz {
  'use strict';
  return new Rueckwaertz(tmp._comment, tmp._start, tmp._end,
                         tmp._gang, tmp._stellung);
}
