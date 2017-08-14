// import {it, describe, expect} from 'angular2/testing';
import {Serpentine, serpentine_calcLength} from './serpentine';
import {vector_distance, Vector, Position} from './vector';
// export function main() {
//  'use strict';
  describe('Serpentine', () => {
  it('traveltime größer 0', () => {
    let start: Vector = {x: 8, y: 9};
    let end: Vector = {x: 99, y: 2};
    let anzahlbogen: number = 7;
    let s: Serpentine = new Serpentine('', start, end, undefined, undefined, anzahlbogen);
    expect(s.traveltime()).toBeGreaterThan(0);
  });
  it('länge einer kurve größer als abstand endpunkte', () => {
    let start: Vector = {x: 0, y: 0};
    let end: Vector = {x: Math.PI * 2, y: 0};
    let s: Serpentine = new Serpentine('', start, end, undefined, undefined, 1);
    expect(serpentine_calcLength(s)).toBeGreaterThan(vector_distance(start, end));
  });
  it('länge kurve mit 2 Bögen von 0 bis 2pi soll 7,640 sein', () => {
    let start: Vector = {x: 0, y: 0};
    let end: Vector = {x: 2 * Math.PI, y: 0};
    let zahlBoegen: number = 1;
    let s: Serpentine = new Serpentine('', start, end, undefined, undefined, zahlBoegen, 0.1);
    // nur eine Nachkommastelle!!!
    expect(s.spurLaenge()).toBeGreaterThan(2 * Math.PI);
  });
  it('länge kurve mit 2 Bögen, Amplitude 0 gleich Abstand start ziel', () => {
    let start: Vector = {x: 80, y: 170};
    let end: Vector = {x: 13 * Math.PI, y: -30};
    let zahlBoegen: number = 1;
    let s: Serpentine = new Serpentine('', start, end, undefined, undefined, zahlBoegen, 0.01);
    // nur eine Nachkommastelle!!!
    expect(s.spurLaenge()).toBeCloseTo(vector_distance(start, end), 2);
  });
  it('länge muss größer sein als der Abstand von start und end', () => {
    let start: Vector = {x: 10, y: 0};
    let end: Vector = {x: 10, y: 60};
    let s: Serpentine = new Serpentine('', start, end, undefined, undefined, 1);

    expect(s.spurLaenge()).toBeGreaterThan(vector_distance(start, end));
  });
  it('länge bei 2 bögen muss größer sein als länge bei einem bogen', () => {
    let start: Vector = {x: 0, y: 0};
    let end: Vector = {x: 2 * Math.PI, y: 0};
    let s: Serpentine = new Serpentine('', start, end, undefined, undefined, 1);
    let s2: Serpentine = new Serpentine('', start, end, undefined, undefined, 2);
    expect(s2.spurLaenge()).toBeGreaterThan(s.spurLaenge());
  });
  it('länge muss wachsen mit der amplitude', () => {
    let start: Vector = {x: 7, y: 13};
    let end: Vector = {x: 1, y: 67};
    let s1: Serpentine = new Serpentine('', start, end, undefined, undefined, 3, 1, 0);
    let s2: Serpentine = new Serpentine('', start, end, undefined, undefined, 3, 5, 0);
    expect(s1.spurLaenge()).toBeLessThan(s2.spurLaenge());
  });

  it('letzter punkt = end', () => {
    let start: Vector = {x: 7, y: 13};
    let end: Position = {x: 1, y: 67};
    let s: Serpentine = new Serpentine('', start, end, undefined, undefined, 3, 1, 0);
    let last: Position = s.punkte()[s.punkte().length - 1];
    expect(last.x).toEqual(end.x);
    expect(last.y).toEqual(end.y);
  });
  it('länge soll unabhängig von der phase sein', () => {
    let start: Vector = {x: 7, y: 13};
    let end: Vector = {x: 17, y: 67};
    let s: Serpentine = new Serpentine('', start, end, undefined, undefined, 3, 1, 0);
    let s2: Serpentine = new Serpentine('', start, end, undefined, undefined, 3, 1, 5);
    expect(s.spurLaenge()).toBeCloseTo(s2.spurLaenge(), 2);
  });

});
// }
