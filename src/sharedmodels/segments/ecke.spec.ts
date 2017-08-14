import {RECHTE_HAND, LINKE_HAND} from './segment';
import {Ecke, createEcke} from './ecke';
// export function main() {
//  'use strict';
  describe('Ecke', () => {
    it ('creates Ecken linke hand', () => {
      let e1: Ecke = createEcke('', {x: 0, y: 0}, 5, undefined, undefined, 0, LINKE_HAND);
      expect(e1).toBeDefined();
      let e2: Ecke = createEcke('', {x: 0, y: 0}, 5, undefined, undefined, 1, LINKE_HAND);
      expect(e2).toBeDefined();
      let e3: Ecke = createEcke('', {x: 0, y: 0}, 5, undefined, undefined, 2, LINKE_HAND);
      expect(e3).toBeDefined();
      let e4: Ecke = createEcke('', {x: 0, y: 0}, 5, undefined, undefined, 3, LINKE_HAND);
      expect(e4).toBeDefined();

    });

    it ('creates Ecken rechte hand', () => {
      let e1: Ecke = createEcke('', {x: 0, y: 0}, 5, undefined, undefined, 0, RECHTE_HAND);
      expect(e1).toBeDefined();
      let e2: Ecke = createEcke('', {x: 0, y: 0}, 5, undefined, undefined, 1, RECHTE_HAND);
      expect(e2).toBeDefined();
      let e3: Ecke = createEcke('', {x: 0, y: 0}, 5, undefined, undefined, 2, RECHTE_HAND);
      expect(e3).toBeDefined();
      let e4: Ecke = createEcke('', {x: 0, y: 0}, 5, undefined, undefined, 3, RECHTE_HAND);
      expect(e4).toBeDefined();

    });

    it('ungültiger Quadrant', () => {
      let e1: Ecke = createEcke('', {x: 0, y: 0}, 5, undefined, undefined, 7, RECHTE_HAND);
      expect(e1).toBeUndefined();

    });

    it('länge der ecke', () => {
      let radius: number = 5;
      let e1: Ecke = createEcke('', {x: 0, y: 0}, radius, undefined, undefined, 0, RECHTE_HAND);
      expect(e1.laenge()).toBeCloseTo(radius * 0.5 * Math.PI, 6 );

      e1 = createEcke('', {x: 0, y: 0}, radius, undefined, undefined, 0, LINKE_HAND);
      expect(e1.laenge()).toBeCloseTo(radius * 0.5 * Math.PI, 6 );

      e1 = createEcke('', {x: 0, y: 0}, radius, undefined, undefined, 1, RECHTE_HAND);
      expect(e1.laenge()).toBeCloseTo(radius * 0.5 * Math.PI, 6 );

      e1 = createEcke('', {x: 0, y: 0}, radius, undefined, undefined, 1, LINKE_HAND);
      expect(e1.laenge()).toBeCloseTo(radius * 0.5 * Math.PI, 6 );

      e1 = createEcke('', {x: 0, y: 0}, radius, undefined, undefined, 2, RECHTE_HAND);
      expect(e1.laenge()).toBeCloseTo(radius * 0.5 * Math.PI, 6 );

      e1 = createEcke('', {x: 0, y: 0}, radius, undefined, undefined, 2, LINKE_HAND);
      expect(e1.laenge()).toBeCloseTo(radius * 0.5 * Math.PI, 6 );

      e1 = createEcke('', {x: 0, y: 0}, radius, undefined, undefined, 3, RECHTE_HAND);
      expect(e1.laenge()).toBeCloseTo(radius * 0.5 * Math.PI, 6 );

      e1 = createEcke('', {x: 0, y: 0}, radius, undefined, undefined, 3, LINKE_HAND);
      expect(e1.laenge()).toBeCloseTo(radius * 0.5 * Math.PI, 6 );

      e1 = createEcke('', {x: 7, y: -10}, radius, undefined, undefined, 0, RECHTE_HAND);
      expect(e1.laenge()).toBeCloseTo(radius * 0.5 * Math.PI, 6 );

      e1 = createEcke('', {x: -110, y: 130}, radius, undefined, undefined, 0, LINKE_HAND);
      expect(e1.laenge()).toBeCloseTo(radius * 0.5 * Math.PI, 6 );

    });

    it('länge der ecke, radius 1.5', () => {
      let radius: number = 1.5;
      let e1: Ecke = createEcke('', {x: 0, y: 0}, radius, undefined, undefined, 0, RECHTE_HAND);
      expect(e1.laenge()).toBeCloseTo(radius * 0.5 * Math.PI, 6 );

      e1 = createEcke('', {x: 0, y: 0}, radius, undefined, undefined, 0, LINKE_HAND);
      expect(e1.laenge()).toBeCloseTo(radius * 0.5 * Math.PI, 6 );

      e1 = createEcke('', {x: 0, y: 0}, radius, undefined, undefined, 1, RECHTE_HAND);
      expect(e1.laenge()).toBeCloseTo(radius * 0.5 * Math.PI, 6 );

      e1 = createEcke('', {x: 0, y: 0}, radius, undefined, undefined, 1, LINKE_HAND);
      expect(e1.laenge()).toBeCloseTo(radius * 0.5 * Math.PI, 6 );

      e1 = createEcke('', {x: 0, y: 0}, radius, undefined, undefined, 2, RECHTE_HAND);
      expect(e1.laenge()).toBeCloseTo(radius * 0.5 * Math.PI, 6 );

      e1 = createEcke('', {x: 0, y: 0}, radius, undefined, undefined, 2, LINKE_HAND);
      expect(e1.laenge()).toBeCloseTo(radius * 0.5 * Math.PI, 6 );

      e1 = createEcke('', {x: 0, y: 0}, radius, undefined, undefined, 3, RECHTE_HAND);
      expect(e1.laenge()).toBeCloseTo(radius * 0.5 * Math.PI, 6 );

      e1 = createEcke('', {x: 0, y: 0}, radius, undefined, undefined, 3, LINKE_HAND);
      expect(e1.laenge()).toBeCloseTo(radius * 0.5 * Math.PI, 6 );

      e1 = createEcke('', {x: 7, y: -10}, radius, undefined, undefined, 0, RECHTE_HAND);
      expect(e1.laenge()).toBeCloseTo(radius * 0.5 * Math.PI, 6 );

      e1 = createEcke('', {x: -110, y: 130}, radius, undefined, undefined, 0, LINKE_HAND);
      expect(e1.laenge()).toBeCloseTo(radius * 0.5 * Math.PI, 6 );

    });

  });
// }
