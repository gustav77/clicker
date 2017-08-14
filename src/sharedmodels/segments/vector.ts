import {Numerical} from './numerical';
import {Gang} from './gang';
export interface Vector {
  x: number;
  y: number;
  /*public r(): number {
    return this._r ? this._r : this._r = Math.sqrt(this.x * this.x + this.y * this.y);
  }
  public phi(): number {
    return vector_isZero(this) ? this._phi || 0
      : this._phi = Math.atan2(this.y, this.x);

  }

  public isNaN(): boolean {
    return isNaN(this.x) || isNaN(this.y);
  }
  public toString(decimals: number = 2): string {
    let faktor: number = Math.pow(10, decimals);
    let x: number = Math.round(this.x * faktor) / faktor;
    let y: number = Math.round(this.y * faktor) / faktor;
    return '(' + x + '|' + y + ')';
  }

  public toJSON(): any {
      return {x: this.x, y: this.y};
  }*/
}
export interface Position extends Vector {
  rotation?: number;
  hand?: string;
  stellung?: string;
  gang?: Gang;
  direction?: number;
}
export interface Bahnpunkt extends Vector {
  name: string;
}

/*export function vector_fromJSON(json: string): Vector {
  'use strict';
  return vector_fromObject( JSON.parse(json) );
}
export function vector_fromObject(json: any): Vector {
  'use strict';
  return new Vector(json.x, json.y);
}*/
export function vector_phi(v: Vector): number {
  'use strict';
  let ph: number = vector_isZero(v) ?  0
      : Math.atan2(v.y, v.x);
  return ph;
}
export function vector_isZero(v: Vector): boolean {
  'use strict';
  return Numerical.isZero(v.x) && Numerical.isZero(v.y);
}
export function vector_distance(v1: Vector, v2: Vector): number {
  'use strict';
  let xDiff: number = v2.x - v1.x;
  let yDiff: number = v2.y - v1.y;

  return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
}
export function vector_abstand(x1: number, y1: number, x2: number, y2: number): number {
  'use strict';
  return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
}
export function vector_fromPolar(winkel: number, l: number, winkelIsRad: boolean = false): Vector {
  'use strict';
  let w: number;
  if (winkelIsRad) {
    w = winkel;
  } else {
    w = gradToRad(winkel);
  }
  return {x: Math.cos(w) * l, y: Math.sin(w) * l};
}

export function gradToRad(grad: number): number {
  'use strict';
  return Math.PI / 180 * grad;
}

export function radToGrad(rad: number): number {
  'use strict';
  return rad * 180 / Math.PI;
}
export function vector_add(p1: Vector, p2: Vector): Vector {
  'use strict';
  return {x: p1.x + p2.x, y: p1.y + p2.y};
}
export function position_fromPosition(p: Position, rotation?: number, hand?: string, stellung?: string, gang?: Gang, direction?: number): Position {
  'use strict';
  let dir: number = 0;
  let rot: number = 0;
  if (isNaN(direction))
    dir = p.direction;
  else
    dir = direction;
  if (isNaN(rotation))
    rot = p.rotation;
  else
    rot = rotation;
  return {x: p.x, y: p.y,
          rotation: rot,
          hand: hand || p.hand,
          stellung: stellung || p.stellung,
          gang: gang || p.gang,
          direction: dir};
}
export function position_fromPoints(v: Position, next: Position): Position {
  'use strict';

  let rot: number;
  let dir: number;
  let diff: Vector = vector_subtract(next, v);
  if (next.rotation && v.rotation && v.rotation !== next.rotation) {
    dir = vector_phi( diff ) - next.rotation;
  }
  else {
    dir = vector_phi( diff );
  }
  rot = v.rotation;
  // return {position: v, direction: dir, gang: gang, rotation: rot, hand: hand, stellung: stellung};
  return position_fromPosition(v, rot, undefined, undefined, undefined, dir);
}

export function position_add(p1: Position, p2: Vector, rotation?: number): Position {
  'use strict';
  return {x: p1.x + p2.x, y: p1.y + p2.y, rotation: rotation, gang: p1.gang, stellung: p1.stellung};
}
export function vector_addPolar(v: Vector, winkelgrad: number, l: number): Vector {
  'use strict';
  return vector_add(v, vector_fromPolar(winkelgrad, l));
}
export function vector_subtract(v1: Vector, v2: Vector): Vector {
  'use strict';
  return {x: v1.x - v2.x, y: v1.y - v2.y};
}
export function vector_translate_rotate_scale(v: Vector, translator: Vector, scale: number, rotation: number): Vector {
  'use strict';
  let x: number = scale * (v.x + translator.x);
  let y: number = scale * (v.y + translator.y);
  if (Math.abs(rotation) > 1e-6 ) {
    let cos: number = Math.cos(rotation);
    let sin: number = Math.sin(rotation);
    let _x: number = x * cos + y * sin;
    let _y: number = -sin * x + cos * y;
    x = _x;
    y = _y;
  }
  return {x: x, y: y};
}
export function vector_rotate_scale(v: Vector, scale: number, rotation: number): Vector {
  'use strict';
  let x: number = scale * v.x;
  let y: number = scale * v.y;
  if (Math.abs(rotation) > 1e-6 ) {
    let cos: number = Math.cos(rotation);
    let sin: number = Math.sin(rotation);
    let _x: number = x * cos + y * sin;
    let _y: number = -sin * x + cos * y;
    x = _x;
    y = _y;
  }
  return {x: x, y: y};
}
export function vector_rotate(v: Vector, rotation: number): Vector {
  'use strict';
  let x: number = v.x;
  let y: number = v.y;
  if (Math.abs(rotation) > 1e-6 ) {
    let cos: number = Math.cos(rotation);
    let sin: number = Math.sin(rotation);
    let _x: number = x * cos + y * sin;
    let _y: number = -sin * x + cos * y;
    x = _x;
    y = _y;
  }
  return {x: x, y: y};
}
export function  vector_subtractPolar(v: Vector, winkelgrad: number, l: number): Vector {
  'use strict';
  return vector_subtract(v, vector_fromPolar(winkelgrad, l));
}
export function vector_scalar_multiply(s: number, v: Vector): Vector {
  'use strict';
  if (isNaN(s))
    throw new Error('scalar is NaN in vector_scalar_multiply');
  if (!isFinite(s))
    throw new Error('scalar is infinite in vector_scalar_multiply');
  return {x: s * v.x, y: s * v.y};
}
export function vector_nearBy(v1: Vector, v2: Vector): boolean {
  'use strict';
  return vector_distance(v1, v2) < Numerical.EPSILON;
}
/*export function vector_equals(v1: Vector, v2: Vector): boolean {
  'use strict';
  return v1 === v2 || v2
      && (v1.x === v2.x && v1.y === v2.y
        || Array.isArray(v2)
          && v1.x === v2[0] && v1.y === v2[1])
      || false;
}*/
export function vector_equals(v1: Vector, v2: Vector): boolean {
  'use strict';
  return v1 === v2 || (v2.x === v1.x && v2.y === v1.y);
}
export function vector_getLength(v: Vector): number {
  'use strict';
  return Math.sqrt(v.x * v.x + v.y * v.y);
}
export function vector_getAngleInRadians(v: Vector): number {
  'use strict';
  return vector_isZero(v) ? 0
    : Math.atan2(v.y, v.x);
}
export function vector_getAngelInGrad(v: Vector): number {
  'use strict';
  return radToGrad(vector_getAngleInRadians(v));
}
export function vector_norm(v: Vector): Vector {
  'use strict';
  let l: number = vector_getLength(v);
  if (l !== 0)
    return vector_scalar_multiply(1 / l, v);
  else
    return v;
}
export function vector_setLength(laenge: number, v: Vector): Vector {
  'use strict';
  let l: number = vector_getLength(v);
  if (l !== 0)
    return vector_scalar_multiply(laenge / l, v);
  else
    return v;
}
export function vector_mitAbstand_aufMittelpunktStrecke(start: Vector, end: Vector, abstand: number = 1, links: boolean = true): Vector {
  'use strict';
  let strecke: Vector = vector_subtract(end, start);
  let mittelpunkt: Vector = vector_scalar_multiply(0.5, strecke);
  let rot: number;
  if (links)
    rot = -Math.PI / 2;
  else
    rot = Math.PI / 2;
  let ortho: Vector = vector_setLength(abstand, vector_rotate(mittelpunkt, rot));
  return vector_add(mittelpunkt, ortho);
}
export function vector_scalarproduct(v1: Vector, v2: Vector): number {
  'use strict';
  return (v1.x * v2.x) + (v1.y * v2.y);
}
export function vector_winkel_zwischen(v1: Vector, v2: Vector): number {
  'use strict';
  return Math.acos( vector_scalarproduct(v1, v2) / (vector_getLength(v1) * vector_getLength(v2)));
}
