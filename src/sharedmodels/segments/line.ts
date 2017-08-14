/**
 * immutable
 */
import {Segment, LINE} from './segment';
import {vector_distance, vector_setLength, vector_subtract, vector_add, position_add,
        vector_scalar_multiply } from './vector';
import {Vector, Position} from './vector';
import {ANZAHL_PUNKTE_PRO_EINHEIT} from './spur';
import {Gang} from './gang';
export class Line extends Segment {
  private _punkte: Position[];
  constructor(comment: string, _start: Vector, _end: Vector, gang: Gang, stellung: string) {
    super(comment, _start, _end, LINE, gang, stellung, undefined);
  }
  public toJSON(): any {
    return {_comment: this.comment(), _start: this.start(), _end: this.end(), _gang: this.gang(),
            _stellung: this.stellung(), class: LINE};

  }
  /* private laenge(): number {
    return vector_distance(this.start(), this.end());
  }*/

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
      let nextPunkt: Position = {x: this.start().x, y: this.start().y, gang: this.gang(), stellung: this.stellung(), hand: this.hand()};
      // standpunkte.push( {x: nextPunkt.x, y: nextPunkt.y} );
      standpunkte.push( nextPunkt );
      do {
        nextPunkt = position_add(nextPunkt, stepVector);
        standpunkte.push( nextPunkt );
      } while (vector_distance(nextPunkt, this.end()) > 1 / ANZAHL_PUNKTE_PRO_EINHEIT );

      standpunkte.push( {x: this.end().x, y: this.end().y, gang: this.gang(), stellung: this.stellung()} );

      this._punkte = standpunkte;
    }
    return this._punkte;
  }
  public cut(p: Vector): any {
    let vorne: Line = new Line(this.comment(), this.start(), p, this.gang(), this.stellung());
    let hinten: Line = new Line(this.comment(), p, this.end(), this.gang(), this.stellung());
    return {vorne, hinten};
  }
  public liegtAufLinie(p: Vector): boolean {
    if (this.start().x === this.end().x) {
      if (p.x !== this.start().x)
        return false;
      else {
        let max: number = Math.max(this.start().y, this.end().y);
        let min: number = Math.min(this.start().y, this.end().y);
        return (p.y >= min) && (p.y <= max);
      }
      // senkrechte Linie
    }
    else {
      let steigung: number = (this.end().y - this.start().y) / (this.end().x - this.start().x);
      let t: number = this.start().y - steigung * this.start().x; // Die Verschiebung entlang der y-Achse

      let yP: number = steigung * p.x + t; // Berechne den Sollwert von kP.y

      let toleranz: number = 0.1; // Die erlaubte Abweichung vom Sollwert

      return Math.abs(yP - p.y) <= toleranz; // Ist der Abstand zwischen dem y-Wert des Kontrollpunktes und dem Sollwe
    }
  }

  public getLineAb(p: Vector): Line {
    if (this.liegtAufLinie(p)) {
      return new Line(this.comment(), p, this.end(), this.gang(), this.stellung());
    }
    else {
      return undefined;
    }
  }

  public getLineBis(p: Vector): Line {
    if (this.liegtAufLinie(p)) {
      return new Line(this.comment(), this.start(), p, this.gang(), this.stellung());
    }
    else {
      return undefined;
    }
  }

  // die line von a nach b soll nicht gleich der line von b nach a sein!
  public equals(that: Line): boolean {
    return (this.start().x === that.start().x) &&
            (this.start().y === that.start().y) &&
            (this.end().x === that.end().x) &&
            (this.end().y === that.end().y);
  }
  public mittelPunkt(): Vector {
    return {x: (this.start().x + this.end().x) / 2 , y: (this.start().y + this.end().y) / 2};
  }
  public steigung(): number {
    let dx: number = this.end().x - this.start().x;
    let dy: number = this.end().y - this.start().y;
    if (dx !== 0) {
      return dy / dx;
    }
    else
      return undefined;
  };
  public gerade(x: number, s: number, b: number): number {
    return x * s + b;
  };
  public mittelSenkrechte(x: number): number {
    let m: Vector = this.mittelPunkt();
    let s: number = this.steigung();
    // negativer Kehrwert steigung
    let k: number = s ? -1 / s : 0;
    // y = kx + b => m.y = k m.getX + b => b = m.getY - k m.getX
    let b: number = m.y - k * m.x;
    return this.gerade(x, k, b);
  }

}
export function line_fromJSON(json: string): Line {
  'use strict';
  let tmp: any = JSON.parse(json);
  return line_fromObject(tmp);
}
export function line_fromObject(tmp: any): Line {
  'use strict';
  return new Line(tmp._comment, tmp._start, tmp._end,
                  tmp._gang, tmp._stellung);
}

export function schnittpunkt_kreis_gerade(a: number, b: number, c: number, d: number, r: number): any {
  'use strict';
  // gerade y = ax + b
  // kreis (x-c)(x-c) + (y-d)(y-d) = r*r
  // quadratische Gleichung mit
  //     p = (2ab - 2ad -2c)/(1 + a*a)
  // und q = (b*b + c*c + d*d - r*r - 2bd) / (1 + a*a)

}
export function quadratic(p: number, q: number): any {
  'use strict';
  // allgemeine quadratische Gleichung: x*x + p*x + q = 0
  // hat die Lösung x = -p/2 +/- Wurzel aus (p/2 zum Quadrat - q) sofern p/2 zum Quadrat - q nicht negativ ist.
  let l1: number;
  let l2: number;
  if (p / 2 * p / 2 >= q) {
    l1 = -p / 2 + Math.sqrt((p / 2) * (p / 2) - q);
    l2 = -p / 2 - Math.sqrt((p / 2) * (p / 2) - q);
  }
  return {'l1': l1, 'l2': l2};
}
export function line_fromLineCutTail(diff: number, l: Line): Line {
  'use strict';
  if (l) {
    let v1: Vector = l.start();
    let v2: Vector = l.end();
    let lineVec: Vector = vector_subtract(v2, v1);
    let faktor: number = (l.spurLaenge() - diff) / l.spurLaenge();
    let newEnd: Vector = vector_scalar_multiply(faktor, lineVec);
    return new Line(l.comment(), v1, vector_add(v1, newEnd), l.gang(), l.stellung());
  }
  return undefined;
}
export function line_fromLineCutHead(diff: number, l: Line): Line {
  'use strict';
  if (l) {
    let v1: Vector = l.start();
    let v2: Vector = l.end();
    let lineVec: Vector = vector_subtract(v2, v1);
    let faktor: number = (l.spurLaenge() - diff) / l.spurLaenge();
    let newStart: Vector = vector_scalar_multiply(faktor, lineVec);
    return new Line(l.comment(), vector_subtract(v2, newStart), v2, l.gang(), l.stellung());
  }
  return undefined;
}
export function line_fromLineAbBis(ab: number, bis: number, stellung: string, l: Line, von: number): Line {
  'use strict';
  if (l) {
    let v1: Vector = l.start();
    let v2: Vector = l.end();
    let lineVec: Vector = vector_subtract(v2, v1);
    let faktorHead: number = (l.spurLaenge() - ab) / l.spurLaenge();
    let faktorTail: number = (l.spurLaenge() - bis) / l.spurLaenge();
    let newStart: Vector = vector_scalar_multiply(faktorHead, lineVec);
    let newEnd: Vector = vector_scalar_multiply(faktorTail, lineVec);
    return new Line(l.comment(), vector_subtract(v2, newStart), vector_subtract(v2, newEnd), l.gang(), stellung);
  }
  return undefined;
}
