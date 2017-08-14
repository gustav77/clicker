import {Zigzag} from './zigzag';
import {Vector} from './vector';
// export function main() {
//  'use strict';
  describe('Zigzag', () => {
    it('create from Points', () => {
      let v: Vector = {x: 0, y: 0};
      let zz: Zigzag = new Zigzag('', [v], undefined, undefined);
      expect(zz).toBeDefined();
      expect(zz.spurLaenge()).toEqual(0);
    });
    it('spurLaenge', () => {
      let v: Vector = {x: 0, y: 0};
      let v0: Vector = {x: 0, y: 367};
      let v1: Vector = {x: 0, y: 777};
      let zz: Zigzag = new Zigzag('', [v, v0, v1], undefined, undefined, 1);
      expect(zz).toBeDefined();
      expect(zz.spurLaenge()).toBeCloseTo(777, 5);
      expect(zz.start()).toBe(v);
      expect(zz.end()).toBe(v1);
    });
    it('spurLaenge dreiecksungleichung', () => {
      let v: Vector = {x: 0, y: 0};
      let v0: Vector = {x: 3, y: 367};
      let v1: Vector = {x: 0, y: 777};
      let zz: Zigzag = new Zigzag('', [v, v0, v1], undefined, undefined, 0);
      let zz2: Zigzag = new Zigzag('', [v, v1], undefined, undefined, 0);

      expect((zz.spurLaenge() - zz2.spurLaenge()) > 0).toEqual(true);
    });
    it('laenge kürzer mit eckenrundung', () => {
      let v: Vector = {x: 0, y: 0};
      let v0: Vector = {x: 10, y: 0};
      let v1: Vector = {x: 10, y: 10};
      let zz: Zigzag = new Zigzag('', [v, v0, v1], undefined, undefined, 0);
      let zz2: Zigzag = new Zigzag('', [v, v0, v1], undefined, undefined, 1);

      expect((zz.spurLaenge() - zz2.spurLaenge()) > 0).toEqual(true);
    });

  });
// }
