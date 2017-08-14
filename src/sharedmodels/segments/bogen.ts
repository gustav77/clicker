'use strict';
/** Bogen */
import {Segment, BOGEN, RECHTE_HAND, LINKE_HAND} from './segment';
import {Vector, Position, vector_phi} from './vector';
import {Gang} from './gang';
import {vector_subtract, position_add, vector_add, vector_distance, vector_fromPolar, gradToRad, radToGrad,
        vector_rotate, vector_equals, vector_winkel_zwischen } from './vector';
import {ANZAHL_PUNKTE_PRO_EINHEIT} from './spur';

export class Bogen extends Segment {
  // startAngle und endAngle liegen zwischen 0 und 2pi gemessen im Uhrzeigersinn von der positiven x-Achse
  private _center: Vector;
  private _radius: number;
  private _startAngle: number;
  private _punkte: Position[];
  // private _endAngle: number;
  private _grad: number;
  constructor(comment: string, start: Vector, end: Vector, center: Vector, radius: number, startAngle: number,
              grad: number, gang: Gang, stellung: string, _hand?: string, _class: string= BOGEN) {

    super(comment, start, end, _class, gang, stellung, _hand);
    this._center = center;
    this._radius = radius;
    this._startAngle = startAngle;
    // this._endAngle = endAngle;
    this._grad = grad;
    // this._clockwise = hand === Hand.rechteHand;
  }
  public toJSON(): any {
    return { _comment: this.comment(), start: this.start(), end: this.end(), _center: this.center(),
      _radius: this.radius(), _startAngle: this.startAngle(), _grad: this.grad(), _gang: this.gang(),
              _stellung: this.stellung(), _hand: this.hand(), class: this.class() };

  }
  public cut(p: Vector): any {
    let vorne: any;
    let hinten: any;
    return {vorne, hinten};
  }

  public centerAsString(): string {
    if (this._center)
      return this._center.toString();
    else
      return '';
  }
  public center(): Vector {
    return this._center;
  }
  public radius(): number {
    return this._radius;
  }
  public startAngle(): number {
    return this._startAngle;
  }
  public grad(): number {
    return this._grad;
  }
  public punkte(): Position[] {
    if (!this._punkte) {
      let standpunkte: Position[] = [];
      if (!this.hand())
        return undefined;

      let increment: number;
      if (this.hand() === RECHTE_HAND) {
          increment = -0.005;
      }
      else if (this.hand() === LINKE_HAND) {
        increment = 0.005;
      }
      else {
        increment = 0.005;
      }
      let pointer: Vector = vector_subtract(this.start(), this.center());
      let startPhi: number = vector_phi( pointer );
      let nextPunkt: Position = {x: this.start().x, y: this.start().y, direction: 0, hand: this.hand(), stellung: this.stellung(), gang: this.gang()};

      let abstandStartEnd: number = Math.round(1000 * vector_distance(this.start(), this.end())) / 1000;
      let phi: number = 0; // startPhi;
      standpunkte.push( nextPunkt );

      while ( 1 )  {
        phi += increment;
        nextPunkt = position_add(vector_fromPolar(startPhi + phi, this._radius, true), this._center);

        if (Math.abs(phi) >= Math.abs( gradToRad(this._grad) )) {
          standpunkte.push( {x: this.end().x, y: this.end().y, direction: 0, hand: this.hand(), stellung: this.stellung(), gang: this.gang()} );
          break;
        }
        else if ( this._grad < 360 && this.end() ) {
          if (abstandStartEnd > 0 && vector_distance(this.end(), nextPunkt) <= 1 / ANZAHL_PUNKTE_PRO_EINHEIT) {
            // fertig
            standpunkte.push( {x: this.end().x, y: this.end().y, direction: 0, hand: this.hand(), stellung: this.stellung(), gang: this.gang()} );
            break;
          }
          else if (vector_distance(nextPunkt, standpunkte[standpunkte.length - 1]) >= 1 / ANZAHL_PUNKTE_PRO_EINHEIT) {
            // Abstand zum letzten punkt >= 0.1
            standpunkte.push( {x: nextPunkt.x, y: nextPunkt.y, direction: 0, hand: this.hand(), stellung: this.stellung(), gang: this.gang()} );
          }
        }
        else if (vector_distance(nextPunkt, standpunkte[standpunkte.length - 1]) >= 1 / ANZAHL_PUNKTE_PRO_EINHEIT) {
          // Abstand zum letzten punkt >= 0.1
          standpunkte.push( {x: nextPunkt.x, y: nextPunkt.y, direction: 0, hand: this.hand(), stellung: this.stellung(), gang: this.gang()} );
        }

      }
      this._punkte = standpunkte;
    }
    return this._punkte;
  }

  public equals(that: Bogen): boolean {
    return (this.start().x === that.start().x) &&
            (this.start().y === that.start().y) &&
            (this.end().x === that.end().x) &&
            (this.end().y === that.end().y) &&
            (this.center().x === that.center().x) &&
            (this.center().y === that.center().y);
  }
}

export function circleFromPoints(comment: string, start: Vector, center: Vector, hand: string,
                                 gang: Gang, stellung: string, name?: string,
                                 grad?: number, _class?: string): Bogen {
  'use strict';
  if (!grad)
    grad = 360;
  return bogen_fromPoints(comment, start, center, gang, stellung, undefined, hand, name, grad, _class);
}
export function bogen_fromPoints(comment: string, start: Vector, center: Vector, gang: Gang, stellung: string, end?: Vector,
                                 hand?: string, name?: string,
                                 grad?: number, _class: string = BOGEN): Bogen {
  // if (clockwise === undefined) clockwise = true;
  'use strict';
  // // console.log('bogen_fromPoints', start, center, end, grad);
  if (end && Math.abs(vector_distance(start, center) - vector_distance(end, center)) > 0.01) {
    // console.log( 'impossible distances center to start != center to end');
    return undefined;
  }
  else {
    // defaults
    if (!hand)
      hand = RECHTE_HAND;

    if (!grad && start && end && center && vector_equals(start, end)) {
      grad = 360;
    }
    else if (!grad && start && center && end && hand) {
      /*let v1: Vector = vector_subtract(center, start);
      let v2: Vector = vector_subtract(center, end);
      if (hand === RECHTE_HAND)
        grad = 360 - Math.abs(radToGrad(v1.phi() - v2.phi()));
      else
        grad = Math.abs(radToGrad(v2.phi() - v1.phi()));*/
      grad = calcGrad(start, center, end, hand);
    }
    else if (! grad)
      grad = 360;

    let radius: number = vector_distance(center, start);
    let tmp: Vector = vector_subtract(start, center);
    let w1: number = vector_phi( tmp );
    let startAngle: number = w1 < 0 ? -w1 : 2 * Math.PI - w1;
    let w2: number;
    if (!end) {
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
    }

    // w2 = vector_subtract(end, center).phi();
    // let endAngle: number = w2 < 0 ? - w2 : 2 * Math.PI - w2;

    if (startAngle === 2 * Math.PI) startAngle = 0;
    return new Bogen(comment, start, end, center, radius, startAngle, grad, gang, stellung, hand, _class);
  }
}
export function calcGrad(start: Vector, center: Vector, end: Vector, hand: string): number {
  'use strict';
  let v1: Vector = vector_subtract(start, center);
  let v2: Vector = vector_subtract(end, center);
  let rad: number = vector_winkel_zwischen(v1, v2);
  // beide positiv
  if (vector_phi( v1 ) >= 0 && vector_phi( v2 ) >= 0) {
    if (vector_phi( v1 ) < vector_phi( v2 )) {
      if ( hand === LINKE_HAND)
        return radToGrad(rad);
      else
        return radToGrad( 2 * Math.PI - rad);
    }
    else {
      if ( hand === RECHTE_HAND)
        return radToGrad(rad);
      else
        return radToGrad( 2 * Math.PI - rad);
    }
  }
  else if (vector_phi( v1 ) < 0 && vector_phi( v2 ) < 0) {
    if (Math.abs(vector_phi( v1 )) < Math.abs(vector_phi( v2 ))) {
      if ( hand === LINKE_HAND) {
        return radToGrad( 2 * Math.PI - rad);
      }
      else {
        return radToGrad( rad );
      }
    }
    else {
      if ( hand === LINKE_HAND) {
        return radToGrad( 2 * Math.PI - rad);
      }
      else {
        return radToGrad( rad );
      }
    }
  }
  else if (vector_phi( v1 ) >= 0 && vector_phi( v2 ) < 0) {
    if (vector_phi( v1 ) - vector_phi( v2 ) <= Math.PI) {
      if ( hand === LINKE_HAND) {
        return radToGrad( 2 * Math.PI - rad);
      }
      else {
        return radToGrad( rad );
      }
    }
    else {
      if ( hand === RECHTE_HAND) {
        return radToGrad( 2 * Math.PI - rad);
      }
      else {
        return radToGrad( rad );
      }
    }
  }
  else if (vector_phi( v1 ) <= 0 && vector_phi( v2 ) > 0) {
    if (vector_phi( v1 ) - vector_phi( v2 ) <= Math.PI) {
      if ( hand === RECHTE_HAND) {
        return radToGrad( 2 * Math.PI - rad);
      }
      else {
        return radToGrad( rad );
      }
    }
    else {
      if ( hand === LINKE_HAND) {
        return radToGrad( 2 * Math.PI - rad);
      }
      else {
        return radToGrad( rad );
      }
    }
  }
  else
    return 0; // sollte unreachable sein !!!

}
export function bogen_fromJSON(json: string): Bogen {
  'use strict';
  return bogen_fromObject( JSON.parse(json) );
}
export function bogen_fromObject(tmp: any): Bogen {
  'use strict';
  if (tmp._endAngle && ! tmp._grad) {
    tmp._grad = tmp._endAngle - tmp._startAngle;
  }
  if (tmp._grad === 0)
    tmp._grad = 360;
  return new Bogen( tmp._comment, tmp.start, tmp.end, tmp._center,
                    tmp._radius, tmp._startAngle, tmp._grad, tmp._gang, tmp._stellung,
                    tmp._hand, tmp.class);
}
