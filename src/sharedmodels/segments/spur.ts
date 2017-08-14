import {Position, vector_distance} from './vector';
export const ANZAHL_PUNKTE_PRO_EINHEIT: number = 10;

export class Spur {
  private _punkte: Position[];
  private _color: string;
  private _laenge: number;

  constructor( punkte: Position[], color: string = '#0000FF') {
    // this._punkte = List<Standpunkt>(punkte);
    this._color = color;
    this._punkte = punkte; // this.reduce(punkte);
  };
  public color(): string {
    return this._color;
  }
  public punkte(): Position[] {
    return this._punkte;
  }
  /**
   * errechnet die Summe der Distanzen zwischen den Standpunkten
   */
  public laenge(): number {
    if (this._laenge)
      return this._laenge;

    this._laenge = 0;
    for (let i: number = 1; i < this._punkte.length; i++) {
      this._laenge += vector_distance(this._punkte[i - 1], this._punkte[i]);
    }
    return this._laenge;
  }

  /**
   * die Zeit in Sekunden um die Spur zu durchlaufen
   * der speed ist gleich dem speed des Ganges oder 1
   * startpunkt und endpunkt sind weg marken auf der Spur, default vom anfang zum ende
   */
  public dauer(startpunkt?: number, endpunkt?: number): number {
    if (!this._punkte || this._punkte.length === 0)
      return 0;
    startpunkt = startpunkt || 0;
    endpunkt = endpunkt || Number.MAX_VALUE;
    let time = 0;
    let weg = 0;
    let gang = this._punkte[0].gang || {name:'', speed: 1};
    for (let i: number = 1; i < this._punkte.length; i++) {
      let teilstueck = vector_distance(this._punkte[i - 1], this._punkte[i]);
      weg += teilstueck;
      if (this._punkte[i - 1].gang)
        gang = this._punkte[i - 1].gang;
      if (weg > startpunkt && weg <= endpunkt)
        time += teilstueck / gang.speed;
      if (weg > endpunkt)
        break;
    }
    return time;
  }
  public indexNachTime(zeitpunkt: number): number {
    if (this._punkte.length === 0)
      return 0;
    let time = 0;
    let gang = this._punkte[0].gang || {name:'', speed: 1};
    for (let i: number = 1; i < this._punkte.length; i++) {
      let teilstueck = vector_distance(this._punkte[i - 1], this._punkte[i]);
      // weg += teilstueck;
      if (this._punkte[i - 1].gang)
        gang = this._punkte[i - 1].gang;

      time += teilstueck / gang.speed;
      if (time >= zeitpunkt) {
        return i;
      }
    }
    return this._punkte.length - 1;
  }
  public teilspurVonBis(startzeit: number, endzeit?: number, color?: string): Spur {
    // console.log(startzeit, endzeit);
    endzeit = endzeit || Number.MAX_VALUE;
    let anfang = this.indexNachTime(startzeit);
    let ende: number;
    if (endzeit)
      ende = this.indexNachTime(endzeit);
    else
      ende = this._punkte.length;
    // console.log(anfang, ende);
    let teilsp: Position[] = this._punkte.slice(anfang, ende);
    return new Spur(teilsp, color);
  }
  /**
   * Teilspur zwischen den beiden weg marken
   */
  public teilspur(vonPunkt: number, bisPunkt?: number, color?: string): Spur {
    let weg: number = 0;
    let teilsp: Position[] = [];
    if (! bisPunkt)
      bisPunkt = Number.MAX_VALUE;

    if (vonPunkt < bisPunkt) {
      teilsp.push(this._punkte[0]);
      for (let i: number = 1; i < this._punkte.length; i++) {
        weg += vector_distance(this._punkte[i - 1], this._punkte[i]);
        if (weg >= vonPunkt && weg <= bisPunkt) {
          teilsp.push(this._punkte[i]);
        }
        if (weg > bisPunkt)
          break;
      }
    }
    else if (bisPunkt < vonPunkt) {
      // rueckwaertz
      for (let i: number = 1; i < this._punkte.length; i++) {
        weg += vector_distance(this._punkte[i - 1], this._punkte[i]);
        if (weg >= bisPunkt && weg <= vonPunkt) {
          teilsp.push(this._punkte[i]);
        }
        if (weg > vonPunkt)
          break;
      }
      teilsp.reverse();
    }
    else {
      // halten
    }
    return new Spur(teilsp, color);
  }
}
