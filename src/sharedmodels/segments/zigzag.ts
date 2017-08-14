import {Segment, ZIGZAG, RECHTE_HAND, LINKE_HAND} from './segment';
import {Vector, Position, vector_phi} from './vector';
import {vector_add, vector_subtract, vector_norm,
        vector_setLength, vector_equals, radToGrad } from './vector';
import {Line, line_fromLineCutTail, line_fromLineCutHead} from './line';
import {Bogen, bogen_fromPoints} from './bogen';
import {Gang} from './gang';

export class Zigzag extends Segment {
  private _punkte: Position[];
  private _eckenradius: number;
  private _zwischenpunkte: Vector[];
  public eckenradius(): number {
    return this._eckenradius;
  }
  constructor(comment: string, zwPunkte: Vector[], gang: Gang, stellung: string, eckenradius: number = 3, name?: string) {
    if (!zwPunkte || zwPunkte.length === 0)
      throw new Error('Zigzag braucht wenigstens einen Punkt');
    super(comment, zwPunkte[0], zwPunkte[zwPunkte.length - 1], ZIGZAG, gang, stellung, undefined);
    this._zwischenpunkte = this.checkZwischenpunkte(zwPunkte);
    this._eckenradius = eckenradius;
  }
  public zwischenpunkte(): Vector[] {
    return this._zwischenpunkte;
  }
  public cut(p: Vector): any {
    return;
  }
  public equals(that: Zigzag): boolean {
    return false;
  }

  public punkte(): Position[] {
    if (this._punkte)
      return this._punkte;

    let segments: Segment[] = [];
    let p: Position[] = [];
    let l: Line;
    let bogenPushedBefore: boolean = false;
    let alpha: number;
    let hand: string = RECHTE_HAND;
    for (let i: number = 1; i < this._zwischenpunkte.length; i++) {
      if (i > 1) {
        let v1: Vector = vector_subtract(this._zwischenpunkte[i - 2], this._zwischenpunkte[i - 1]);
        // // console.log('v1', v1);
        let v2: Vector = vector_subtract(this._zwischenpunkte[i], this._zwischenpunkte[i - 1]);
        // // console.log('v2', v2);
        alpha = vector_phi( v1 ) - vector_phi( v2 );
        // // console.log('alpha first', alpha);
        if (alpha < 0) {
          alpha = 2 * Math.PI + alpha;
          hand = RECHTE_HAND;
        }
        else {
          hand = LINKE_HAND;
        }
        if (alpha > Math.PI) {
          alpha = 2 * Math.PI - alpha;
          hand = RECHTE_HAND;
        }
        else {
          hand = LINKE_HAND;
        }
        // // console.log('alpha', alpha);
        if (alpha < Math.PI && alpha > 0) {
          let winkelhalbierende: Vector = vector_setLength(this._eckenradius / Math.cos( alpha / 2),
                                                           vector_add(vector_norm(v1), vector_norm(v2)));
        // let distanz: number = _eckenradius * Math.sin( alpha / 2);
          let zentrum: Vector = vector_add(this._zwischenpunkte[i - 1], winkelhalbierende);
          // let b: Bogen = bogen_fromPoints(this._zwischenpunkte[i - 1], zentrum, undefined, RECHTE_HAND);
          // p = p.concat(b.punkte());
          let lastLine: Line = <Line>segments.pop();
          let shortendLine: Line = line_fromLineCutTail(this._eckenradius, lastLine);
          // // console.log('shortendLine', shortendLine);
          if (shortendLine) {
            segments.push ( shortendLine );
            let b: Bogen = bogen_fromPoints(this.comment(), shortendLine.end(), zentrum,
                                            undefined, undefined, undefined, hand);
            if (b) {
              segments.push(b);
              bogenPushedBefore = true;
            }
          }
        }
      }
      l = new Line(this.comment(), this._zwischenpunkte[i - 1], this._zwischenpunkte[i], this.gang(), this.stellung());

      if (bogenPushedBefore) {
        bogenPushedBefore = false;
        let b: Bogen = <Bogen>segments.pop();
        let modifiedLine: Line = line_fromLineCutHead(this._eckenradius, l);
        let grad: number = Math.abs(radToGrad(alpha));
        let modifiedBogen: Bogen = bogen_fromPoints(b.comment(), b.start(), b.center(), this.gang(),
                                                    this.stellung(), modifiedLine.start(), b.hand(), undefined , grad );
        // // console.log('modifiedline', modifiedLine);
        // // console.log('alpha', alpha);
        if (modifiedLine)
          segments.push(modifiedBogen);
        if (modifiedBogen)
          segments.push(modifiedLine);
      }
      else {
        if (l)
          segments.push(l);
      }
    }
    /*segments.forEach( (seg) => {
      p = p.concat(seg.punkte());
    });*/
    for (let j: number = 0; j < segments.length; j++) {
      for (let i: number = 0; i < segments[j].punkte().length - 1; i++) {
        p.push(segments[j].punkte()[i]);
      }
      if ( j === segments.length - 1) {
        p.push(segments[j].punkte()[ segments[j].punkte().length - 1]);
      }
    }
    this._punkte = p;
    return this._punkte;
  }
  public toJSON(): any {
    return {_comment: this.comment(), _zwischenpunkte: this._zwischenpunkte, eckenradius: this._eckenradius,
            _gang: this.gang(), _stellung: this.stellung(), class: ZIGZAG};
  }

  private checkZwischenpunkte(zwp: Vector[]): Vector[] {
    let nzw: Vector[] = [];
    if (zwp && zwp.length > 1) {
      for (let i: number = 1; i < zwp.length; i++ ) {
        if (! vector_equals(zwp[i - 1], zwp[i])) {
          nzw.push(zwp[i - 1]);
        }
      }
      nzw.push(zwp[zwp.length - 1]);
    }
    else {
      nzw = zwp;
    }
    return nzw;
  }
}
export function concatZigzag(z1: Zigzag, z2: Zigzag): Zigzag {
  'use strict';
  // console.log('Achtung gang und stellung und comment in concatzigzag');
  return new Zigzag(z1.comment(), z1.zwischenpunkte().concat(z2.zwischenpunkte()), z1.gang(), z1.stellung(), z1.eckenradius());
}
export function zigzag_fromJSON(json: string): Zigzag {
  'use strict';
  let tmp: any = JSON.parse(json);
  return zigzag_fromObject(tmp);
}
export function zigzag_fromObject(tmp: any): Zigzag {
  'use strict';
  let zwp: Vector[] = [];
  if (tmp._zwischenpunkte) {
    for (let i: number = 0; i < tmp._zwischenpunkte.length; i++) {
      zwp.push( tmp._zwischenpunkte[i] );
    }
  }
  return new Zigzag(tmp._comment, zwp, tmp._gang, tmp._stellung, tmp.eckenradius, tmp.name);
}
