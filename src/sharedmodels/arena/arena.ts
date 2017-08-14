import {Vector, Bahnpunkt, vector_add, vector_rotate, vector_scalar_multiply} from '../segments/vector';
import {Spur} from '../segments/spur';
// import {Standpunkt} from '../segments/shared/standpunkt';
// import {List, Iterator} from 'Immutable';
export class Arena {
  private _width: number;
  private _height: number;
  private _bahnpunkte: Bahnpunkt[] = [];

  constructor(width: number, height: number) {
    this._height = height;
    this._width = width;
    if (height === 60 && width === 20) {
      this._bahnpunkte.push( {x: 10, y: 60, name: 'A'} );
      this._bahnpunkte.push( {x: 20, y: 54, name: 'K'} );
      this._bahnpunkte.push( {x: 20, y: 42, name: 'V'} );
      this._bahnpunkte.push( {x: 20, y: 30, name: 'E'} );
      this._bahnpunkte.push( {x: 20, y: 18, name: 'S'} );
      this._bahnpunkte.push( {x: 20, y: 6, name: 'H'} );
      this._bahnpunkte.push( {x: 10, y: 0, name: 'C'} );
      this._bahnpunkte.push( {x: 0, y: 6, name: 'M'} );
      this._bahnpunkte.push( {x: 0, y: 18, name: 'R'} );
      this._bahnpunkte.push( {x: 0, y: 30, name: 'B'} );
      this._bahnpunkte.push( {x: 0, y: 42, name: 'P'} );
      this._bahnpunkte.push( {x: 0, y: 54, name: 'F'} );
      this._bahnpunkte.push( {x: 10, y: 54, name: 'D'} );
      this._bahnpunkte.push( {x: 10, y: 42, name: 'L'} );
      this._bahnpunkte.push( {x: 10, y: 30, name: 'X'} );
      this._bahnpunkte.push( {x: 10, y: 18, name: 'I'} );
      this._bahnpunkte.push( {x: 10, y: 6, name: 'G'} );

    }
    if (height === 40 && width === 20) {
      this._bahnpunkte.push( {x: 10, y: 40, name: 'A'} );
      this._bahnpunkte.push( {x: 20, y: 34, name: 'K'} );
      this._bahnpunkte.push( {x: 20, y: 20, name: 'E'} );
      this._bahnpunkte.push( {x: 20, y: 6, name: 'H'} );
      this._bahnpunkte.push( {x: 10, y: 0, name: 'C'} );
      this._bahnpunkte.push( {x: 0, y: 6, name: 'M'} );
      this._bahnpunkte.push( {x: 0, y: 20, name: 'B'} );
      this._bahnpunkte.push( {x: 0, y: 34, name: 'F'} );
      this._bahnpunkte.push( {x: 10, y: 20, name: 'X'} );

    }
  }
  public width(): number {
    return this._width;
  }
  public height(): number {
    return this._height;
  }
  public bahnpunkte(): Bahnpunkt[] {
    return this._bahnpunkte;
  }
  /* public circlepoints(): Bahnpunkt[] {
    return this._circlePoints;
  }*/
  public getNameOfBahnpunkt(_x: number, _y: number): string {
    let x: number = Math.round(_x * 10) / 10;
    let y: number = Math.round(_y * 10) / 10;
    /*let bp: Bahnpunkt = this._bahnpunkte.find((p) => {
      return p.x === x && p.y === y;
    });*/
    let bp: Bahnpunkt;
    for (let i: number = 0; i < this._bahnpunkte.length; i++) {
      if (this._bahnpunkte[i].x === x && this._bahnpunkte[i].y === y) {
        bp = this._bahnpunkte[i];
        break;
      }
    }
    if (bp)
      return bp.name;
    else
      return '(' + x + '|' + y + ')';
  }
}
export function createDimension(input: string): any {
  'use strict';
  let breite: number = 0;
  let laenge: number = 0;
  let ziffern: string = '0123456789';
  let tmpStr: string = '';
  let firstSet: boolean = false;
  let ready: boolean = false;
  if (input) {
    for (let i: number = 0; i < input.length; i++) {
      let char: string = input.charAt(i);
      if (ziffern.indexOf(char) >= 0) {
        tmpStr += char;
      }
      else {
        if (tmpStr.length > 0) {
          if (firstSet) {
            laenge = Number(tmpStr);
            ready = true;
          }
          else {
            breite = Number(tmpStr);
            firstSet = true;
          }
          tmpStr = '';
        }
      }
      if (ready) break;
    }
    // Falls nach der letzten Ziffer nichts mehr kommt!
    if (tmpStr.length > 0 && firstSet && !ready) {
      laenge = Number(tmpStr);
    }
  }

/*  var map = new Map<string,number>();
  map.set('breite', breite);
  map.set('laenge', laenge);*/

  return {'breite': breite, 'laenge': laenge};
}
export function createPoints(input: string, bahnpunkte: Bahnpunkt[]): {points: Vector[], measures: number[]} {
  'use strict';
  let allowedPoints: string = 'AFDKPLVBXERISMGHC';
  let points: Vector[] = [];
  let measures: number[] = [];
  let tmpStr: string = '';
  let tmpY: number;
  let tmpX: number;
  if (input) {
    input = input.toUpperCase();
    for (let i: number = 0; i < input.length; i++) {
      let char: string = input.charAt(i);
      if (allowedPoints.indexOf(char) < 0  ) {
        if (char === '(') {
          tmpStr = '';
        } else if (char === ')') {
          tmpY = Number(tmpStr);
          points.push({x: tmpX, y: tmpY});
          tmpStr = '';
        } else if (char === ',' || char === '|') {
          tmpX = Number(tmpStr);
          tmpStr = '';
        }
        else {
          tmpStr += char;
        }
      }
      else {
        if (bahnpunkte) {
          let bp: Bahnpunkt;
          for (let j: number = 0; j < bahnpunkte.length; j++) {
            if (bahnpunkte[j].name === char) {
              bp = bahnpunkte[j];
              break;
            }
          }
            /*let bp = bahnpunkte.find((value, index, obj)=> {
              return value.name() === char;
            })*/

          if (bp) {
            points.push( {x: bp.x, y: bp.y });
          }
        }
      }
    }
    if (tmpStr.length > 0) {
      measures = convertStringToNumberArray(tmpStr);
    }
  }
  return {points: points, measures: measures};
}
export function convertStringToNumberArray(tmpStr: string): number[] {
  'use strict';
  let measures: number[] = [];
  let ziffern: string = '-0123456789.';
  let numStr: string = '';
  for (let i: number = 0; i < tmpStr.length; i++) {
    let char: string = tmpStr.charAt(i);
    if (ziffern.indexOf(char) < 0) {
      // keine Ziffer
      if (numStr.length > 0) {
        if (!isNaN(Number(numStr))) {
          measures.push(Number(numStr));
        }
        numStr = '';
      }
    }
    else {
      // Ziffer
      numStr = numStr + char;
    }
  }
  if (numStr.length > 0) {
    if (!isNaN(Number(numStr))) {
      measures.push(Number(numStr));
    }
  }

  return measures;
}
const gerade: string = 'M -3 -49 L -5 -51 L -4 -47 L -5 -41 L -3 -37 L -5 -21 C -9 -19 -11 -5 -9 -3 C -11' +
                     ' -1 -13 19 -9 23 C -17 44 17 44 9 23 C 11 14 11 4 9 -3 C 10 -9 10 -19 5 -21 L 3 -39' +
                     ' L 4 -41 L 3 -47 L 4 -51 L 3 -49 L -3 -49';
const rechtsGestellt: string = 'M 2 -47 L 0 -48 L 1 -45 L -2 -39 L 0 -35 L -5 -21 C -9 -19 -11 -5 -9 -3 C ' +
                             '-11 -1 -13 19 -9 23 C -17 44 17 44 9 23 C 11 14 11 4 9 -3 C 10 -9 10 -19 5 ' +
                             '-21 L 7 -34 L 9 -37 L 8 -43 L 10 -47 L 8 -46 L 2 -47';

const rechtsGebogen: string = 'M 2 -49 L 0 -48 L 0 -48 L 1 -45 L 1 -45 L -2 -39 L 0 -35 L -5 -21 C -9 -19 -11 ' +
'-5 -9 -3 C -11 -1 -13 19 -8 23 C -13 44 21 44 13 23 C 13 14 13 4 9 -3 C 10 -8 10 -18 5 -20 L 7 -34 L 9 -37 ' +
'L 8 -43 L 10 -47 L 8 -46 L 8 -45';
const linksGestellt: string = 'M -10 -47 L -12 -48 L -11 -45 L -10 -39 L -8 -35 L -6 -21 C -11 -19 -11 -5' +
' -9 -3 C -11 -1 -13 19 -9 23 C -17 44 17 44 9 23 C 11 14 11 4 9 -3 C 10 -9 10 -19 4 -21 L -3 -38 ' +
'L -3 -42 L -4 -46 L -4 -50 L -6 -48 L -6 -48';
const linksGebogen: string = 'M -10 -47 L -12 -48 L -13 -45 L -10 -39 L -8 -35 L -7 -20 C -10 -19 -12 -5 -9 -3 C -10 -1 -12 19 -10 ' +
'21 C -21 44 13 44 7 23 C 11 9 11 4 9 -3 C 8 -9 8 -19 4 -21 L -3 -39 L -3 -42 L -4 -46 L -4 -50 L -6 -51 L -6 -52';

const schulterReinRechts: string = 'M 37.232050807568875 -56.4352447854375 L 35 -56.569219381653056 L 35 -56.569219381653056 L 34.366025403784434 ' +
'-53.47114317029974 L 34.366025403784434 -53.47114317029974 L 28.76794919243112 -49.77499074759311 L 28.499999999999996 -45.31088913245536 L 17.169872981077805 ' +
'-35.68653347947321 C 12 -35.95448267190434 3 -24.83012701892219 4 -22.098076211353316 C 1.97372055837117 -21.366025403784437 -9.758330249197702 -5.045517328095663 ' +
'-7.428203230275507 0.9185842870420906 C -22.258330249197694 16.605117766515306 7.186533479473216 33.605117766515306 9 9 C 14 3.6243556529821426 19 -5.03589838486225 ' +
'20.294228634059948 -13.098076211353316 C 23.66025403784439 -16.92820323027551 28.660254037844386 -25.588457268119896 25.33012701892219 -29.820508075688775 ' +
'L 34.062177826491066 -40.94486372867092 L 37.29422863405995 -42.54293994002423 L 39.42820323027551 -48.239092362730865 L 43.16025403784438 -50.70319397786862 ' +
'L 40.92820323027551 -50.83716857408418 L 40.42820323027551 -49.97114317029974 Z';
const schulterReinLinks: string = 'M -38.16025403784438 -51.70319397786862 L -40.392304845413264 -51.569219381653056 L -39.7583302491977 -48.47114317029974 ' +
'L -34.16025403784438 -44.77499074759311 L -30.428203230275507 -42.31088913245536 L -22.06217782649107 -29.820508075688775 C -24.160254037844386 -27.454482671904337 ' +
'-18.892304845413264 -14.330127018922196 -15.294228634059948 -14.098076211353316 C -15.160254037844387 -11.86602540378444 -6.892304845413266 6.454482671904337 ' +
'-6 2 C -7.15 32.6 23 10.9 11.56217782649107 0.4185842870420906 C 8.026279441628828 -13.705771365940052 5.526279441628828 -18.035898384862243 0.29422863405994804 ' +
'-23.098076211353316 C -3.5717967697244895 -27.794228634059948 -8.57179676972449 -36.45448267190434 -13.035898384862245 -36.18653347947321 L -28.098076211353312 ' +
'-48.27499074759311 L -29.598076211353312 -50.873066958946424 L -32.46410161513775 -53.83716857408418 L -34.46410161513775 -57.30127018922194 L -36.69615242270663 ' +
'-57.16729559300637 L -37.19615242270663 -58.03332099679081 Z';
const schenkelweichenLinks: string = 'M -42.16025403784438 -53.70319397786862 L -44.392304845413264 -53.569219381653056 L -42.02627944162882 -51.47114317029974 ' +
'L -38.16025403784438 -46.77499074759311 L -34.42820323027551 -44.31088913245536 L -25.696152422706632 -33.18653347947321 C -29.026279441628823 -28.954482671904337 ' +
'-22.02627944162883 -16.830127018922195 -19.294228634059948 -16.098076211353316 C -20.02627944162883 -13.36602540378444 -11.758330249197703 4.954482671904337 ' +
'-6.29422863405995 6.418584287042091 C -2.722431864335462 28.605117766515303 26.722431864335455 11.605117766515304 9.294228634059948 -2.5814157129579094 C ' +
'6.526279441628827 -11.375644347017856 1.5262794416288283 -20.035898384862243 -3.705771365940052 -25.098076211353316 C -5.839745962155612 -30.794228634059948 ' +
'-10.839745962155613 -39.45448267190434 -17.035898384862243 -38.18653347947321 L -31.598076211353312 -49.408965343808674 L -33.598076211353316 -52.873066958946424 ' +
'L -36.46410161513775 -55.83716857408418 L -38.46410161513775 -59.30127018922194 L -39.19615242270663 -56.569219381653056 L -39.19615242270663 -56.569219381653056 Z';
const schenkelweichenRechts: string = 'M 37.232050807568875 -57.70319397786862 L 36 -59.569219381653056 L 35.366025403784434 -56.47114317029974 L 29.767949192431118 ' +
'-52.77499074759311 L 29.499999999999996 -48.31088913245536 L 18.169872981077805 -38.68653347947321 C 13.70577136594005 -38.95448267190434 4.973720558371173 ' +
'-27.83012701892219 5.705771365940052 -25.098076211353316 C 2.9737205583711717 -24.366025403784437 -8.758330249197702 -8.045517328095665 -7.294228634059948 ' +
'-2.5814157129579094 C -24.722431864335455 11.605117766515303 4.722431864335462 28.605117766515306 8.29422863405995 6.418584287042091 C 14.526279441628827 ' +
'-0.3756443470178574 19.526279441628827 -9.035898384862247 21.294228634059948 -16.098076211353316 C 25.160254037844386 -20.794228634059948 30.160254037844386 ' +
'-29.454482671904337 26.83012701892219 -33.68653347947321 L 35.062177826491066 -43.94486372867092 L 38.29422863405995 -45.54293994002423 L 40.42820323027551 ' +
'-51.239092362730865 L 44.16025403784438 -53.70319397786862 Z';
const renverRechtehand: string = 'M 27.83974596215561 -57.70319397786862 L 26.607695154586732 -59.569219381653056 L 24.24166975080229 -57.47114317029974 L 23.83974596215561 ' +
'-50.77499074759311 L 23.571796769724486 -46.31088913245535 L 17 -32.82050807568878 C 14 -33.45448267190434 5 -22.33012701892219 6 -19.098076211353316 C 4.839745962155613 ' +
'-17.866025403784437 -6.892304845413264 -1.5455173280956647 -6.1602540378443855 1.186533479473212 C -27.186533479473212 15.605117766515303 2.2583302491977086 ' +
'32.605117766515306 12 8 C 19 1.294228634059948 22 -3.0358983848622465 23 -10.098076211353316 C 25 -15.794228634059948 30 -24.454482671904337 28 -28.186533479473212 L ' +
'29.90192378864668 -47.27499074759311 L 31.40192378864668 -49.873066958946424 L 32.53589838486224 -53.83716857408418 L 34.53589838486224 -57.30127018922194 L ' +
'33.30384757729337 -59.16729559300637 L 33.80384757729337 -60.03332099679081 Z';
const traverLinkehand: string = 'M 5.839745962155611 -31.703193977868622 L 4.607695154586732 -33.569219381653056 L 2.2416697508022914 -31.47114317029974 L 1.839745962155611 ' +
'-24.774990747593108 L 1.571796769724486 -20.31088913245535 L -5 -6.820508075688778 C -8 -7.454482671904337 -17 3.669872981077809 -16 6.901923788646684 C -17.16025403784439 ' +
'8.133974596215563 -28.892304845413264 24.454482671904337 -28.160254037844386 27.186533479473212 C -49.18653347947321 41.605117766515306 -19.74166975080229 ' +
'58.605117766515306 -10 34 C -3 27.294228634059948 0 22.964101615137753 1 15.901923788646684 C 3 10.205771365940052 8 1.545517328095663 6 -2.186533479473212 L ' +
'7.90192378864668 -21.274990747593108 L 9.40192378864668 -23.873066958946424 L 10.535898384862245 -27.83716857408418 L 12.535898384862245 -31.30127018922194 L ' +
'11.303847577293368 -33.16729559300637 L 11.803847577293368 -34.03332099679081 Z';
const renverLinkehand: string = 'M -33.76794919243112 -61.4352447854375 L -35 -59.569219381653056 L -35 -59.569219381653056 L -32.63397459621556 -57.47114317029974 L ' +
'-32.63397459621556 -57.47114317029974 L -32.232050807568875 -50.77499074759311 L -28.499999999999996 -48.31088913245536 L -25.83012701892219 -33.68653347947321 C ' +
'-28.294228634059948 -29.954482671904337 -23.02627944162883 -16.830127018922195 -23 -16.098076211353316 C -22 -13.36602540378444 -14 4.954482671904337 -10 5.918584287042091 ' +
'C -0.25833024919770864 26.605117766515303 29.186533479473212 9.605117766515304 8 -6 C 5 -12.375644347017856 0 -21.035898384862243 -4.705771365940052 -25.098076211353316 ' +
'C -6.339745962155613 -29.928203230275507 -11.339745962155613 -38.588457268119896 -16.669872981077805 -37.82050807568878 L -21.937822173508923 -50.94486372867092 L ' +
'-21.70577136594005 -54.54293994002423 L -25.57179676972449 -59.239092362730865 L -25.83974596215561 -63.70319397786862 L -27.07179676972449 -61.83716857408418 L ' +
'-26.57179676972449 -60.97114317029974 Z';
const traverRechtehand: string = 'M -12.767949192431118 -61.4352447854375 L -14 -59.569219381653056 L -14 -59.569219381653056 L -11.633974596215559 -57.47114317029974 ' +
'L -11.633974596215559 -57.47114317029974 L -11.232050807568875 -50.77499074759311 L -7.4999999999999964 -48.31088913245536 L -4.830127018922191 -33.68653347947321 C ' +
'-7.294228634059948 -29.954482671904337 -2.02627944162883 -16.830127018922195 -2 -16.098076211353316 C -1 -13.36602540378444 7 4.954482671904337 11 5.918584287042091 ' +
'C 20.74166975080229 26.605117766515303 50.18653347947321 9.605117766515304 29 -6 C 26 -12.375644347017856 21 -21.035898384862243 16.294228634059948 -25.098076211353316 ' +
'C 14.660254037844387 -29.928203230275507 9.660254037844387 -38.588457268119896 4.3301270189221945 -37.82050807568878 L -0.9378221735089234 -50.94486372867092 L ' +
'-0.7057713659400484 -54.54293994002423 L -4.5717967697244895 -59.239092362730865 L -4.839745962155611 -63.70319397786862 L -6.0717967697244895 -61.83716857408418 L ' +
'-5.5717967697244895 -60.97114317029974 Z';

export function drawAnimation(ctx: CanvasRenderingContext2D, x: number = 10, y: number = 10,
                              phi: number, stellung: string, rotation: number): void {
  'use strict';
  ctx.clearRect(0, 0, 2000, 2000);

  let scale: number = 0.25;
  let token: string[];

  if (stellung) {
    switch ( stellung ) {
      case 'RECHTS_GESTELLT' :
        token = rechtsGestellt.split(' ');
        break;
      case 'LINKS_GESTELLT' :
        token = linksGestellt.split(' ');
        break;
      case 'RECHTS_GEBOGEN' :
        token = rechtsGebogen.split(' ');
        break;
      case 'LINKS_GEBOGEN' :
        token = linksGebogen.split(' ');
        break;
      case 'SCHULTER_HEREIN_RECHTS' :
        token = schulterReinRechts.split(' ');
        break;
      case 'SCHULTER_HEREIN_LINKS' :
        token = schulterReinLinks.split(' ');
        break;
      case 'SCHENKELWEICHEN_LINKS' :
        token = schenkelweichenLinks.split(' ');
        break;
      case 'SCHENKELWEICHEN_RECHTS' :
        token = schenkelweichenRechts.split(' ');
        break;
      case 'RENVER_RECHTEHAND' :
        token = renverRechtehand.split(' ');
        break;
      case 'TRAVER_LINKEHAND' :
        token = traverLinkehand.split(' ');
        break;
      case 'RENVER_LINKEHAND' :
        token = renverLinkehand.split(' ');
        break;
      case 'TRAVER_RECHTEHAND' :
        token = traverRechtehand.split(' ');
        break;
      default :
        token = gerade.split(' ');
        break;
    }
  }
  else {
    token = gerade.split(' ');
  }

  let translateVector: Vector = {x: x, y: y};
  phi = phi - Math.PI / 2;
  phi = phi + rotation;
  ctx.beginPath();
  for (let i: number = 0; i < token.length; ) {
    if (token[i] === 'M') {
      let v: Vector = vector_rotate({x: Number(token[i + 1]), y: Number(token[i + 2])}, phi);
      v = vector_scalar_multiply(scale, v);
      v = vector_add(v, translateVector);

      // ctx.moveTo(x + scale*Number(token[i+1]), y + scale*Number(token[i+2]));
      ctx.moveTo(v.x, v.y);
      i = i + 3;
    }
    else if (token[i] === 'L') {
      let v: Vector = vector_rotate({x: Number(token[i + 1]), y: Number(token[i + 2])}, phi);
      v = vector_scalar_multiply(scale, v);

      v = vector_add(v, translateVector);

      // ctx.lineTo(x + scale*Number(token[i+1]), y + scale*Number(token[i+2]));
      ctx.lineTo(v.x, v.y);
      i = i + 3;
    }
    else if (token[i] === 'C') {
      let v: Vector = vector_rotate({x: Number(token[i + 1]), y: Number(token[i + 2])}, phi);
      v = vector_scalar_multiply(scale, v);
      v = vector_add(v, translateVector);

      let v2: Vector = vector_rotate({x: Number(token[i + 3]), y: Number(token[i + 4])}, phi);
      v2 = vector_scalar_multiply(scale, v2);
      v2 = vector_add(v2, translateVector);

      let v3: Vector = vector_rotate({x: Number(token[i + 5]), y: Number(token[i + 6])}, phi);
      v3 = vector_scalar_multiply(scale, v3);
      v3 = vector_add(v3, translateVector);

      ctx.bezierCurveTo(v.x, v.y, v2.x, v2.y, v3.x, v3.y);
      i = i + 7;
    }
    else {
      i = i + 1;
    }
  }
  ctx.stroke();
}
export function drawSpur(ctx: CanvasRenderingContext2D, spur: Spur, scale: number, randBreite: number,
                         arena: Arena, abweichung: number = 0): void {
  'use strict';
  // let anfang: number = performance.now();
  if (!spur || !arena)
    return;
  // ctx.clearRect(0, 0, 2000, 2000);
  let punkte: Vector[] = spur.punkte();
  if (!punkte || punkte.length === 0)
    return;

  let prev: Vector = punkte[0];
  ctx.lineWidth = 0.2;
  ctx.strokeStyle = '#0000FF'; // default
  ctx.strokeStyle = spur.color();
  if (spur.color() === '#FF0000' || spur.color() === '#ff0000') {
    ctx.lineWidth = 1.4;
  }
  ctx.beginPath();
  ctx.moveTo(translateX(prev.x + abweichung, scale, randBreite), translateY(prev.y + abweichung, scale, randBreite, arena));

  for (let i: number = 1; i < punkte.length; i++) {
    let p: Vector = punkte[i];
    ctx.lineTo(translateX(p.x + abweichung, scale, randBreite), translateY(p.y + abweichung, scale, randBreite, arena));
  }
  ctx.stroke();
}
/***********************************************
 * zeichnet Rahmen auf das unterste canvas
 */
export function drawRahmen(ctx: CanvasRenderingContext2D, scale: number, randBreite: number,
                           arena: Arena, fontsize: number): void {
  'use strict';
  if (!ctx || !arena)
    return;
  ctx.fillStyle = '#ffffe6';
  ctx.fillRect(randBreite, randBreite, translateX(arena.width(), scale, 0),
               arena.height() * scale);

  ctx.beginPath();
  ctx.lineWidth = 0.2;
  ctx.strokeStyle = '#000000';

  ctx.rect(0, 0, translateX(arena.width(), scale, 2 * randBreite),
           arena.height() * scale + 2 * randBreite);
  ctx.stroke();

}
/***********************************************
 * zeichnet Gitterlinien auf das unterste canvas
 */
export function drawGitter(ctx: CanvasRenderingContext2D, scale: number, randBreite: number,
                           arena: Arena, fontsize: number): void {
  'use strict';
  if (!ctx || !arena)
    return;
  ctx.lineWidth = 0.1;
  ctx.strokeStyle = '#FF0000';
  ctx.beginPath();

  for (let i: number = 1; i < arena.width(); i++) {
    if (i % 5 !== 0) {
      ctx.moveTo(translateX(i, scale, randBreite), translateY(0, scale, randBreite, arena));
      ctx.lineTo(translateX(i, scale, randBreite), translateY(arena.height(), scale, randBreite, arena));
    }
  }
  for (let i: number = 1; i < arena.height(); i++) {
    if ( i % 5 !== 0 ) {
      ctx.moveTo(translateX(0, scale, randBreite), translateY(i, scale, randBreite, arena));
      ctx.lineTo(translateX(arena.width(), scale, randBreite), translateY(i, scale, randBreite, arena));
    }
  }
  ctx.stroke();

  ctx.strokeStyle = '#0000FF';
  ctx.lineWidth = 0.2;
  ctx.beginPath();
  for (let i: number = 5; i < arena.width(); i = i + 5) {
    ctx.moveTo(translateX(i, scale, randBreite), translateY(0, scale, randBreite, arena));
    ctx.lineTo(translateX(i, scale, randBreite), translateY(arena.height(), scale, randBreite, arena));
  }
  for (let i: number = 5; i < arena.height(); i = i + 5) {

    ctx.moveTo(translateX(0, scale, randBreite), translateY(i, scale, randBreite, arena));
    ctx.lineTo(translateX(arena.width(), scale, randBreite), translateY(i, scale, randBreite, arena));
  }
  ctx.stroke();
  let fs: number = Math.floor(1 * scale);
  ctx.font = fs + 'px Arial';
  ctx.fillStyle = '#000000';
  for (let i: number = 0; i <= arena.height(); i += 10) {
    let x: number = 0; // translateX(i, scale, randBreite);
    let y: number = translateY(i, scale, randBreite, arena);
    let chr: string = i.toString();
    ctx.fillText(chr, x, y);
  }
  for (let i: number = 0; i <= arena.width(); i += 10) {
    let y: number = translateY(0, scale, 2 * randBreite, arena);
    let x: number = translateX(i, scale, randBreite);
    let chr: string = i.toString();
    ctx.fillText(chr, x, y);
  }
  // let end: number = performance.now();
  // console.log('drawGitter took ' + (end - start) + 'ms');
}
export function getNearByBahnpunkt(x: number, y: number, toleranz: number, arena: Arena): Bahnpunkt {
  'use strict';
  if (!arena)
    return {name: '', x: 0, y: 0};
  // ränder
  if (x < 0)
    x = 0;
  if (y < 0)
    y = 0;
  if ( x > arena.width())
    x = arena.width();
  if ( y > arena.height())
    y = arena.height();
  /*let bp: Bahnpunkt = arena.bahnpunkte().find( b => {
    return Math.abs(x - b.x) < toleranz && Math.abs(y - b.y) < toleranz;
  });*/
  let bp: Bahnpunkt;
  for (let i: number = 0; i < arena.bahnpunkte().length; i++) {
    if (Math.abs(x - arena.bahnpunkte()[i].x) < toleranz &&
        Math.abs(y - arena.bahnpunkte()[i].y) < toleranz) {
      bp = arena.bahnpunkte()[i];
      break;
    }
  }
  if (bp)
    return bp;
  else
    return {x: Math.round(x), y: Math.round(y), name: '(' + Math.round(x) + '|' + Math.round(y) + ')'};
}
export function drawBahnpunkte(ctx: CanvasRenderingContext2D, scale: number, randBreite: number,
                               arena: Arena, fontSize: number): void {
  'use strict';
  if (!arena || !ctx) return;
  // console.log('Fontsize und scale ', fontSize, scale);
  let fs: number = Math.ceil(1.5 * scale);
  ctx.font = fs + 'px Arial';
  arena.bahnpunkte().forEach( (value, index, arr) => {
    let offsetX: number = 0;
    let offsetY: number = 0;

    if (value.x > arena.width() / 2) {
      offsetX = 1;
    }
    else if (value.x < arena.width() / 2) {
      offsetX = -2;
    }
    else {
      offsetX = -0.5;
    }
    if (value.y === arena.height()) {
      offsetY = 1;
    } else if ( value.y === 0) {
      offsetY = -2;
    }
    else {
      offsetY = -0.5;
    }
    let x: number = translateX(value.x + offsetX, scale, randBreite);
    let y: number = translateY(value.y + offsetY, scale, randBreite, arena);
    let chr: string = value.name;
    ctx.fillText(chr, x, y);
  });
  if (arena.width() === 20 && arena.height() === 60) {
    ctx.beginPath();
    ctx.arc(translateX(0, scale, randBreite), translateY(10, scale, randBreite, arena), 0.3 * scale, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(translateX(0, scale, randBreite), translateY(30, scale, randBreite, arena), 0.3 * scale, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(translateX(0, scale, randBreite), translateY(50, scale, randBreite, arena), 0.3 * scale, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(translateX(20, scale, randBreite), translateY(10, scale, randBreite, arena), 0.3 * scale, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(translateX(20, scale, randBreite), translateY(30, scale, randBreite, arena), 0.3 * scale, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(translateX(20, scale, randBreite), translateY(50, scale, randBreite, arena), 0.3 * scale, 0, 2 * Math.PI);
    ctx.fill();

  }
  if (arena.width() === 20 && arena.height() === 40) {
    ctx.beginPath();
    ctx.arc(translateX(0, scale, randBreite), translateY(10, scale, randBreite, arena), 0.3 * scale, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(translateX(0, scale, randBreite), translateY(30, scale, randBreite, arena), 0.3 * scale, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(translateX(20, scale, randBreite), translateY(10, scale, randBreite, arena), 0.3 * scale, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(translateX(20, scale, randBreite), translateY(30, scale, randBreite, arena), 0.3 * scale, 0, 2 * Math.PI);
    ctx.fill();

  }
}

export function translateX(x: number, scale: number, randBreite: number): number {
  'use strict';
  return x * scale + randBreite;
}
export function translateY(y: number, scale: number, randBreite: number, arena: Arena ): number {
  'use strict';
  if (!arena) {
    console.log('Illegal use of translateY, arena undefined');
    return 0;
  }

  return randBreite + ((arena.height() - y) * scale);
}
export function convertX(x: number, scale: number, randBreite: number): number {
  'use strict';
  return (x - randBreite) / scale;
}
export function convertY(y: number, scale: number, randBreite: number, arena: Arena ): number {
  'use strict';
  return arena.height() - (y - randBreite) / scale;
}
