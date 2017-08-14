import {createStringRepresantationOfPoints, segments_fromJSON, audiofiles_fromObject,
        segments_fromObject, streckeAt, createGang, getSpeedvorlagen, getStellungen,
        getGaenge, createSegmentfromForm, prepareStandpunkte, bauGang, getMitteBetweenDirections} from './funktionen';
import {Segment, ZIGZAG, BOGEN, LINE, CIRCLE, HALF_CIRCLE, SERPENTINE, ECKE, HALT, PIAFFE, RUECKWAERTZ, KEHRT,
        HINTERHAND_WENDUNG, PIROUETTE_PIAFFE, PIROUETTE_GALOPP} from '../segments/segment';
import {Arena} from '../arena/arena';
import {Line} from '../segments/line';
// import {Segment, ZIGZAG, BOGEN, LINE, CIRCLE, HALF_CIRCLE, SERPENTINE, ECKE, HALT, PIAFFE, RUECKWAERTZ, KEHRT,
//        HINTERHAND_WENDUNG, PIROUETTE_PIAFFE, PIROUETTE_GALOPP, FLYING_CHANGES} from './segments/segment';
export function main() {
describe('Funktionen', () => {
  it('createStringRepresantationOfPoints 20*60', () => {
    let arena = new Arena(20,60);
    expect(createStringRepresantationOfPoints([{x: 10, y: 60}], arena)).toEqual('A ');
    expect(createStringRepresantationOfPoints([{x: 20, y: 54}], arena)).toEqual('K ');
    expect(createStringRepresantationOfPoints([{x: 20, y: 42}], arena)).toEqual('V ');
    expect(createStringRepresantationOfPoints([{x: 20, y: 30}], arena)).toEqual('E ');
    expect(createStringRepresantationOfPoints([{x: 20, y: 18}], arena)).toEqual('S ');
    expect(createStringRepresantationOfPoints([{x: 20, y: 6}], arena)).toEqual('H ');
    expect(createStringRepresantationOfPoints([{x: 10, y: 0}], arena)).toEqual('C ');
    expect(createStringRepresantationOfPoints([{x: 10, y: 6}], arena)).toEqual('G ');
    expect(createStringRepresantationOfPoints([{x: 10, y: 18}], arena)).toEqual('I ');
    expect(createStringRepresantationOfPoints([{x: 10, y: 30}], arena)).toEqual('X ');
    expect(createStringRepresantationOfPoints([{x: 10, y: 42}], arena)).toEqual('L ');
    expect(createStringRepresantationOfPoints([{x: 10, y: 54}], arena)).toEqual('D ');
    expect(createStringRepresantationOfPoints([{x: 0, y: 54}], arena)).toEqual('F ');
    expect(createStringRepresantationOfPoints([{x: 0, y: 42}], arena)).toEqual('P ');
    expect(createStringRepresantationOfPoints([{x: 0, y: 30}], arena)).toEqual('B ');
    expect(createStringRepresantationOfPoints([{x: 0, y: 18}], arena)).toEqual('R ');
    expect(createStringRepresantationOfPoints([{x: 0, y: 6}], arena)).toEqual('M ');
    expect(createStringRepresantationOfPoints([{x: 13, y: 47}], arena)).toEqual('(13|47) ');
  });

  it('createStringRepresantationOfPoints 20*40', () => {
    let arena = new Arena(20,40);
    expect(createStringRepresantationOfPoints([{x: 10, y: 40}], arena)).toEqual('A ');
    expect(createStringRepresantationOfPoints([{x: 20, y: 34}], arena)).toEqual('K ');
    expect(createStringRepresantationOfPoints([{x: 20, y: 20}], arena)).toEqual('E ');
    expect(createStringRepresantationOfPoints([{x: 20, y: 6}], arena)).toEqual('H ');
    expect(createStringRepresantationOfPoints([{x: 10, y: 0}], arena)).toEqual('C ');
    expect(createStringRepresantationOfPoints([{x: 10, y: 20}], arena)).toEqual('X ');
    expect(createStringRepresantationOfPoints([{x: 0, y: 34}], arena)).toEqual('F ');
    expect(createStringRepresantationOfPoints([{x: 0, y: 20}], arena)).toEqual('B ');
    expect(createStringRepresantationOfPoints([{x: 0, y: 6}], arena)).toEqual('M ');
    expect(createStringRepresantationOfPoints([{x: 13, y: 27}], arena)).toEqual('(13|27) ');
  });

  it('segments_fromJSON', () => {
    let segs = segments_fromJSON('');
    expect(segs).toEqual([]);
  });

  it('audiofiles_fromObject', () => {
    let af = audiofiles_fromObject({});
    expect(af).toEqual([]);
  });

  it('segments_fromObject', () => {
    let segs = segments_fromObject({});
    expect(segs).toEqual([]);
    segs = segments_fromObject([{class: HALT}]);
    expect(segs.length).toEqual(1);
    segs = segments_fromObject([{class: HINTERHAND_WENDUNG}]);
    expect(segs.length).toEqual(1);
    segs = segments_fromObject([{class: PIROUETTE_PIAFFE}]);
    expect(segs.length).toEqual(1);
    segs = segments_fromObject([{class: PIROUETTE_GALOPP}]);
    expect(segs.length).toEqual(1);
    segs = segments_fromObject([{class: ZIGZAG, _zwischenpunkte: [{x:0, y:10}, {x:20, y: 40}]}]);
    expect(segs.length).toEqual(1);
    segs = segments_fromObject([{class: BOGEN}]);
    expect(segs.length).toEqual(1);
    segs = segments_fromObject([{class: LINE}]);
    expect(segs.length).toEqual(1);
    segs = segments_fromObject([{class: CIRCLE}]);
    expect(segs.length).toEqual(1);
    segs = segments_fromObject([{class: HALF_CIRCLE}]);
    expect(segs.length).toEqual(1);
    segs = segments_fromObject([{class: SERPENTINE}]);
    expect(segs.length).toEqual(1);
    segs = segments_fromObject([{class: ECKE, _zentrum: {x:0, y:0}}]);
    expect(segs.length).toEqual(1);
    segs = segments_fromObject([{class: PIAFFE}]);
    expect(segs.length).toEqual(1);
    segs = segments_fromObject([{class: RUECKWAERTZ}]);
    expect(segs.length).toEqual(1);
    segs = segments_fromObject([{class: KEHRT}]);
    expect(segs.length).toEqual(1);

  });

  it('streckeAt', () => {
    let s = streckeAt(0, []);
    expect(s.strecke).toEqual(0);
  });

  it('getSpeedvorlagen', () => {
    let spv = getSpeedvorlagen();
    /*expect(spv).toBe({schritt_versammelt: 1, schritt_normal: 1.3, schritt_mittel: 1.6, schritt_stark: 1.8,
                    trab_versammelt: 3, trab_normal: 3.5, trab_mittel: 4.2, trab_stark: 6,
                  galopp_versammelt: 4, galopp_normal: 6, galopp_mittel: 7, galopp_stark: 8.5,
                passage: 1.5, pirouetteGalopp: 4, pirouettePiaffe: 0.5, piaffe: 0,
                wendungHinterhand: 1, rueckwaertz: 1 });*/
    expect(spv.schritt_versammelt).toEqual(1);
    expect(spv.schritt_normal).toEqual(1.3);
  });

  it('createGang', () => {
    let spv = getSpeedvorlagen();
    let gang = createGang('Rueckwaertz', spv);
    expect(gang.name).toEqual('Rueckwaertz');
    expect(gang.speed).toEqual(1);

    gang = createGang('Versammelter_Schritt', spv);
    expect(gang.name).toEqual('Versammelter_Schritt');
    expect(gang.speed).toEqual(1);
    gang = createGang('Schritt', spv);
    expect(gang.name).toEqual('Schritt');
    expect(gang.speed).toEqual(1.3);
    gang = createGang('Mittel_Schritt', spv);
    expect(gang.name).toEqual('Mittel_Schritt');
    expect(gang.speed).toEqual(1.6);
    gang = createGang('Starker_Schritt', spv);
    expect(gang.name).toEqual('Starker_Schritt');
    expect(gang.speed).toEqual(1.8);

    gang = createGang('Versammelter_Trab', spv);
    expect(gang.name).toEqual('Versammelter_Trab');
    expect(gang.speed).toEqual(3);
    gang = createGang('Trab', spv);
    expect(gang.name).toEqual('Trab');
    expect(gang.speed).toEqual(3.5);
    gang = createGang('Mittel_Trab', spv);
    expect(gang.name).toEqual('Mittel_Trab');
    expect(gang.speed).toEqual(4.2);
    gang = createGang('Starker_Trab', spv);
    expect(gang.name).toEqual('Starker_Trab');
    expect(gang.speed).toEqual(6);

    gang = createGang('Versammelter_Galopp', spv);
    expect(gang.name).toEqual('Versammelter_Galopp');
    expect(gang.speed).toEqual(4);
    gang = createGang('Galopp', spv);
    expect(gang.name).toEqual('Galopp');
    expect(gang.speed).toEqual(6);
    gang = createGang('Mittel_Galopp', spv);
    expect(gang.name).toEqual('Mittel_Galopp');
    expect(gang.speed).toEqual(7);
    gang = createGang('Starker_Galopp', spv);
    expect(gang.name).toEqual('Starker_Galopp');
    expect(gang.speed).toEqual(8.5);
  });

  it('getStellungen', () => {
    let st = getStellungen();
    expect(st).toBeDefined();
  });

  it('getGaenge', () => {
    let spv = getSpeedvorlagen();
    let gaenge = getGaenge(spv);
    expect(gaenge.length).toEqual(17);
  });

  it('createSegmentfromForm', () => {
    /* createSegmentfromForm(segment: any, arena: Arena, _editMode: string, _segments: Segment[],
                                          _selectedSegment: Segment, gaenge: Gang[]): Segment[]*/
    let spv = getSpeedvorlagen();
    let gaenge = getGaenge(spv);
    let arena = new Arena(20, 60);
    let form = {type: ZIGZAG, gang: 'unknown', start: 'AX'};
    let seg: Segment = createSegmentfromForm(form, arena, 'append', [], undefined, gaenge);
    expect(seg).toBeDefined();
    expect(seg.spurLaenge()).toBeCloseTo(30,4);

    form = {type: LINE, gang: 'unknown', start: '(0,0)(20,60)'};
    seg = createSegmentfromForm(form, arena, 'append', [], undefined, gaenge);
    expect(seg).toBeDefined();
    expect(seg.spurLaenge()).toBeCloseTo(Math.sqrt(4000),4);

    form = {type: BOGEN, gang: 'unknown', start: '(0,10)(10,10) 180'};
    seg = createSegmentfromForm(form, arena, 'append', [], undefined, gaenge);
    expect(seg).toBeDefined();
    expect(seg.spurLaenge()).toBeCloseTo(Math.PI * 10, 2);

  });

  it('direction = 0 bei waagerecht', () => {
    let l = new Line('', {x:0,y:0}, {x:1, y:0}, undefined, undefined);
    let ps = prepareStandpunkte([l]);
    expect (ps[1].direction).toEqual(0);
    expect (ps[0].direction).toEqual(ps[1].direction);
    expect (ps[0].direction).toEqual(ps[ps.length - 1].direction);
  });
  it('direction = Pi/2 bei senkrecht', () => {
    let l = new Line('', {x:0,y:0}, {x:0, y:10}, undefined, undefined);
    let ps = prepareStandpunkte([l]);
    expect (ps[1].direction).toBeCloseTo(Math.PI/2, 5);
    expect (ps[0].direction).toEqual(ps[1].direction);
    expect (ps[0].direction).toEqual(ps[ps.length - 1].direction);
  });
  it('bauGang', () => {
    let spv = getSpeedvorlagen();
    let gaenge = getGaenge(spv);
    let gang = bauGang(gaenge, 'GibtsGarNicht');
    expect(gang.speed).toEqual(1);
  });
  it('getMitteBetweenDirections', () => {
    expect(getMitteBetweenDirections(0,0)).toEqual(0);
    expect(getMitteBetweenDirections(-1,1)).toBeCloseTo(0,5);
  });
});
}
