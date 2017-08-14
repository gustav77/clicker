// import {describe, expect, it} from 'angular2/testing';
import {vector_add, vector_addPolar, vector_fromPolar, vector_distance,
  gradToRad, radToGrad, vector_equals, vector_translate_rotate_scale, vector_phi,
    vector_isZero, vector_nearBy, vector_norm, vector_mitAbstand_aufMittelpunktStrecke,
    vector_getLength, vector_setLength, Vector} from './vector';
// export function main() {
//  'use strict';
  describe('Vector', () => {
  it('convert to JSON', () => {
    let v: Vector = {x: 8, y: 1};
    let json: string = JSON.stringify(v);
    // // console.log(json);
    let v2: Vector = JSON.parse(json);
    expect(v).toEqual(v2);
  });
  it('should have x and y in constructor', () => {
    let p: Vector = {x: 3, y: 7};

    expect(p.x).toEqual(3);
    expect(p.y).toEqual(7);

  });
  it('Abstand (7,0) von (0,0) sollte 7 sein', () => {
    let s: Vector = {x: 7, y: 0};
    let z: Vector = {x: 0, y: 0};

    expect(vector_distance(s, z)).toEqual(7);
  });
  it('Abstand (0,13) von (20,13) sollte 20 sein', () => {
    let s: Vector = {x: 0, y: 13};
    let z: Vector = {x: 20, y: 13};

    expect(vector_distance(s, z)).toEqual(20);
  });

  it('Abstand A nach B = Abstand B nach A', () => {
    let a: Vector = {x: 10, y: 15};
    let b: Vector = {x: 0, y: 5};

    expect(vector_distance(a, b)).toEqual(vector_distance(b, a));
  });
  it('Abstand -A nach -B = Abstand -B nach -A', () => {
    let a: Vector = {x: -10, y: -15};
    let b: Vector = {x: 0, y: -5};

    expect(vector_distance(a, b)).toEqual(vector_distance(b, a));
  });
  it('vector_add kommutativ', () => {
    let a: Vector = {x: 10, y: -15};
    let b: Vector = {x: 0, y: 5};

    expect(vector_add(a, b)).toEqual(vector_add(b, a));
  });
  it('(7,8).add((31, -6)) sollte (38,2) sein', () => {
    let p1: Vector = {x: 7, y: 8};
    let p2: Vector = {x: 31, y: -6};

    expect(vector_add(p1, p2)).toEqual({x: 38, y: 2});
  });
  it ('0 rad == 0 grad', () => {
    expect(radToGrad(0)).toBeCloseTo(0, 10);
    expect(gradToRad(0)).toBeCloseTo(0, 10);
  });
  it ('pi rad == 180 grad', () => {
    expect(radToGrad(Math.PI)).toBeCloseTo(180, 10);
    expect(gradToRad(180)).toBeCloseTo(Math.PI, 10);
  });
  it ('PI / 4 rad === 45 grad', () => {

    expect(radToGrad(Math.PI / 4)).toEqual(45);
    expect(gradToRad(45)).toEqual(Math.PI / 4);
  });
  it ('7*PI / 4 rad === 315 grad', () => {

    expect(radToGrad(7 * Math.PI / 4)).toEqual(315);
    expect(gradToRad(315)).toEqual(7 * Math.PI / 4);
  });
  it ('polarkoordinaten(90,6) entspricht kartesisch (0,6)', () => {
    let p: Vector = vector_fromPolar(90, 6);
    expect(p.x).toBeCloseTo(0.0, 10);
    expect(p.y).toBeCloseTo(6, 10);
  });
  it ('polarkoordinaten(180,6) entspricht kartesisch (-6,0)', () => {
    let p: Vector = vector_fromPolar(180, 6);
    expect(p.x).toBeCloseTo(-6, 10);
    expect(p.y).toBeCloseTo(0, 10);
  });
  it ('polarkoordinaten(270,6) entspricht kartesisch (0,-6)', () => {
    let p: Vector = vector_fromPolar(270, 6);
    expect(p.x).toBeCloseTo(0, 10);
    expect(p.y).toBeCloseTo(-6, 10);
  });
  it('add polarkoordinaten', () => {
    let p: Vector = {x: -7, y: 15};
    let p2: Vector = vector_addPolar(p, 90, 7);
    expect(p2.x).toEqual(-7);
    expect(p2.y).toEqual(22);
  });

  it('addPolar(90,10)', () => {
    let p: Vector = {x: 0, y: 0};
    let p2: Vector = vector_addPolar(p, 90, 10);
    expect(p2.x).toBeCloseTo(0, 10);
    expect(p2.y).toBeCloseTo(10, 10);
  });
  it('addPolar(0,10)', () => {
    let p: Vector = {x: 0, y: 0};
    let p2: Vector = vector_addPolar(p, 0, 10);
    expect(p2.x).toBeCloseTo(10, 10);
    expect(p2.y).toBeCloseTo(0, 10);
  });
  it('polar koord winkel soll pi/2 sein für (0, 17)', () => {
    let p: Vector = {x: 0, y: 17};

    expect(vector_phi( p )).toEqual(Math.PI / 2);
  });
  it('polar koord winkel soll -Pi/2 sein für (0, -17)', () => {
    let p: Vector = {x: 0, y: -17};

    expect(vector_phi( p )).toEqual(-Math.PI / 2);
  });
  it('Polarkoordinaten zu kartesisch', () => {
    let p: Vector = {x: 1, y: -1};
//    expect(p.r()).toEqual(Math.sqrt(2));
    expect(vector_phi( p )).toEqual(-Math.PI / 4);

    let p1: Vector = {x: 1, y: 1};
//    expect(p1.r()).toEqual(Math.sqrt(2));
    expect(vector_phi( p1 )).toEqual(Math.PI / 4);

    let p2: Vector = {x: -1, y: -1};
//    expect(p2.r()).toEqual(Math.sqrt(2));
    expect(vector_phi( p2 )).toEqual(-3 * Math.PI / 4);
  });

  it('always equals to itself', () => {
    let v: Vector = {x: 7, y: 14};
    expect(vector_equals(v, v)).toBe(true);
  });

  it('always equals if same x and y', () => {
    let v: Vector = {x: 7, y: 14};
    let v2: Vector = {x: 7, y: 14};
    expect(vector_equals(v, v2)).toBe(true);
  });
  it('never equals if x,y differ', () => {
    let v: Vector = {x: 7, y: 14};
    let v2: Vector = {x: 6, y: 1};
    expect(vector_equals(v, v2)).toBe(false);
  });
  it('translates with (0,0) stays the same', () => {
    let v: Vector = {x: 62, y: 1};
    let translator: Vector = {x: 0, y: 0};
    expect(vector_equals(vector_translate_rotate_scale(v, translator, 1, 0), v)).toBe(true);
  });
  it('scales with 0 results to zero Vector', () => {
    let v: Vector = {x: 62, y: 1};
    let translator: Vector = {x: 0, y: 0};
    let scale: number = 0;
    expect(vector_isZero(vector_translate_rotate_scale(v, translator, scale, 0))).toBe(true);
  });
  it('rotates with pi/2 clockwise', () => {
    let v: Vector = {x: 62, y: 0};
    let noTranslation: Vector = {x: 0, y: 0};
    let noScale: number = 1;
    let rotation: number = Math.PI / 2;
    let v2: Vector = {x: 0, y: -62};
    expect(vector_nearBy(vector_translate_rotate_scale(v, noTranslation, noScale, rotation), v2)).toBe(true);
    rotation = Math.PI;
    v2 = {x: -62, y: 0};
    expect(vector_nearBy(vector_translate_rotate_scale(v, noTranslation, noScale, rotation), v2)).toBe(true);
  });

  it('vector_add vector_fromPolar', () => {
    let center: Vector = {x: 10, y: 50};
    let A: Vector = {x: 10, y: 60};
    let a: Vector = vector_add(vector_fromPolar(Math.PI / 2, 10, true), center);
    expect(a).toEqual(A);
  });

  it('länge des norm vectors ist 1', () => {
    let v: Vector = {x: -8.3, y: 17.1};
    expect(vector_getLength(vector_norm(v))).toBeCloseTo(1, 2);

    let v2: Vector = {x: 8, y: 17};
    expect(vector_getLength(vector_norm(v2))).toBeCloseTo(1, 2);
  });
  it('setlänge eines vectors', () => {
    let v: Vector = {x: -8.3, y: 17.1};
    expect(vector_getLength(vector_setLength(7, v))).toBeCloseTo(7, 4);

  });
  it('setlänge eines vectors 2', () => {
    let v: Vector = {x: 0, y: 10};
    expect(vector_getLength(vector_setLength(1, v))).toBeCloseTo(1, 6);

  });
  it('creates Senkrechte auf strecke', () => {
    let a: Vector = {x: 0, y: 0};
    let b: Vector = {x: 2, y: 0};
    let s: Vector = vector_mitAbstand_aufMittelpunktStrecke(a, b);
    expect(s).toEqual({x: 1, y: 1});
    let s2: Vector = vector_mitAbstand_aufMittelpunktStrecke(a, b, 7, false);
    expect(s2.x).toBeCloseTo(1, 7);
    expect(s2.y).toBeCloseTo(0, -7);

    /*let c = {x: 0,10);
    let d = {x: 0,0);
    let s3  = vector_mitAbstand_aufMittelpunktStrecke(c,d,1,false);
    expect(s3).toEqual({x: 1,5));*/
  });
});
// }
