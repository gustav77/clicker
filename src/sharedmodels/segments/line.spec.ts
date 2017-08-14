// import {it, describe, expect} from 'angular2/testing';

import {Line, quadratic, line_fromLineCutHead, line_fromLineCutTail, line_fromLineAbBis} from './line';
import {vector_distance, Vector, vector_equals} from './vector';
import {ANZAHL_PUNKTE_PRO_EINHEIT} from './spur';
// export function main() {
//  'use strict';
  describe('Line', () => {
  it('should have start and end in constructor', () => {
    let p: Vector = {x: 3, y: 7};
    let p2: Vector = {x: 77, y: -11};
    let l: Line = new Line('', p, p2, undefined, undefined);

    expect(l.start()).toEqual(p);
    expect(l.end()).toEqual(p2);
    expect(l.anzahlPunkte()).toBeCloseTo(Math.round(l.spurLaenge() * ANZAHL_PUNKTE_PRO_EINHEIT) + 1, 3);
  });

  it('should have length defined', () => {
    let p: Vector = {x: 3, y: 7};
    let p2: Vector = {x: 77, y: -11};
    let l: Line = new Line('', p, p2, undefined, undefined);

    expect(l.spurLaenge).toBeDefined();
  });
  it('length of line should be distance between start and end', () => {
    let p: Vector = {x: 0, y: 0};
    let p2: Vector = {x: 20, y: 60};
    let l: Line = new Line('', p, p2, undefined, undefined);

    expect(vector_distance(p, p2)).toBeCloseTo(l.spurLaenge(), 6);
  });

  it('should have traveltime defined', () => {
    let l: Line = new Line('', null, null, undefined, undefined);
    expect(l.traveltime).toBeDefined();
  });

  it('traveltime should be 1 if speed = line.length', () => {
    let p: Vector = {x: 3, y: 7};
    let p2: Vector = {x: 77, y: -11};
    let l: Line = new Line('', p, p2, undefined, undefined);
    let speed: number = l.spurLaenge();
    expect(l.traveltime(speed)).toEqual(1);
  });

  it('traveltime should be 3 if speed = 0.33 * line.length', () => {
    let p: Vector = {x: 3, y: 7};
    let p2: Vector = {x: 77, y: -11};
    let l: Line = new Line('', p, p2, undefined, undefined);
    let speed: number = l.spurLaenge() / 3;
    expect(l.traveltime(speed)).toEqual(3);
  });

  it('länge bei negativen koordinaten', () => {
    let a: Vector = {x: -1, y: -1};
    let b: Vector = {x: 1, y: 1};
    let l: Line = new Line('', a, b, undefined, undefined);

    expect(l.spurLaenge()).toBeCloseTo(2 * Math.sqrt(2), 4);
  });

  it('anfang und end punkt liegt auf linie', () => {
    let a: Vector = {x: -12, y: 1.07};
    let b: Vector = {x: 10, y: -10.78};
    let l: Line = new Line('', a, b, undefined, undefined);
    expect(l.liegtAufLinie(a)).toBe(true);
    expect(l.liegtAufLinie(b)).toBe(true);
  });
  it('anfang und end punkt liegt auf linie', () => {
    let a: Vector = {x: 0, y: 0};
    let b: Vector = {x: 10, y: 10};
    let c: Vector = {x: 8, y: -7};
    let d: Vector = {x: 5, y: 5};
    let l: Line = new Line('', a, b, undefined, undefined);
    expect(l.liegtAufLinie(d)).toBe(true);
    expect(l.liegtAufLinie(c)).toBe(false);
  });
  it('lineAb, lineBis', () => {
    let a: Vector = {x: 0, y: 0};
    let b: Vector = {x: 10, y: 10};
    let d: Vector = {x: 5, y: 5};
    let l: Line = new Line('', a, b, undefined, undefined);

    let lineAb: Line = l.getLineAb(d);
    let lineBis: Line = l.getLineBis(d);

    expect(lineAb.start()).toBe(d);
    expect(lineBis.end()).toBe(d);

    expect(lineAb.spurLaenge() + lineBis.spurLaenge()).toBeCloseTo(l.spurLaenge(), 4);

  });

  it('line = line wenn start und end gleich sind', () => {
    let a: Vector = {x: 0, y: 0};
    let b: Vector = {x: 10, y: 10};
    let d: Vector = {x: 5, y: 5};
    let l1: Line = new Line('', a, b, undefined, undefined);
    let l2: Line = new Line('', a, b, undefined, undefined);
    let l3: Line = new Line('', a, d, undefined, undefined);

    expect(l1.equals(l2)).toBe(true);
    expect(l3.equals(l1)).toBe(false);

  });

  it('calculate steigung', () => {
    let a: Vector = {x: 0, y: 0};
    let b: Vector = {x: 10, y: 10};
    let l: Line = new Line('', a, b, undefined, undefined);
    expect(l.steigung()).toEqual(1);
  });
  it('calculate steigung 2', () => {
    let a: Vector = {x: 0, y: 0};
    let b: Vector = {x: 10, y: 0};
    let l: Line = new Line('', a, b, undefined, undefined);
    expect(l.steigung()).toEqual(0);
  });
  it('calculate steigung 3', () => {
    let a: Vector = {x: 10, y: 0};
    let b: Vector = {x: 10, y: 10};
    let l: Line = new Line('', a, b, undefined, undefined);
    expect(l.steigung()).toBeUndefined();
  });
  it('calculate steigung 4', () => {
    let a: Vector = {x: 0, y: 0};
    let b: Vector = {x: -10, y: 10};
    let l: Line = new Line('', a, b, undefined, undefined);
    expect(l.steigung()).toEqual(-1);
  });
  it('Mittelsenkrechte', () => {
    let a: Vector = {x: 0, y: 0};
    let b: Vector = {x: 10, y: 10};
    let l: Line = new Line('', a, b, undefined, undefined);
    expect(l.mittelSenkrechte(0)).toEqual(10);
    expect(l.mittelSenkrechte(10)).toEqual(0);
  });
  it('löst quadratische Gleichung', () => {
    // x*x - 4x = 0 => p = -4, q = 0
    expect(quadratic(-4, 0)).toEqual({'l1': 4, 'l2': 0});

    //
    expect(quadratic(2, -8)).toEqual({'l1': 2, 'l2': -4});
  });
  it('cut', () => {
    let a: Vector = {x: 0, y: 0};
    let b: Vector = {x: 10, y: 10};
    let l: Line = new Line('', a, b, undefined, undefined);
    let cutpunkt: Vector = {x: 5, y: 5};
    let cut: any = l.cut(cutpunkt);
    expect(vector_distance(cut.vorne.end(), cutpunkt)).toEqual(0);
    expect(vector_distance(cut.hinten.start(), cutpunkt)).toEqual(0);
  });
  it('am Kopf kürzen', () => {
    let a: Vector = {x: 0, y: 0};
    let b: Vector = {x: 3, y: 4};
    let l: Line = new Line('', a, b, undefined, undefined);
    let short: Line = line_fromLineCutHead(2, l);
    expect( short.spurLaenge() ).toBeCloseTo(3, 4);
  });
  it('hinten kürzen', () => {
    let a: Vector = {x: 0, y: 0};
    let b: Vector = {x: 3, y: 4};
    let l: Line = new Line('', a, b, undefined, undefined);
    let short: Line = line_fromLineCutTail(2, l);
    expect( short.spurLaenge() ).toBeCloseTo(3, 4);
  });
  it('line_fromLineAbBis', () => {
    let start: Vector = {x: 0, y: 0};
    let end: Vector = {x: 100, y: 0};
    let l: Line = new Line('', start, end, undefined, undefined);
    let nl: Line = line_fromLineAbBis(10, 30, 'links', l, 0);
    expect(vector_equals(nl.start(), {x: 10, y: 0})).toBe(true);
    expect(vector_equals(nl.end(), {x: 30, y: 0})).toBe(true);
  });

});
// }
