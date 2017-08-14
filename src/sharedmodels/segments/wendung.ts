import {Segment, WENDUNG, RECHTE_HAND, LINKE_HAND} from './segment';
import {Vector, Position} from './vector';
import {vector_subtract, position_add, vector_add, vector_distance, vector_fromPolar,
        vector_phi, gradToRad, vector_rotate} from './vector';
import {ANZAHL_PUNKTE_PRO_EINHEIT} from './spur';
import {Gang} from './gang';

export class Wendung extends Segment {
  private _punkte: Position[];
  private radians: number;
  private _center: Vector;
  // private _radius: number;

  constructor(comment: string, start: Vector, gang: Gang, stellung: string, end?: Vector, center?: Vector, hand?: string, rad?: number, _class?: string) {
    if (! end)
      end = start;
    if (!_class)
      _class = WENDUNG;
    super(comment, start, end, _class, gang, stellung, hand);
    // this._radius = 1;
    if (center)
      this._center = center;
    else
      this._center = start;

    if (!rad)
      this.radians = 2 * Math.PI;
    else
      this.radians = rad;

  }
  /**
   * lazy, punkte werden nur einmal berechnet und dann gecached
   */
  public punkte(): Position[] {
    if (!this._punkte) {
      let standpunkte: Position[] = [];
      if (!this.hand())
        return undefined;

      let increment: number;
      let f: number;
      let rotation: number;

      if (this.hand() === RECHTE_HAND) {
        rotation = Math.PI / 2;
        increment = -0.0005;
        f = 1;
      }
      else if (this.hand() === LINKE_HAND) {
        rotation = -Math.PI / 2;
        increment = 0.0005;
        f = -1;
      }
      else {
        rotation = 0;
        increment = 0.0005;
        f = 1;
      }
      let pointer: Vector = vector_subtract(this.start(), this._center);
      let startPhi: number = vector_phi( pointer );
      let nextPunkt: Position = {x: this.start().x, y: this.start().y, rotation: rotation, direction: 0, hand: this.hand(), stellung: this.stellung(), gang: this.gang()};
      let abstandStartEnd: number = Math.round(1000 * vector_distance(this.start(), this.end())) / 1000;
      standpunkte.push( nextPunkt );

      let phi: number = startPhi;
      let radius: number = vector_distance(this.start(), this._center);
      while ( 1 )  {
        phi += increment;
        nextPunkt = position_add(vector_fromPolar(phi, radius, true), this._center, rotation);

        if (abstandStartEnd > 0 && vector_distance(this.end(), nextPunkt) <= 1 / ANZAHL_PUNKTE_PRO_EINHEIT) {
          // fertig
          standpunkte.push( {x: this.end().x, y: this.end().y, rotation: rotation, direction: 0, hand: this.hand(), stellung: this.stellung(), gang: this.gang()} );
          break;
        }
        else if (vector_distance(nextPunkt, standpunkte[standpunkte.length - 1]) >= 1 / ANZAHL_PUNKTE_PRO_EINHEIT) {
          // Abstand zum letzten punkt >= 0.1
          standpunkte.push( nextPunkt );
        }
        if (phi >= this.radians + startPhi || phi <= -(this.radians - startPhi)) {
          // standpunkte.push(new StandpunktImpl(this.end(), false, 0, undefined, '', f * Math.PI / 2));
          // standpunkte.push(new StandpunktImpl(this.end(), false, 0, undefined, '', f * Math.PI / 2));
          break;
        }

      }
      this._punkte = standpunkte;
    }
    return this._punkte;
  }

  public toJSON(): any {
    return {_comment: this.comment(), _start: this.start(), _end: this.end(), _center: this._center, radians: this.radians,
            hand: this.hand(), class: this.class(), _gang: this.gang(), _stellung: this.stellung() };
  }
}
export function wendung_fromJSON(json: string): Wendung {
  'use strict';
  let tmp: any = JSON.parse(json);
  return wendung_fromObject(tmp);
}
export function wendung_fromObject(tmp: any): Wendung {
  'use strict';
  return new Wendung(tmp._comment, tmp._start, tmp._gang, tmp._stellung, tmp._end, tmp._center,
                     tmp.hand, tmp.radians, tmp.class);
}
export function wendung_fromPoints(comment: string, start: Vector, center: Vector, gang: Gang, stellung: string, hand?: string,
                                   grad?: number, _class?: string): Wendung {
  'use strict';
  if (!grad)
    grad = 360;
  if (!hand)
    hand = RECHTE_HAND;

  let rad: number = gradToRad(grad);
  // let radius: number = vector_distance(center, start);
  let tmp: Vector = vector_subtract(start, center);
  // let w1: number = tmp.phi();
  // let startAngle: number = w1 < 0 ? -w1 : 2 * Math.PI - w1;
  let w2: number;
  let end: Vector;
  if (!grad) {
    end = start;
  }
  else {
    w2 = gradToRad(grad);
    if (hand === LINKE_HAND) {
      w2 = -w2;
    }
    end = vector_add(center, vector_rotate(tmp, w2));
  }

  w2 = vector_phi( vector_subtract(end, center) );
  // let endAngle: number = w2 < 0 ? - w2 : 2 * Math.PI - w2;

  // if (startAngle === 2 * Math.PI) startAngle = 0;
  return new Wendung(comment, start, gang, stellung, end, center, hand, rad, _class);
}
