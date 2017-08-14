
/**
 * Immutable class Serpentine
 */
import {Segment, SERPENTINE} from './segment';
import {Vector, Position, vector_phi} from './vector';
import {vector_subtract, vector_distance, position_add, vector_rotate} from './vector';
import {ANZAHL_PUNKTE_PRO_EINHEIT} from './spur';
import {Gang} from './gang';

export class Serpentine extends Segment {
  private _anzahlBoegen: number;
  private _amp: number;
  private _phase: number;
  private rotation: number;
  private _scale: number;
  private _punkte: Position[];
  // private _laenge: number;
  private anzahlDeltas: number;

  constructor(comment: string, _start: Vector, _end: Vector, gang: Gang, stellung: string, anzahlBoegen: number,
              amp: number = 1, phase: number = 0, hand?: string) {
    super(comment, _start, _end, SERPENTINE, gang, stellung, hand);
    this._amp = amp;
    this._anzahlBoegen = anzahlBoegen;
    this._phase = phase;
    // auf x-Achse verschieben
    let v1: Vector = vector_subtract(_end, _start);
    this.rotation = vector_phi( v1 );
    let distanz: number = vector_distance(_start, _end);
    this._scale = 2 * Math.PI * this._anzahlBoegen / distanz;

    this.anzahlDeltas = Math.ceil(distanz) * ANZAHL_PUNKTE_PRO_EINHEIT;
  }
  public toJSON(): any {
    return {_comment: this.comment(), _start: this.start(), _end: this.end(), _anzahlBoegen: this.anzahlBoegen(),
      _amp: this.amp(), _phase: this.phase(), hand: this.hand(), class: SERPENTINE,
      _gang: this.gang(), _stellung: this.stellung() };

  }
  public equals(that: Serpentine): boolean {
      return (this.start().x === that.start().x) &&
              (this.start().y === that.start().y) &&
              (this.end().x === that.end().x) &&
              (this.end().y === that.end().y) &&
              (this.phase() === that.phase()) &&
              (this.anzahlBoegen() === that.anzahlBoegen()) &&
              (this.amp() === that.amp());
    }
  public scale(): number {
    return this._scale;
  }
  public phase(): number {
    return this._phase;
  }
  public amp(): number {
    return this._amp;
  }
  public anzahlBoegen(): number {
    return this._anzahlBoegen;
  }
  /*public laenge(): number {
    if (typeof this._laenge === 'undefined')
      this._laenge = serpentine_calcLength(this);
    return this._laenge;
  }*/
  public cut(p: Vector): any {
    let vorne: any;
    let hinten: any;
    return {vorne, hinten};
  }
  /**
   * lazy, punkte werden nur einmal berechnet und dann gecached
   */
  public punkte(): Position[] {
    if (!this._punkte) {
      let standpunkte: Position[] = [];
      let nextPunkt: Position = {x: this.start().x, y: this.start().y, direction: 0, hand: this.hand(), stellung: this.stellung(), gang: this.gang()};
      let i: number = 0;
      let delta: number = 0.01;
      standpunkte.push( nextPunkt );
      let distanz: number = vector_distance(this.start(), this.end());
      while (1) {
        i++;
        let _x1: number = i * delta; // this._phase;
        let phase: number = this._phase * Math.PI / 180;
        let amplitude: number = 0.5 * this._amp;
        let versatz: number = amplitude * Math.sin(phase);
        let _x2: number = i * delta;
        let p1: Vector = {x: _x2, y: Math.sin(_x1 * this.scale() + phase) * amplitude - versatz};
        nextPunkt = position_add(vector_rotate(p1, -this.rotation), this.start());

        if (_x1 > distanz || vector_distance(this.end(), nextPunkt) <= 1 / ANZAHL_PUNKTE_PRO_EINHEIT) {
            // fertig
          standpunkte.push( {x: this.end().x, y: this.end().y, direction: 0, hand: this.hand(), stellung: this.stellung(), gang: this.gang()} );
          break;
        }
        else if (vector_distance(nextPunkt, standpunkte[standpunkte.length - 1]) >= 1 / ANZAHL_PUNKTE_PRO_EINHEIT) {
          // Abstand zum letzten punkt >= 0.1
          standpunkte.push( {x: nextPunkt.x, y: nextPunkt.y, direction: 0, hand: this.hand(), stellung: this.stellung(), gang: this.gang()} );
        }
        if (i > 30000) {
          // console.log('!!!!!!!!!!!!!!!!!!!!!');
          break;
        }
      }
      this._punkte = standpunkte;
    }
    return this._punkte;
  }
}
export function serpentine_fromJSON(json: string): Serpentine {
  'use strict';
  return serpentine_fromObject( JSON.parse(json) );
}
export function serpentine_fromObject(tmp: any): Serpentine {
  'use strict';
  return new Serpentine(tmp._comment, tmp._start, tmp._end,
                        tmp._gang, tmp._stellung, tmp._anzahlBoegen,
                        tmp._amp, tmp._phase, tmp.hand);
}

export function serpentine_calcLength(ser: Serpentine): number {
  'use strict';
  // Näherung: gefunden auf http://www.mathematik-online.de/F55.htm
  let delta: number = 0.1;
  let abstand: number = vector_distance(ser.start(), ser.end());

  let laenge: number = 0;
  for (let i: number = 0; i < abstand / delta; i++) {
      laenge += hoelzchenLaenge(i * delta, delta, ser.scale(), ser.phase(), ser.amp());
  }
  return laenge;
}

function hoelzchenLaenge(_x: number, delta: number, scale: number, phase: number, amp: number): number {
  'use strict';
  let x: number = _x + phase;
  return Math.sqrt( Math.pow( ( (Math.sin(scale * (x + delta)) - Math.sin(scale * x)) * amp / delta), 2) + 1) * delta;
}
