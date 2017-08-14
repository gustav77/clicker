import {Vector, Bahnpunkt} from '../segments/vector';
import {Arena, createDimension, createPoints, convertStringToNumberArray,
        translateX, convertX, translateY, convertY } from './arena';
  describe('Arena', () => {
    it('has height given in the constructor', () => {
      let arena: Arena = new Arena(20, 40);
      expect(arena.height()).toEqual(40);
    });
    it('has width given in the constructor', () => {
      let arena: Arena = new Arena(15, 60);
      expect(arena.width()).toEqual(15);
    });
    it('creates dimensions', () => {
      let m: number = createDimension('20 56');
      expect(m['breite']).toEqual(20);
      expect(m['laenge']).toEqual(56);
    });
    it('create points', () => {
      let pp: any = createPoints('(0,60)(20,0)1.5', []);
      let punkte: any = pp.points;
      let measure: any = pp.measures;
      expect(punkte[0]).toEqual({x: 0, y: 60});
      expect(punkte[1]).toEqual({x: 20, y: 0});
      expect(measure[0]).toEqual(1.5);
    });
  });
  describe('Bahnpunkte', () => {
    it('has Bahnpunkte 20 x 60', () => {
      let arena: Arena = new Arena(20, 60);
      let bp: Bahnpunkt[] = arena.bahnpunkte();
      expect( bp.length ).toEqual(17);
    });
    it('has Bahnpunkte 20 x 40', () => {
      let arena: Arena = new Arena(20, 40);
      let bp: Bahnpunkt[] = arena.bahnpunkte();
      expect( bp.length ).toEqual(9);
    });
    it('has no Bahnpunkte 30 x 60', () => {
      let arena: Arena = new Arena(30, 60);
      let bp: Bahnpunkt[] = arena.bahnpunkte();
      expect( bp.length ).toEqual(0);
    });
    it('Bahnpunkt hat koordinaten ', () => {
      let arena: Arena = new Arena(20, 60);
      let bp: Bahnpunkt[] = arena.bahnpunkte();
      bp.forEach( p => expect( p.x + 0.0001 ).toBeGreaterThan(0));
      bp.forEach( p => expect( p.y + 0.0001 ).toBeGreaterThan(0));
      bp.forEach( p => expect( p.x - 0.0001 ).toBeLessThan(20));
      bp.forEach( p => expect( p.y - 0.0001 ).toBeLessThan(60));
    });
    it('Bahnpunkt hat koordinaten ', () => {
      let arena: Arena = new Arena(20, 40);
      let bp: Bahnpunkt[] = arena.bahnpunkte();
      bp.forEach( p => expect( p.x + 0.0001 ).toBeGreaterThan(0));
      bp.forEach( p => expect( p.y + 0.0001 ).toBeGreaterThan(0));
      bp.forEach( p => expect( p.x - 0.0001 ).toBeLessThan(20));
      bp.forEach( p => expect( p.y - 0.0001 ).toBeLessThan(40));
    });
    it('create Bahnpunkt', () => {
      let bp: Bahnpunkt = {x: 17, y: 56, name: 'Z'};
      expect(bp.x).toEqual(17);
      expect(bp.y).toEqual(56);
      expect(bp.name).toEqual('Z');
    });
    it('convert string to numbers', () => {
      let tmp: string = '17 -3 8.5';
      let nums: number[] = convertStringToNumberArray(tmp);
      expect(nums[0]).toEqual(17);
      expect(nums[1]).toEqual(-3);
      expect(nums[2]).toEqual(8.5);
    });
    it('createPoints', () => {
      let tmp: string = '(18|7)(-3,5.1)';
      let vecs: Vector[] = createPoints(tmp, undefined).points;
      expect(vecs[0]).toEqual({x: 18, y: 7});
      expect(vecs[1]).toEqual({x: -3, y: 5.1});
    });
    it('Umkehrfkt. x', () => {
      let x: number = translateX(9, 3, 40);
      expect(convertX(x, 3, 40)).toEqual(9);
    });
    it('Umkehrfkt. y', () => {
      let arena: Arena = new Arena(20, 60);
      let y: number = translateY(9, 3, 40, arena);
      expect(convertY(y, 3, 40, arena)).toEqual(9);
    });
    it('translatey', () => {
      let arena: Arena = new Arena(20, 60);
      expect(translateY(0,1,0,arena)).toEqual(60);
      expect(translateY(0,5,0,arena)).toEqual(300);
      expect(translateY(50,5.5673,30,arena)).toEqual(85.673);
    });
  });
