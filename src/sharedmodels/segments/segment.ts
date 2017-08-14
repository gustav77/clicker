'use strict';

import {Vector, Position, vector_distance} from './vector';
import {Spur} from './spur';
import {Gang} from './gang';
export const KEHRT: string = 'Kehrt_seg';
export const HALT: string = 'Halt_seg';
export const PIAFFE: string = 'Piaffe_seg';
export const RUECKWAERTZ: string = 'Rueckwaertz_seg';
export const LINE: string = 'Line_seg';
export const BOGEN: string = 'Bogen_seg';
export const SERPENTINE: string = 'Serpentine_seg';
export const ECKE: string = 'Ecke_seg';
export const CIRCLE: string = 'Circle_seg';
export const HALF_CIRCLE: string = 'Half_Circle_seg';
export const ZIGZAG: string = 'ZigZag_seg';
export const WENDUNG: string = 'Wendung_seg';
export const HINTERHAND_WENDUNG: string = 'HinterhandWendung_seg';
export const PIROUETTE_PIAFFE: string = 'Pirouette_piaffe_seg';
export const PIROUETTE_GALOPP: string = 'Pirouette_galopp_seg';
export const LINKE_HAND: string = 'linke_hand';
export const RECHTE_HAND: string = 'rechte_hand';

export const FLYING_CHANGES: string = 'Flying_Changes_helper';
export abstract class Segment {
  private _comment: string;
  private _start: Vector;
  private _end: Vector;
  private _class: string;
  private _hand: string;
  private _spur: Spur;
  private _gang: Gang;
  private _stellung: string;
  constructor(comment: string, start: Vector, end: Vector, mclass: string, gang: Gang, stellung: string,
              hand?: string) {
    this._comment = comment;
    this._start = start;
    this._end = end;
    this._class = mclass;
    this._hand = hand;
    this._gang = gang;
    this._stellung = stellung;
  }
  public comment(): string {
    return this._comment;
  }
  public gang(): Gang {
    return this._gang;
  }
  public stellung(): string {
    return this._stellung;
  }
  public startAsString(): string {
    if (this._start)
      return this._start.toString();
    else
      return '';
  }
  public endAsString(): string {
    if (this._end)
      return this._end.toString();
    else
      return '';
  }
  public start(): Vector {
    return this._start;
  }
  public end(): Vector {
    return this._end;
  }
  public hand(): string {
    return this._hand;
  }
  public class(): string {
    return this._class;
  }
  public spurLaenge(): number {
    if (! this._spur) {
      this._spur = new Spur(this.punkte());
    }
    return this._spur.laenge();
  }
  public dauer(): number {
    if (this.gang() && this.gang().speed > 0) {
      return this.spurLaenge() / this.gang().speed;
    }
    else
      return 0;
  }
  public anzahlPunkte(): number {
    return this.punkte().length;
  }

  public spur(color: string = '#0000FF'): Spur {
    if (! this._spur || this._spur.color() !== color) {
      this._spur = new Spur(this.punkte(), color);
    }
    return this._spur;
  }
  public abstract toJSON(): any;
  public abstract punkte(): Position[];
  // public abstract equals(seg: Segment): boolean;
  // public abstract copy(): Segment;
  public traveltime(speed?: number): number {

    if (speed && speed !== 0) {
      return this.spurLaenge() / speed;
    }
    else {
      return this.spurLaenge();
    }
  }
  public fromEnd(entfernung: number): Vector {
    let distanz: number = 0;
    for (let i: number = this.punkte().length - 2; i >= 0; i--) {
      distanz += vector_distance(this.punkte()[i], this.punkte()[i + 1]);
      if (distanz >= entfernung)
        return (this.punkte()[i]);
    }
    return undefined;
  }
}
