'use strict';
import {vector_fromPolar, vector_subtract, vector_distance, vector_phi,
        position_add } from './vector';
import {Vector, Position} from './vector';
import {Segment, ECKE, RECHTE_HAND, LINKE_HAND } from './segment';
import {ANZAHL_PUNKTE_PRO_EINHEIT} from './spur';
import {Gang} from './gang';
export class Ecke extends Segment {
  private _radius: number;
  private _zentrum: Vector;
  private _quadrant: number;
  private _punkte: Position[];
  constructor(comment: string, radius: number, zentrum: Vector, gang: Gang, stellung: string, quadrant: number,
              _start: Vector, _end: Vector, _hand: string) {
    super(comment, _start, _end, ECKE, gang, stellung, _hand);
    this._radius = radius;
    this._zentrum = zentrum;
    this._quadrant = quadrant;
    if (!zentrum)
      throw new Error('Ecke needs Zentrum');
  }
  public toJSON(): any {
    return { _comment: this.comment(), _radius: this.radius(), _zentrum: this.zentrum(), _quadrant: this._quadrant,
              _start: this.start(), _end: this.end(), _hand: this.hand(),
              class: ECKE, _gang: this.gang(), _stellung: this.stellung() };

  }
  public laenge(): number {
    return 0.5 * this._radius * Math.PI;
  }
  public zentrum(): Vector {
    return this._zentrum;
  }
  public radius(): number {
    return this._radius;
  }
  public cut(p: Vector): any {
    return undefined;
  }
  public equals(that: Ecke): boolean {
    return (this.start().x === that.start().x) &&
            (this.start().y === that.start().y) &&
            (this.end().x === that.end().x) &&
            (this.end().y === that.end().y) &&
            (this.zentrum().x === that.zentrum().x) &&
            (this.zentrum().y === that.zentrum().y) &&
            this.radius() === that.radius();
  }
  /**
   * lazy, punkte werden nur einmal berechnet und dann gecached
   */
  public punkte(): Position[] {
    let standpunkte: Position[] = [];
    if (!this._punkte) {
      let increment: number;
      if (this.hand() === RECHTE_HAND) {
          increment = -0.01;
      }
      else {
        increment = 0.01;
      }

      let pointer: Vector = vector_subtract(this.start(), this._zentrum);
      let startPhi: number = vector_phi(pointer);
      let nextPunkt: Position = {x: this.start().x, y: this.start().y, direction: 0, hand: this.hand(), stellung: this.stellung(), gang: this.gang()};
      let abstandStartEnd: number = vector_distance(this.start(), this.end());
      standpunkte.push( nextPunkt );
      let phiT: number = startPhi;
      while (1) {
        phiT += increment;
        nextPunkt = position_add(vector_fromPolar(phiT, this._radius, true), this._zentrum);

        if (abstandStartEnd > 0 && vector_distance(this.end(), nextPunkt) <= 1 / ANZAHL_PUNKTE_PRO_EINHEIT) {
          // fertig
          standpunkte.push( {x: this.end().x, y: this.end().y, direction: 0, hand: this.hand(), stellung: this.stellung(), gang: this.gang()} );
          break;
        }
        else if (vector_distance(nextPunkt, standpunkte[standpunkte.length - 1]) >= 1 / ANZAHL_PUNKTE_PRO_EINHEIT) {
          // Abstand zum letzten punkt >= 0.1
          standpunkte.push( {x: nextPunkt.x, y: nextPunkt.y, direction: 0, hand: this.hand(), stellung: this.stellung(), gang: this.gang()} );
        }
        if (phiT >= 0.5 * Math.PI + startPhi || phiT <= -(0.5 * Math.PI - startPhi)) {
          standpunkte.push( {x: this.end().x, y: this.end().y, direction: 0, hand: this.hand(), stellung: this.stellung(), gang: this.gang()} );
          break;
        }
      }

      this._punkte = standpunkte;
    }
    return this._punkte;
  }
}
export function ecke_fromJSON(json: string): Ecke {
  'use strict';
  return ecke_fromObject( JSON.parse(json) );
}
export function ecke_fromObject(tmp: any): Ecke {
  'use strict';
  return new Ecke(tmp._comment, tmp._radius, tmp._zentrum, tmp._gang, tmp._stellung, tmp._quadrant,
                  tmp._start, tmp._end, tmp._hand);
}

export function createEcke(comment: string, _zentrum: Vector, _radius: number, gang: Gang, stellung: string, _quadrant: number, hand: string, name?: string): Ecke {
  'use strict';
  if (_quadrant < 0 || _quadrant > 3)
    return undefined;

  let start: Vector;
  let end: Vector;
  if (hand === LINKE_HAND) {
    switch (_quadrant) {
      case 0:
        start = {x: _zentrum.x + _radius, y: _zentrum.y};
        end = {x: _zentrum.x, y: _zentrum.y + _radius};
        break;
      case 1:
        start = {x: _zentrum.x, y: _zentrum.y + _radius};
        end = {x: _zentrum.x - _radius, y: _zentrum.y};
        break;
      case 2:
        start = {x: _zentrum.x - _radius, y: _zentrum.y};
        end = {x: _zentrum.x, y: _zentrum.y - _radius};
        break;
      case 3:
        start = {x: _zentrum.x, y: _zentrum.y - _radius};
        end = {x: _zentrum.x + _radius, y: _zentrum.y};
        break;
    }
  }
  else {
    switch (_quadrant) {
      case 0:
        end = {x: _zentrum.x + _radius, y: _zentrum.y};
        start = {x: _zentrum.x, y: _zentrum.y + _radius};
        break;
      case 1:
        end = {x: _zentrum.x, y: _zentrum.y + _radius};
        start = {x: _zentrum.x - _radius, y: _zentrum.y};
        break;
      case 2:
        end = {x: _zentrum.x - _radius, y: _zentrum.y};
        start = {x: _zentrum.x, y: _zentrum.y - _radius};
        break;
      case 3:
        end = {x: _zentrum.x, y: _zentrum.y - _radius};
        start = {x: _zentrum.x + _radius, y: _zentrum.y};
        break;
    }
  }
  return new Ecke(comment, _radius, _zentrum, gang, stellung, _quadrant, start, end, hand);
}
