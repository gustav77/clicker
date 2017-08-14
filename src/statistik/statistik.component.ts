import {Component, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {Segment} from '../sharedmodels/segments/segment';
import {Observable, Subscription} from 'rxjs/Rx';
// import {DauerPipe} from '../sharedmodels/utils/dauer.pipe';
// import {WegPipe} from '../sharedmodels/utils/weg.pipe';
import {PIAFFE, HALT} from '../sharedmodels/segments/segment';
@Component({
  selector: 'statistik',
  templateUrl: 'statistik.html',
})
export class StatistikComponent implements OnInit {
  private store: Store<any>;
  private segments: Observable<Segment[]>;
  private segmentsSubscription: Subscription;
  private _segments: Segment[];
  private _dauer: number;
  private _laenge: number;
  private _schrittVersammelt: number;
  private _schrittVersammeltStrecke: number;
  private _schritt: number;
  private _schrittStrecke: number;
  private _schrittMittel: number;
  private _schrittMittelStrecke: number;
  private _schrittStark: number;
  private _schrittStarkStrecke: number;

  private _galoppVersammelt: number;
  private _galoppVersammeltStrecke: number;
  private _galopp: number;
  private _galoppStrecke: number;
  private _galoppMittel: number;
  private _galoppMittelStrecke: number;
  private _galoppStark: number;
  private _galoppStarkStrecke: number;

  private _trabVersammelt: number;
  private _trabVersammeltStrecke: number;
  private _trab: number;
  private _trabStrecke: number;
  private _trabMittel: number;
  private _trabMittelStrecke: number;
  private _trabStark: number;
  private _trabStarkStrecke: number;

  private _piaffe: number;
  private _halt: number;
  private _passage: number;
  private _passageStrecke: number;
  private _piaffePirouette: number;
  private _galoppPirouette: number;

  constructor(store: Store<any>) {
    this.store = store;
  }
  public ngOnInit() {
    this.segments = <Observable<Segment[]>> this.store.select('segments');
    this.segmentsSubscription = this.segments.subscribe( segs => {
      this._segments = segs;
      this._dauer = 0;
      this._laenge = 0;
      this._schrittVersammelt = 0;
      this._schrittVersammeltStrecke = 0;
      this._schritt = 0;
      this._schrittStrecke = 0;
      this._schrittMittel = 0;
      this._schrittMittelStrecke = 0;
      this._schrittStark = 0;
      this._schrittStarkStrecke = 0;

      this._trabVersammelt = 0;
      this._trabVersammeltStrecke = 0;
      this._trab = 0;
      this._trabStrecke = 0;
      this._trabMittel = 0;
      this._trabMittelStrecke = 0;
      this._trabStark = 0;
      this._trabStarkStrecke = 0;

      this._galoppVersammelt = 0;
      this._galoppVersammeltStrecke = 0;
      this._galopp = 0;
      this._galoppStrecke = 0;
      this._galoppMittel = 0;
      this._galoppMittelStrecke = 0;
      this._galoppStark = 0;
      this._galoppStarkStrecke = 0;

      this._piaffe = 0;
      this._halt = 0;
      this._passage = 0;
      this._passageStrecke = 0;
      this._piaffePirouette = 0;
      this._galoppPirouette = 0;
      segs.forEach( seg => {
        this._dauer += seg.dauer();
        this._laenge += seg.spurLaenge();
        if (seg.class() === PIAFFE) {
          this._piaffe += seg.dauer();
        }
        if (seg.class() === HALT) {
          this._halt += seg.dauer();
        }
        if (seg.gang()) {
          switch (seg.gang().name) {
            case 'Versammelter_Schritt' :
              this._schrittVersammelt += seg.dauer();
              this._schrittVersammeltStrecke += seg.spurLaenge();
              break;
            case 'Schritt' :
              this._schritt += seg.dauer();
              this._schrittStrecke = seg.spurLaenge();
            break;
            case 'Mittel_Schritt' :
              this._schrittMittel += seg.dauer();
              this._schrittMittelStrecke += seg.spurLaenge();
              break;
            case 'Starker_Schritt':
              this._schrittStark += seg.dauer();
              this._schrittStarkStrecke += seg.spurLaenge();
              break;
            case 'Versammelter_Trab' :
              this._trabVersammelt += seg.dauer();
              this._trabVersammeltStrecke += seg.spurLaenge();
              break;
            case 'Trab' :
              this._trab += seg.dauer();
              this._trabStrecke = seg.spurLaenge();
              break;
            case 'Mittel_Trab' :
              this._trabMittel += seg.dauer();
              this._trabMittelStrecke += seg.spurLaenge();
              break;
            case 'Starker_Trab' :
              this._trabStark += seg.dauer();
              this._trabStarkStrecke += seg.spurLaenge();
              break;

            case 'Versammelter_Galopp' :
              this._galoppVersammelt += seg.dauer();
              this._galoppVersammeltStrecke += seg.spurLaenge();
              break;
            case 'Galopp' :
              this._galopp += seg.dauer();
              this._galoppStrecke = seg.spurLaenge();
              break;
            case 'Mittel_Galopp' :
              this._galoppMittel += seg.dauer();
              this._galoppMittelStrecke += seg.spurLaenge();
              break;
            case 'Starker_Galopp' :
              this._galoppStark += seg.dauer();
              this._galoppStarkStrecke += seg.spurLaenge();
            break;

            case 'Piaffe' :
              this._piaffe += seg.dauer();
              break;
            case 'Passage' :
              this._passage += seg.dauer();
              this._passageStrecke += seg.spurLaenge();
              break;
            case 'PirouetteGalopp' :
              this._galoppPirouette += seg.dauer();
              break;
            case 'PirouettePiaffe' :
              this._piaffePirouette += seg.dauer();
              break;

            case 'WENDUNG_HINTERHAND' :
              break;
            case 'Halt' :
              this._halt += seg.dauer();
              break;
            case 'Rueckwaertz' :
              break;

          }
        }
      });
    });
  }
}
