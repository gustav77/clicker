import {Wendung} from './wendung';
// export function main() {
//  'use strict';
  describe('Wendung', () => {
    it('', () => {
      let w: Wendung = new Wendung('', {x: 0, y: 0}, undefined, undefined);
      expect(w.end()).toBeDefined();
    });
  });
// }
