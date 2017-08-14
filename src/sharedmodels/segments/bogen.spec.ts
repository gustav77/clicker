import {LINKE_HAND, RECHTE_HAND} from './segment';
import {Bogen, bogen_fromPoints, circleFromPoints, calcGrad} from './bogen';
import {vector_distance, gradToRad, vector_equals, Vector} from './vector';
// export function main() {
//  'use strict';
  describe('Bogen', () => {
    it('nur start und center radius', () => {
      let start: Vector = {x: 1, y: 0};
      let center: Vector = {x: 1, y: 1};
      let b: Bogen = bogen_fromPoints('',start, center, undefined, undefined);
      expect(b.radius()).toEqual(1);
    });
    it('nur start und center startAngle=endAngle', () => {
      let start: Vector = {x: 1, y: 0};
      let center: Vector = {x: 1, y: 1};
      let b: Bogen = bogen_fromPoints('',start, center, undefined, undefined);
      expect(b.grad()).toEqual(360);
    });
    it('nur start und center', () => {
      let start: Vector = {x: 1, y: 0};
      let center: Vector = {x: 1, y: 1};
      let b: Bogen = bogen_fromPoints('',start, center, undefined, undefined);
      expect(b.spurLaenge()).toBeCloseTo(2 * 1 * Math.PI, 2);
    });
    it('circleFromPoints nur start und center', () => {
      let start: Vector = {x: 10, y: 0};
      let center: Vector = {x: 10, y: 10};
      let b: Bogen = circleFromPoints('',start, center, LINKE_HAND, undefined, undefined);
      expect(b.spurLaenge()).toBeCloseTo(2 * 10 * Math.PI, 2);
    });
    /*it ('should throw exception if center on wrong place', () => {
      let a: Vector = {x: 11, 77);
      let b: Vector = {x: -16, 16);
      let center: Vector = {x: 12, 78);
      let foo: any = function(): Bogen {
        return bogen_fromPoints(a, center, b, RECHTE_HAND);
      };
      expect(foo).toThrow();
    });*/

    it ('should not throw exception if center ok', () => {
      let a: Vector = {x: 11, y: 77};

      let center: Vector = {x: 12, y: 78};
      let foo: any = function(): Bogen {
        return bogen_fromPoints('',a, center, undefined, undefined, a, RECHTE_HAND);
      };
      expect(foo).not.toThrow();
    });
    it ('länge bogen größer abstand start und end', () => {
      let a: Vector = {x: 11, y: 0};
      let b: Vector = {x: 0, y: 11};
      let center: Vector = {x: 0, y: 0};
      let bogen: Bogen = bogen_fromPoints('', a, center, undefined, undefined, b, RECHTE_HAND);

      expect(bogen.spurLaenge()).toBeGreaterThan(vector_distance(a, b));
    });
    it ('radius should be equal to distance of center and start', () => {
      let a: Vector = {x: 11, y: 77};
      let center: Vector = {x: 12, y: 78};
      let bogen: Bogen = bogen_fromPoints('', a, center, undefined, undefined, a, RECHTE_HAND);

      expect(vector_distance(center, a)).toEqual(bogen.radius());
    });

    it('Bogen start und end angle sollen gleich sein', () => {
      let a: Vector = {x: 11, y: 77};
      let center: Vector = {x: 12, y: 78};
      let bogen: Bogen = bogen_fromPoints('', a, center, undefined, undefined, a, RECHTE_HAND);

      expect(bogen.grad()).toEqual(360);
    });
    it('Bogen start und end angle sollen ungleich sein', () => {
      let a: Vector = {x: 11, y: 0};
      let b: Vector = {x: 0, y: 11};
      let center: Vector = {x: 0, y: 0};
      let bogen: Bogen = bogen_fromPoints('', a, center, undefined, undefined, b, RECHTE_HAND);

      expect(bogen.grad()).toEqual(270);
    });
    it('startAngle = 315', () => {
      let a: Vector = {x: 1, y: 1};
      let b: Vector = {x: 1, y: -1};
      let center: Vector = {x: 0, y: 0};
      let bogen: Bogen = bogen_fromPoints('', a, center, undefined, undefined, b, RECHTE_HAND);
      expect(bogen.startAngle()).toEqual(gradToRad(315));
    });

    it('Vollkreis Umfang', () => {
      let a: Vector = {x: 7, y: 0};
      let c: Vector = {x: 0, y: 0};
      let circle: Bogen = bogen_fromPoints('', a, c, undefined, undefined, a, RECHTE_HAND);
      expect(circle.startAngle()).toBeCloseTo(0, 2);
      expect(circle.grad()).toBeCloseTo(360, 2);
      expect(circle.spurLaenge()).toBeCloseTo(7 * 2 * Math.PI, 2);
      let circle2: Bogen = bogen_fromPoints('', a, c, undefined, undefined, a, LINKE_HAND);
      expect(circle2.startAngle()).toBeCloseTo(0, 2);
      expect(circle2.grad()).toBeCloseTo(360, 2);
      expect(circle2.spurLaenge()).toBeCloseTo(7 * 2 * Math.PI, 2);
    });
    it('Halbkreis Umfang', () => {
      let a: Vector = {x: 7, y: 0};
      let b: Vector = {x: -7, y: 0};
      let c: Vector = {x: 0, y: 0};
      let halfcircle: Bogen = bogen_fromPoints('', a, c, undefined, undefined, b, RECHTE_HAND);

      expect(halfcircle.spurLaenge()).toBeCloseTo(7 * Math.PI, 2);
      let halfcircle2: Bogen = bogen_fromPoints('', a, c, undefined, undefined, b, LINKE_HAND);

      expect(halfcircle2.spurLaenge()).toBeCloseTo(7 * Math.PI, 2);
    });
    it('Viertelkreis Umfang clockwise', () => {
      let a: Vector = {x: 1, y: 0};
      let b: Vector = {x: 0, y: -1};
      let c: Vector = {x: 0, y: 0};
      let quartercircle: Bogen = bogen_fromPoints('', a, c, undefined, undefined, b, RECHTE_HAND);
      expect(quartercircle.startAngle()).toBeCloseTo(0, 2);
      expect(quartercircle.spurLaenge()).toBeCloseTo(0.5 * Math.PI, 2);

      let quartercircle2: Bogen = bogen_fromPoints('', a, c, undefined, undefined, b, LINKE_HAND);
      expect(quartercircle2.spurLaenge()).toBeCloseTo(1.5 * Math.PI, 2);

      expect(calcGrad(a, c, b, LINKE_HAND)).toBeCloseTo(270, 2);
    });
    it('DreiViertelkreis Umfang anticlockwise', () => {
      let a: Vector = {x: 7, y: 0};
      let b: Vector = {x: 0, y: -7};
      let c: Vector = {x: 0, y: 0};
      let quartercircle: Bogen = bogen_fromPoints('', a, c, undefined, undefined, b, LINKE_HAND);

      expect(quartercircle.spurLaenge()).toBeCloseTo(1.5 * 7 * Math.PI, 2);
      let points: Vector[] = quartercircle.punkte();
      let l: number = 0;
      for (let i: number = 1; i < points.length; i++) {
        l += vector_distance(points[i - 1], points[i]);
      }
      expect(quartercircle.spurLaenge()).toBeCloseTo(l, 3);
    });
    it('speed = 1 dann umfang = traveltime vollkreis', () => {
      let a: Vector = {x: 7, y: 0};
      let c: Vector = {x: 0, y: 0};
      let circle: Bogen = bogen_fromPoints('', a, c, undefined, undefined, a, RECHTE_HAND);

      expect(circle.traveltime()).toEqual(circle.spurLaenge());
    });

    it('startAngle soll 0 sein', () => {
      let a: Vector = {x: 1, y: 0};
      let c: Vector = {x: 0, y: 0};
      let circle: Bogen = bogen_fromPoints('', a, c, undefined, undefined, a, RECHTE_HAND);

      expect(circle.startAngle()).toEqual(0);
    });
    it('startAngle soll PI sein', () => {
      let a: Vector = {x: -1, y: 0};
      let c: Vector = {x: 0, y: 0};
      let circle: Bogen = bogen_fromPoints('', a, c, undefined, undefined, a, RECHTE_HAND);

      expect(circle.startAngle()).toEqual(Math.PI);
    });
    it('startAngle soll PI/2 sein', () => {
      let a: Vector = {x: 0, y: -1};
      let c: Vector = {x: 0, y: 0};
      let circle: Bogen = bogen_fromPoints('', a, c, undefined, undefined, a, RECHTE_HAND);

      expect(circle.startAngle()).toEqual(Math.PI / 2);
    });
    it('startAngle soll 3*PI/2 sein', () => {
      let a: Vector = {x: 0, y: 1};
      let c: Vector = {x: 0, y: 0};
      let circle: Bogen = bogen_fromPoints('', a, c, undefined, undefined, a, RECHTE_HAND);

      expect(circle.startAngle()).toEqual(3 * Math.PI / 2);
    });
    it('traveltime soll 3*PI sein', () => {
      let a: Vector = {x: 3, y: 0};
      let b: Vector = {x: -3, y: 0};
      let c: Vector = {x: 0, y: 0};
      let bogen: Bogen = bogen_fromPoints('', a, c, undefined, undefined, b, RECHTE_HAND);

      expect(bogen.traveltime()).toBeCloseTo(3 * Math.PI, 2);
    });
    it('traveltime soll 6*PI sein', () => {
      let a: Vector = {x: 3, y: 0};
      let c: Vector = {x: 0, y: 0};
      let bogen: Bogen = bogen_fromPoints('', a, c, undefined, undefined, a, RECHTE_HAND);

      expect(bogen.traveltime()).toBeCloseTo(6 * Math.PI, 2);
    });
    it('traveltime soll 6*PI sein', () => {
      let a: Vector = {x: 3, y: 0};
      let c: Vector = {x: 0, y: 0};
      let bogen: Bogen = bogen_fromPoints('', a, c, undefined, undefined, a, RECHTE_HAND);

      expect(bogen.traveltime()).toBeCloseTo(6 * Math.PI, 2);
    });
    it('letzter punkt in punkte = end', () => {
      let a: Vector = {x: 3, y: 3};
      let c: Vector = {x: 2, y: 3};
      let circle: Bogen = bogen_fromPoints('', a, c, undefined, undefined, a, LINKE_HAND);
      expect(vector_equals(circle.punkte()[circle.punkte().length - 1], circle.end())).toBe(true);
    });
    it('create mit winkelgrad', () => {
      let a: Vector = {x: 10, y: 60};
      let c: Vector = {x: 10, y: 50};

      let ziel: Vector = {x: 10, y: 40};

      let b: Bogen = bogen_fromPoints('', a, c, undefined, undefined, undefined, RECHTE_HAND, '', 180);
      expect(vector_distance(b.end(), ziel)).toBeLessThan(0.1);
    });
    it('create mit winkelgrad rechte hand', () => {
      let a: Vector = {x: 10, y: 60};
      let c: Vector = {x: 10, y: 50};

      let ziel: Vector = {x: 20, y: 50};

      let b: Bogen = bogen_fromPoints('', a, c, undefined, undefined, undefined, RECHTE_HAND, '', 90);
      expect(vector_distance(b.end(), ziel)).toBeLessThan(0.1);
    });
    it('create mit winkelgrad linke hand', () => {
      let a: Vector = {x: 10, y: 60};
      let c: Vector = {x: 10, y: 50};

      let ziel: Vector = {x: 0, y: 50};

      let b: Bogen = bogen_fromPoints('', a, c, undefined, undefined, undefined, LINKE_HAND, '', 90);
      expect(vector_distance(b.end(), ziel)).toBeLessThan(0.001);
    });
    it('bogen c8 linke hand', () => {
      let c: Vector = {x: 10, y: 0};
      let b: Bogen = bogen_fromPoints('', c, {x: c.x, y: c.y + 8}, undefined, undefined, undefined, LINKE_HAND, 'name');
      expect(vector_distance(b.end(), c)).toBeLessThan(0.001);
    });
    it('bogen c8 rechte hand', () => {
      let c: Vector = {x: 10, y: 0};
      let b: Bogen = bogen_fromPoints('', c, {x: c.x, y: c.y + 8}, undefined, undefined, undefined, RECHTE_HAND, 'name');
      expect(vector_distance(b.end(), c)).toBeLessThan(0.001);
    });
    it('punkte vollkreis unabhängig von der hand', () => {
      let c: Vector = {x: 0, y: 0};
      let b: Bogen = bogen_fromPoints('', c, {x: c.x, y: c.y + 1}, undefined, undefined, undefined, RECHTE_HAND, 'name');
      let b2: Bogen = bogen_fromPoints('', c, {x: c.x, y: c.y + 1}, undefined, undefined, undefined, LINKE_HAND, 'name');
      expect(b.punkte().length).toEqual(b2.punkte().length);
    });
  });
// }
