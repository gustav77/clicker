import {Arena, createPoints} from '../arena/arena';
import {Vector, vector_distance, vector_subtract, Position, vector_phi, vector_fromPolar, vector_winkel_zwischen,
   position_fromPosition, position_fromPoints} from '../segments/vector';
import {zigzag_fromObject} from '../segments/zigzag';
import {line_fromObject} from '../segments/line';
import {bogen_fromObject} from '../segments/bogen';
import {serpentine_fromObject} from '../segments/serpentine';
import {Kehrt, kehrt_fromObject} from '../segments/kehrt';
import {ecke_fromObject} from '../segments/ecke';
import {wendung_fromObject} from '../segments/wendung';
import {Segment, ZIGZAG, BOGEN, LINE, CIRCLE, HALF_CIRCLE, SERPENTINE, ECKE, HALT, PIAFFE, RUECKWAERTZ, KEHRT,
        HINTERHAND_WENDUNG, PIROUETTE_PIAFFE, PIROUETTE_GALOPP} from '../segments/segment';
import {Gang} from '../segments/gang';
import {Zigzag} from '../segments/zigzag';
import {Line} from '../segments/line';
import {Serpentine} from '../segments/serpentine';
import {Bogen, bogen_fromPoints, circleFromPoints} from '../segments/bogen';
import {wendung_fromPoints} from '../segments/wendung';
import {Halt, halt_fromObject} from '../segments/halt';
import {Piaffe, piaffe_fromObject} from '../segments/piaffe';
import {Rueckwaertz, rueckwaertz_fromObject} from '../segments/rueckwaertz';
// import {standpunkt_fromPoints} from '../segments/standpunkt';
import { Audiofile, audiofile_fromObject } from '../audio/audiofile';

export function createStringRepresantationOfPoints(vecs: Vector[], arena: Arena): string {
  'use strict';
  let res: string = '';
  vecs.forEach((v) => {
    if (v)
      res += arena.getNameOfBahnpunkt(v.x, v.y) + ' ';
  });
  return res;
};
export function segments_fromJSON(json: string): Segment[] {
  'use strict';
  let segs: Segment[];
  try {
    segs = segments_fromObject( JSON.parse(json) );
  } catch (error) {
    segs = [];
  }
  return segs;
}
export function audiofiles_fromObject(tmpArr: any): Audiofile[] {
  'use strict';
  let arr: Audiofile[] = [];
  if (tmpArr && Array.isArray(tmpArr)) {
    tmpArr.forEach((j: any) => {
      arr.push(audiofile_fromObject(j));
      }
    );
  }
  return arr;
}
export function segments_fromObject(tmpArr: any): Segment[] {
  'use strict';
  let arr: Segment[] = [];
  if (tmpArr && Array.isArray(tmpArr)) {
    tmpArr.forEach((j: any) => {
      if (j) {
        switch (j.class) {
          case HALT:
            arr.push(halt_fromObject(j));
            break;
          case PIAFFE:
            arr.push(piaffe_fromObject(j));
            break;
          case ZIGZAG:
            arr.push(zigzag_fromObject(j));
            break;
          case LINE:
            arr.push(line_fromObject(j));
            break;
          case KEHRT:
            arr.push(kehrt_fromObject(j));
            break;
          case BOGEN:
          case CIRCLE:
          case HALF_CIRCLE:
            arr.push(bogen_fromObject(j));
            break;
          case SERPENTINE:
            arr.push(serpentine_fromObject(j));
            break;
          case ECKE:
            arr.push(ecke_fromObject(j));
            break;
          case HINTERHAND_WENDUNG:
          case PIROUETTE_GALOPP:
          case PIROUETTE_PIAFFE:
            arr.push(wendung_fromObject(j));
            break;
          case RUECKWAERTZ:
            arr.push(rueckwaertz_fromObject(j));
            break;
        }
      }
    });
  }
  return arr;
}
/**
 * returned zurückgelegte Strecke nach time einheiten und den dann eingelegten Gang
 */
 export function streckeAt(time: number, segments: Segment[], lastStreckeAt?: any): any {
   'use strict';
   let index: number = 0;
   let strecke: number = 0;
   let vorbei: number = 0;
   let last: any;
   let g: Gang;
   let comment: string;
   let stellung: string;
   let streckenlaenge: number;
   let _class: string;
   let seg: Segment;
   if (lastStreckeAt && lastStreckeAt.time < time) {
     index = lastStreckeAt.index;
     strecke = lastStreckeAt.strecke;
     vorbei = lastStreckeAt.vorbei;
     // time = time - lastStreckeAt.time;
   }
   for (let i: number = index; i < segments.length; i++) {
     last = {time: time, strecke: strecke, vorbei: vorbei, index: i};
     seg = segments[i];
     g = segments[i].gang();
     _class = segments[i].class();
     comment = segments[i].comment();
     stellung = segments[i].stellung();
     streckenlaenge = segments[i].spurLaenge();
     let f: number = 1;
     /*if (g && g.name() === 'Rueckwaertz') {
       f = -1;
     }*/
     if (segments[i].class() === HALT) {
       if ((<Halt>segments[i]).dauer() + vorbei <= time) {
         vorbei += (<Halt>segments[i]).dauer();
       }
       else {
         // last = {time: time, strecke: strecke, vorbei: vorbei, index: i};
         break;
       }
     }
     else if (segments[i].class() === PIAFFE) {
       if ((<Piaffe>segments[i]).dauer() + vorbei <= time) {
         vorbei += (<Piaffe>segments[i]).dauer();
       }
       else {
         // last = {time: time, strecke: strecke, vorbei: vorbei, index: i};
         break;
       }
     }
     else if (streckenlaenge/g.speed + vorbei <= time) {
       vorbei += streckenlaenge/g.speed;
       strecke += streckenlaenge;
     }
     else {
       strecke += (time - vorbei) * f * g.speed;
       // last = {time: time, strecke: strecke, vorbei: vorbei, index: i};
       break;
     }
   }
   return {strecke, g, last, comment, stellung, _class, seg};
 }
export function createGang(gangart: string, spv: any): Gang {
  'use strict';
  let g: Gang;

  // let spv: any = getGaitSpeeds();
  // // console.log(gang, 'Ganng');
  switch (gangart) {
    case 'Versammelter_Schritt':
      g = {name: 'Versammelter_Schritt', speed: <number>spv.schritt_versammelt};
      break;
    case 'Schritt':
      g = {name: 'Schritt', speed: spv.schritt_normal};
      break;
    case 'Mittel_Schritt':
      g = {name: 'Mittel_Schritt', speed: spv.schritt_mittel};
      break;
    case 'Starker_Schritt':
      g = {name: 'Starker_Schritt', speed: spv.schritt_stark};
      break;
    case 'Versammelter_Trab':
      g = {name: 'Versammelter_Trab', speed: spv.trab_versammelt};
      break;
    case 'Trab':
      g = {name: 'Trab', speed: spv.trab_normal};
      break;
    case 'Mittel_Trab':
      g = {name: 'Mittel_Trab', speed: spv.trab_mittel};
      break;
    case 'Starker_Trab':
      g = {name: 'Starker_Trab', speed: spv.trab_stark};
      break;
    case 'Versammelter_Galopp':
      g = {name: 'Versammelter_Galopp', speed: spv.galopp_versammelt};
      break;
    case 'Galopp':
      g = {name: 'Galopp', speed: spv.galopp_normal};
      break;
    case 'Mittel_Galopp':
      g = {name: 'Mittel_Galopp', speed: spv.galopp_mittel};
      break;
    case 'Starker_Galopp':
      g = {name: 'Starker_Galopp', speed: spv.galopp_stark};
      break;
    case 'Piaffe':
      g = {name: 'Piaffe', speed: spv.piaffe};
      break;
    case 'Passage':
      g = {name: 'Passage', speed: spv.passage};
      break;
    case 'PirouetteGalopp':
      g = {name: 'PirouetteGalopp', speed: spv.pirouetteGalopp};
      break;
    case 'PirouettePiaffe':
      g = {name: 'PirouettePiaffe', speed: spv.pirouettePiaffe};
      break;
    case 'WENDUNG_HINTERHAND':
      g = {name: 'WENDUNG_HINTERHAND', speed: spv.wendungHinterhand};
      break;
    case 'WENDUNG_VORHAND':
      g = {name: 'WENDUNG_VORHAND', speed: spv.wendungVorhand};
      break;
    case 'Halt':
      g = {name: 'Halt', speed: 0};
      break;
    case 'Piaffe':
      g = {name: 'Piaffe', speed: 0};
      break;
    case 'Rueckwaertz':
      g = {name: 'Rueckwaertz', speed: spv.rueckwaertz};
      break;

  }
  return g;
}
export function getSpeedvorlagen(): any {
  'use strict';
  let spv: any = {schritt_versammelt: 1, schritt_normal: 1.3, schritt_mittel: 1.6, schritt_stark: 1.8,
                  trab_versammelt: 3, trab_normal: 3.5, trab_mittel: 4.2, trab_stark: 6,
                galopp_versammelt: 4, galopp_normal: 6, galopp_mittel: 7, galopp_stark: 8.5,
              passage: 1.5, pirouetteGalopp: 4, pirouettePiaffe: 0.5, piaffe: 0.1,
              wendungHinterhand: 1, rueckwaertz: 1 };
  return spv;
}
/*function getGaitSpeeds(): any {
  'use strict';
  // if (this._aktuellesPattern && this._aktuellesPattern.getGaitSpeeds()) {
  //    return this._aktuellesPattern.getGaitSpeeds();
  //  }
  //  else {
  return getSpeedvorlagen();
  //  }
}*/
export function getStellungen(): any[] {
  'use strict';
  let ar: any[] = [{name: 'GERADE'}, {name: 'RECHTS_GESTELLT'},
  {name: 'RECHTS_GEBOGEN'}, {name: 'LINKS_GESTELLT'},
  {name: 'LINKS_GEBOGEN'}, {name: 'SCHULTER_HEREIN_RECHTS'},
  {name: 'SCHULTER_HEREIN_LINKS'},
  {name: 'SCHENKELWEICHEN_RECHTS'},
  {name: 'SCHENKELWEICHEN_LINKS'},
  {name: 'TRAVER_LINKEHAND'},
  {name: 'TRAVER_RECHTEHAND'},
  {name: 'RENVER_LINKEHAND'},
  {name: 'RENVER_RECHTEHAND'} ];
  return ar;
}
export function getGaenge(spv: any[]): Gang[] {
  'use strict';
  let g: Gang;
  let gaenge: Gang[] = [];
  g = createGang('Versammelter_Schritt', spv);
  gaenge.push(g);
  g = createGang('Schritt', spv);
  gaenge.push(g);
  g = createGang('Mittel_Schritt', spv);
  gaenge.push(g);
  g = createGang('Starker_Schritt', spv);
  gaenge.push(g);
  g = createGang('Versammelter_Trab', spv);
  gaenge.push(g);
  g = createGang('Trab', spv);
  gaenge.push(g);
  g = createGang('Mittel_Trab', spv);
  gaenge.push(g);
  g = createGang('Starker_Trab', spv);
  gaenge.push(g);
  g = createGang('Versammelter_Galopp', spv);
  gaenge.push(g);
  g = createGang('Galopp', spv);
  gaenge.push(g);
  g = createGang('Mittel_Galopp', spv);
  gaenge.push(g);
  g = createGang('Starker_Galopp', spv);
  gaenge.push(g);
  g = createGang('Passage', spv); // spv.passage);
  gaenge.push(g);
  g = createGang('PirouetteGalopp', spv); // spv.galopp_pirouette);
  gaenge.push(g);
  g = createGang('PirouettePiaffe', spv); // spv.piaffe_pirouette);
  gaenge.push(g);

  g = createGang('WENDUNG_HINTERHAND', spv);
  gaenge.push(g);
  g = createGang('Rueckwaertz', spv);
  gaenge.push(g);

  return gaenge;
}
export function createSegmentfromForm(segment: any, arena: Arena, _editMode: string, _segments: Segment[],
                                      _selectedSegment: Segment, gaenge: Gang[]): Segment {
  'use strict';
  // console.log('Segment to save: ', segment);
  if (!segment || !segment.start)
    return undefined;

  let pp: any = createPoints(segment.start, arena.bahnpunkte());
  let punkte: any = pp.points;
  if (!punkte)
    return undefined;

  let type: string;
  if (typeof segment.type === 'string') {
    type = segment.type;
  }
  else {
    type = segment.type[0];
  }
  let gesuchterGangName: string;
  if (type === RUECKWAERTZ)
    gesuchterGangName = 'Rueckwaertz';
  else if (type === HINTERHAND_WENDUNG)
    gesuchterGangName = 'WENDUNG_HINTERHAND';
  else if (type === PIROUETTE_PIAFFE)
    gesuchterGangName = 'PirouettePiaffe';
  else if (type === PIROUETTE_GALOPP)
    gesuchterGangName = 'PirouetteGalopp';
  else if (typeof segment.gang === 'string') {
    gesuchterGangName = segment.gang;
  }
  else {
    gesuchterGangName = segment.gang[0];
  }
  let gang: Gang = bauGang(gaenge, gesuchterGangName, segment.galoppWechselErlaubt, segment.anzahlGaloppWechsel, segment.nthStride);

  let stellung: string = segment.stellung;
  let savedSeg: Segment;
  let durchmesser: number;
  let grad: number;

  let v1: Vector;
  let v2: Vector;

  switch( type ) {
    case ZIGZAG:
      savedSeg = new Zigzag(segment.comment, baueZwischenpunkte(punkte, arena), gang, stellung, segment.eckenradius, segment.name);
      break;
    case LINE:
      if ( punkte.length > 1) {
        v1 = {x: punkte[0].x, y: punkte[0].y};
        v2 = {x: punkte[1].x, y: punkte[1].y};

        savedSeg = new Line(segment.comment, v1, v2, gang, stellung);
      }
      break;
    case SERPENTINE:
      if ( punkte.length > 1) {
        v1 = {x: punkte[0].x, y: punkte[0].y};
        v2 = {x: punkte[1].x, y: punkte[1].y};

        savedSeg = new Serpentine(segment.comment, v1, v2, gang, stellung, Number(segment.anzahlbogen), Number(segment.bogentiefe), Number(segment.bogenphase), segment.hand);
      }
      break;
    case BOGEN:
      if (pp.measures.length > 0)
        durchmesser = pp.measures[0];
      if (pp.measures.length > 1)
        grad = pp.measures[1];
      savedSeg = createBogen(gang, segment.stellung, segment.comment, punkte, arena, durchmesser, grad, segment.hand, segment.name);
      break;
    case CIRCLE:
      if (punkte.length === 1 && pp.measures.length > 0)
        durchmesser = pp.measures[0];
      if (punkte.length === 2 && pp.measures.length > 0)
        grad = pp.measures[0];

      savedSeg = createCircle(gang, segment.stellung, segment.comment, punkte, durchmesser, segment.hand, arena, segment.name, 360, CIRCLE);
      break;
    case HALF_CIRCLE:
      if (pp.measures.length > 0)
        durchmesser = pp.measures[0];
      if (pp.measures.length > 1)
        grad = pp.measures[1];

      savedSeg = createCircle(gang, segment.stellung, segment.comment, punkte, durchmesser, segment.hand, arena, segment.name, 180, HALF_CIRCLE);
      break;
    case KEHRT:
      if (pp.measures.length > 0)
        durchmesser = pp.measures[0];
      else
        durchmesser = 8;
      let prevSeg: Segment;
      if (_editMode === 'append') {
        prevSeg = _segments[_segments.length - 1];
      }
      else {
        prevSeg = getPrevSeg(_segments, _selectedSegment);
      }
      let end: Vector;
      if (prevSeg)
        end = prevSeg.fromEnd(durchmesser);
      else
        end = punkte[1];
      // let center: Vector;
      let tb: Bogen = createBogen(gang, segment.stellung, segment.comment, [punkte[0]], arena, durchmesser, 180, segment.hand);

      savedSeg = new Kehrt(segment.comment, punkte[0], end, tb.center(), gang, segment.stellung, segment.hand);
      break;
    case HINTERHAND_WENDUNG:
      v1 = {x: punkte[0].x, y: punkte[0].y};
      grad = 180;
      if (pp.measures.length > 0)
        grad = pp.measures[0];
      if (_editMode === 'append') {
        prevSeg = _segments[_segments.length - 1];
      }
      else {
        prevSeg = getPrevSeg(_segments, _selectedSegment);
      }
      let center: Vector;
      if (prevSeg)
        center = prevSeg.fromEnd(0.5);
      else
        center = v1;
      savedSeg = wendung_fromPoints(segment.comment, v1, center, gang, stellung, segment.hand, grad,
                                  HINTERHAND_WENDUNG);
      break;
    case PIROUETTE_PIAFFE:
      v1 = {x: punkte[0].x, y: punkte[0].y};
      grad = 360;
      if (pp.measures.length > 0)
        grad = pp.measures[0];
      if (_editMode === 'append') {
        prevSeg = _segments[_segments.length - 1];
      }
      else {
        prevSeg = getPrevSeg(_segments, _selectedSegment);
      }
      if (prevSeg)
        center = prevSeg.fromEnd(0.5);
      else
        center = v1;
      savedSeg = wendung_fromPoints(segment.comment, v1, center, gang, stellung, segment.hand, grad,
                                  PIROUETTE_PIAFFE);
      break;
    case PIROUETTE_GALOPP:
      v1 = {x: punkte[0].x, y: punkte[0].y};
      grad = 360;
      if (pp.measures.length > 0)
        grad = pp.measures[0];
      if (_editMode === 'append') {
        prevSeg = _segments[_segments.length - 1];
      }
      else {
        prevSeg = getPrevSeg(_segments, _selectedSegment);
      }
      if (prevSeg)
        center = prevSeg.fromEnd(1);
      else
        center = v1;
      savedSeg = wendung_fromPoints(segment.comment, v1, center, gang, stellung, segment.hand, grad,
                                  PIROUETTE_GALOPP);
      break;
    case HALT:
      savedSeg = new Halt(segment.comment, punkte[0], segment.dauer);
      break;
    case PIAFFE:
      savedSeg = new Piaffe(segment.comment, punkte[0], segment.dauer);
      break;
    case RUECKWAERTZ:
      savedSeg = new Rueckwaertz(segment.comment, punkte[0], punkte[1], gang, 'GERADE');
      break;
  }
  return savedSeg;
}
export function bauGang(gaenge: Gang[], gesuchterGangName: string,
                    galoppWechselErlaubt?: boolean, anzahlGaloppWechsel?: number,
                    nthStride?: number): Gang {
  'use strict';
  let gs: Gang[] = gaenge.filter( ga => ga.name === gesuchterGangName );
  let gang: Gang;
  if (!gs || gs.length === 0 ) {
    gang = {name: '?', speed: 1}; // default ohne Namen mit speed 1
  }
  else
    gang = {name: gs[0].name, speed: gs[0].speed};

  if (galoppWechselErlaubt) {
    gang.anzahlGaloppWechsel = anzahlGaloppWechsel;
    gang.nthStride = nthStride;
  }
  else {
    gang.anzahlGaloppWechsel = 0;
  }
  return gang;
}
function baueZwischenpunkte(punkte: Vector[], arena: Arena): Vector[] {
  'use strict';
  let zwp: Vector[] = [];
  for (let i: number = 0; i < punkte.length; i++) {
    if (i > 0 && punkte[i - 1].y < 6.1 && punkte[i].y === 0) {
      if (punkte[i - 1].x === 0) {
        zwp.push({x: 0, y: 0});
      }
      else if (punkte[i - 1].x === arena.width()) {
        zwp.push({x: arena.width(), y: 0});
      }
    }
    if (i > 0 && punkte[i - 1].y === 0 && punkte[i].y < 6.1 ) {
      if (punkte[i].x === 0) {
        zwp.push({x: 0, y: 0});
      }
      else if (punkte[i].x === arena.width()) {
        zwp.push({x: arena.width(), y: 0});
      }
    }
    if (i > 0 && punkte[i - 1].y > arena.height() - 6.1 && punkte[i].y === arena.height() ) {
      if (punkte[i - 1].x === 0) {
        zwp.push({x: 0, y: arena.height()});
      }
      else if (punkte[i].x === arena.height()) {
        zwp.push({x: arena.width(), y: arena.height()});
      }
    }
    if (i > 0 && punkte[i - 1].y === arena.height() &&
        punkte[i].y > arena.height() - 6.1 ) {
      if (punkte[i].x === 0) {
        zwp.push({x: 0, y: arena.height()});
      }
      else if (punkte[i].x === arena.width()) {
        zwp.push({x: arena.width(), y: arena.height()});
      }
    }
    if (i > 0 && punkte[i - 1].y > arena.height() - 6.1 &&
        punkte[i].y === arena.height() ) {
      if (punkte[i - 1].x === 0) {
        zwp.push({x:0, y: arena.height()});
      }
      else if (punkte[i - 1].x === arena.width()) {
        zwp.push({x:arena.width(), y: arena.height()});
      }
    }
    zwp.push({x:punkte[i].x, y: punkte[i].y});
  }
  return zwp;
}
function createCircle(gang: Gang, stellung: string, comment: string, punkte: Vector[], durchmesser: number, hand: string, arena: Arena, name?: string, grad?: number, _class?: string): Bogen {
  'use strict';
  let c: Bogen;
  if (punkte.length > 1) {
    c = circleFromPoints(comment, punkte[0], punkte[1], hand, gang, stellung, name, grad, _class);
  }
  else if (punkte.length === 1) {
    let durchmesserOrGrad: number = durchmesser ? durchmesser : arena.width();
    let radius: number;
    if (punkte[0] && punkte[0].x === 0) {
      radius = Math.min(durchmesserOrGrad / 2, Math.abs(arena.height() - punkte[0].y), punkte[0].y);
      c = circleFromPoints(comment, punkte[0], {x:punkte[0].x + radius, y: punkte[0].y}, hand, gang, stellung, name, grad, _class);
    }
    else if (punkte[0] && punkte[0].x === arena.width()) {
      radius = Math.min(durchmesserOrGrad / 2, Math.abs(arena.height() - punkte[0].y), punkte[0].y);
      c = circleFromPoints(comment, punkte[0], {x:punkte[0].x - radius, y: punkte[0].y}, hand, gang, stellung, name, grad, _class);
    }
    else if (punkte[0] && punkte[0].y === 0) {
      radius = Math.min(durchmesserOrGrad / 2, Math.abs(arena.width() - punkte[0].x), punkte[0].x);
      c = circleFromPoints(comment, punkte[0], {x:punkte[0].x, y: punkte[0].y + radius}, hand, gang, stellung, name, grad, _class);
    }
    else if (punkte[0] && punkte[0].y === arena.height()) {
      radius = Math.min(durchmesserOrGrad / 2, Math.abs(arena.width() - punkte[0].x), punkte[0].x);
      c = circleFromPoints(comment, punkte[0], {x:punkte[0].x, y: punkte[0].y - radius}, hand, gang, stellung, name, grad, _class);
    }

  }
  return c;
}
export function createBogen(gang: Gang, stellung: string, comment: string, punkte: Vector[], arena: Arena, durchmesserOrGrad?: number, grad?: number, hand?: string, name?: string): Bogen {
  'use strict';
  let b: Bogen;
  if (!durchmesserOrGrad)
    durchmesserOrGrad = 0;
  if (!grad)
    grad = 360;
  // debugger
  if (punkte.length === 2 && punkte[0] && punkte[1]) {
    grad = durchmesserOrGrad;
    b = bogen_fromPoints(comment, punkte[0], punkte[1], gang, stellung, undefined, hand, name, grad);
  }
  else if (punkte.length === 3) {
    grad = durchmesserOrGrad;
    b = bogen_fromPoints(comment, punkte[0], punkte[1], gang, stellung, punkte[2], hand, name, grad);
  }
  else {
    if (punkte[0] && punkte[0].x === 0) {
      b = bogen_fromPoints(comment, punkte[0], {x: punkte[0].x + durchmesserOrGrad / 2, y: punkte[0].y}, gang, stellung, undefined, hand, name, grad);
    }
    else if (punkte[0] && punkte[0].x === arena.width()) {
      b = bogen_fromPoints(comment, punkte[0], {x: punkte[0].x - durchmesserOrGrad / 2, y: punkte[0].y}, gang, stellung, undefined, hand, name, grad);
    }
    else if (punkte[0] && punkte[0].y === 0) {
      b = bogen_fromPoints(comment, punkte[0], {x:punkte[0].x, y: punkte[0].y + durchmesserOrGrad / 2}, gang, stellung, undefined, hand, name, grad);
    }
    else if (punkte[0] && punkte[0].y === arena.height()) {
        b = bogen_fromPoints(comment, punkte[0], {x:punkte[0].x, y: punkte[0].y - durchmesserOrGrad / 2}, gang, stellung, undefined, hand, name, grad);
    }
  }
  return b;
}
export function getPrevSeg(segments: Segment[], seg: Segment): Segment {
  'use strict';
  let prevSeg: Segment;
  // der Fall von i = 0 bedeutet kein Vorgaenger Segment, dann undefined!
  for (let i: number = 1; i < segments.length; i++) {
    if (segments[i] === seg) {
      prevSeg = segments[i - 1];
      // Ausnahme prevSeg ohne weg!
      if (prevSeg.class() === HALT || prevSeg.class() === PIAFFE && i > 1) {
        prevSeg = segments[i - 2];
      }
      break;
    }
  }
  return prevSeg;
};

export function prepareStandpunkte(_segments: Segment[]): Position[] {
  'use strict';
  let segs: Segment[] = [];
  _segments.forEach( seg => {
    segs.push(seg);
  });
  let standpunkte: Position[] = [];
  segs.reverse();
  let next: Position;
  // let hand: string;
  for (let i: number = 0; i < segs.length; i++) {
    // debugger
    let reverseSeg: Position[] = []; // segs[i].punkte().reverse();
    let segPunkte: Position[] = segs[i].punkte();
    if (segPunkte && segPunkte[0] && segPunkte[0].gang && segPunkte[0].gang.anzahlGaloppWechsel) {
      // ein segment mit fliegenden wechseln
      // nur eine abschätzung in anzahl Positionen
      let anzahlPositionenZwischenWechseln: number = 5 * Math.round(segPunkte[0].gang.speed * segPunkte[0].gang.nthStride);
      if (anzahlPositionenZwischenWechseln * segPunkte[0].gang.anzahlGaloppWechsel > segPunkte.length) {
        // kürzen
        // let faktor = Math.ceil((anzahlPositionenZwischenWechseln * segPunkte[0].gang.anzahlGaloppWechsel) / segPunkte.length );
        // anzahlPositionenZwischenWechseln /= faktor;
        anzahlPositionenZwischenWechseln = segPunkte.length - 10;
      }
      if (segPunkte[0].gang.anzahlGaloppWechsel > 1) {
        let wechselStrecke = anzahlPositionenZwischenWechseln * (segPunkte[0].gang.anzahlGaloppWechsel - 1);
        let firstWechsel = Math.round((segPunkte.length - wechselStrecke) / 2);
        let stellung = segPunkte[0].stellung;
        for (let j: number = 0; j < segPunkte.length; j++) {
          for (let s = 0; s < segPunkte[0].gang.anzahlGaloppWechsel; s++) {
            let z = firstWechsel + s * anzahlPositionenZwischenWechseln;
            if (j === z) {
              stellung = toggleGaloppStellung(stellung);
              break;
            }
          }
          reverseSeg.push( position_fromPosition(segPunkte[j], undefined, undefined, stellung, undefined, undefined) );
        }
      }
      else {
        // nur ein wechsel -> dann in die Mitte
        for (let j: number = 0; j < segPunkte.length; j++) {
          if (j < segPunkte.length / 2)
            reverseSeg.push( segPunkte[j] );
          else {
            let neue_stellung: string = toggleGaloppStellung(segPunkte[j].stellung);
            reverseSeg.push( position_fromPosition(segPunkte[j], undefined, undefined, neue_stellung, undefined, undefined) );
          }
        }
      }
    }
    else {
      for (let j: number = 0; j < segPunkte.length; j++) {
        reverseSeg.push( segPunkte[j] );
      }
    }
    reverseSeg.reverse();
    // hand = segs[i].hand();
    if (standpunkte.length > 0) {
      next = standpunkte[ standpunkte.length - 1 ];
    }
    for (let j: number = 0; j < reverseSeg.length; j++) {
      if (next && vector_distance(next, reverseSeg[j]) < 0.0001 ) {
        // debugger
        continue;
      }
      if (next) {
        standpunkte.push( position_fromPoints(reverseSeg[j], next));
      }
      else {
        // der letzte Punkt
        let dir: number;
        if ( j + 1 < reverseSeg.length)
          dir = vector_phi( vector_subtract(reverseSeg[j], reverseSeg[j+1]) );
        else
          dir = 0;

        standpunkte.push( position_fromPosition(reverseSeg[j], undefined, undefined, undefined, undefined, dir));
      }
      next = reverseSeg[j];
    }
  }
  // smooth directions
  let result: Position[] = smoothStandpunkte(smoothStandpunkte(smoothStandpunkte(smoothStandpunkte(smoothStandpunkte(standpunkte)))));

  return result;
}
function smoothStandpunkte(standpunkte: Position[]): Position[] {
  let result: Position[] = [];
  result.push(standpunkte[standpunkte.length - 1]);
  // console.log('----------------------------');
  for (let i = standpunkte.length - 2; i >= 0; i--) {
    // result.push(standpunkte[i]);
    let d1: number;
    let d3: number;
    if (i > 0) {
      d1 = Math.abs(standpunkte[i + 1].direction || 0);
      let d2 = Math.abs(standpunkte[i].direction || 0);
      d3 = Math.abs(standpunkte[i-1].direction || 0);
      // console.log(d1, d2, d3);
      if ((Math.abs(d1 - d2) < 0.1 && Math.abs(d2 - d3) < 0.1) || (standpunkte[i - 1].gang && standpunkte[i - 1].gang.name === 'Rueckwaertz') || (standpunkte[i + 1].gang && standpunkte[i + 1].gang.name === 'Rueckwaertz')) {
        result.push(standpunkte[i]);
      }
      else {
        let neu: number = getMitteBetweenDirections((standpunkte[i + 1].direction || 0), (standpunkte[i - 1].direction || 0));
        /*if ( (standpunkte[i + 1].direction || 0) * (standpunkte[i - 1].direction || 0) > 0) {
          neu = ((standpunkte[i + 1].direction || 0) + (standpunkte[i - 1].direction || 0)) / 2;
        }
        else {
          neu = (-(standpunkte[i + 1].direction || 0) + (standpunkte[i - 1].direction || 0)) / 2;
        }*/
        let a: Position = standpunkte[i];
        // console.log('neu - alt', neu, standpunkte[i + 1].direction, standpunkte[i].direction, standpunkte[i - 1].direction);
        let ne = {x: a.x, y: a.y, direction: neu, gang: a.gang, rotation: a.rotation, hand: a.hand, stellung: a.stellung};
        result.push(ne);
      }
    }
  }
  if (standpunkte.length > 1)
    result.push(position_fromPosition(standpunkte[0], undefined, undefined, undefined, undefined, standpunkte[1].direction));
  else
    result.push(standpunkte[0]);

  return result;
}
/**
 * directions liegen zwischen -Pi und +Pi
 * der Mittelwert ist (direction2 + direction1) modulo 2Pi geteilt durch 2
 */
export function getMitteBetweenDirections(direction1: number, direction2: number): number {
  let v1: Vector = vector_fromPolar(direction1, 1, true);
  let v2: Vector = vector_fromPolar(direction2, 1, true);
  // console.log('###', direction1, vector_winkel_zwischen(v1, v2), direction2);
  let neu: number;
  let abstand = Math.abs(direction2 - direction1);
  if ((abstand < Math.PI && direction1 < direction2) || (abstand >= Math.PI && direction2 < direction1))
    neu = direction1 + vector_winkel_zwischen(v1, v2) / 2;
  else
    neu = direction1 - vector_winkel_zwischen(v1, v2) / 2;

  // console.log('neu', neu);
  return neu;
}
export function getStartzeitVon(seg: Segment, segments: Segment[]): number {
  'use strict';
  let summe = 0;
  if (segments && seg) {
    for (let i = 0; i < segments.length; i++) {
      if (segments[i] === seg)
        break;

      summe += segments[i].dauer();
    }
  }
  return summe;
}
function toggleGaloppStellung(stellung: string): string {
  if (stellung === 'RECHTS_GEBOGEN')
    return 'LINKS_GEBOGEN';
  else
    return 'RECHTS_GEBOGEN';
}
