import {Injectable} from '@angular/core';
import { prepareStandpunkte, streckeAt } from '../funktionen/funktionen';
import {HALT, PIAFFE, Segment } from '../segments/segment';
import {Halt} from '../segments/halt';
import {Piaffe} from '../segments/piaffe';
import {vector_distance, Position} from '../segments/vector';
import { Store } from '@ngrx/store';
import {AudioService} from '../../services/audio.service';

@Injectable()
export class AnimateService {
  private delta: number = 0;
  private lastStreckeAt: any;
  private schwankung: number = 0;
  private schwankungsTrigger: any;
  private lastStandpunktNachStrecke: any;
  private _videoRunning: boolean;
  private _segments: Segment[];
  private _standpunkte: Position[];

  constructor(private store: Store<any>, private audioService: AudioService) {
    store.select('segments').subscribe( (segs: Segment[]) => {
      this._segments = segs;
      this._standpunkte = undefined;
    });
    store.select('animationRunning').subscribe( (v: boolean) => this._videoRunning = v);
  }
  public toggleRun(): void {
    if (this._videoRunning)
      this.onStop();
    else
      this.onRun();
  }

  public onRun(): void {
    if (! this._standpunkte) {
      this._standpunkte = prepareStandpunkte(this._segments);
    }
    this.audioService.play(this.delta);

    this.store.dispatch({type: 'SET_RUNNING', payload: true});
    this.animate(this.delta);
  }
  public onStop(): void {
    this.store.dispatch({type: 'SET_RUNNING', payload: false});
    if (this.audioService)
      this.audioService.pause();
  }
  public onBackwards(): void {
    if (! this._standpunkte) {
      this._standpunkte = prepareStandpunkte(this._segments);
    }
    this.store.dispatch({type: 'SET_RUNNING', payload: true});
    this.animate(this.delta, true);
  }
  public goStart(): void {
    if (! this._standpunkte) {
      this._standpunkte = prepareStandpunkte(this._segments);
    }
    this.delta = 0;
    this.store.dispatch({type: 'SET_VIDEO_RUNTIME', payload: 0});
    this.store.dispatch({type: 'STANDPUNKTE_ADD_ITEMS', payload: [this._standpunkte[0]]});
  }
  public positionPferd(t: number): void {
    if (! this._standpunkte) {
      this._standpunkte = prepareStandpunkte(this._segments);
    }
    if (t >= 0) {
      let st: any = streckeAt(t, this._segments);
      // this.store.dispatch({type: 'SEGMENTS_SELECT_ITEM', payload: st.seg});

      let z: number = st.strecke;
      let pos: Position = this.standpunktNachStrecke(z);

      if (pos) {
        this.store.dispatch({type: 'STANDPUNKTE_ADD_ITEMS', payload: [pos]});
        this.delta = t;
      }
    }
  }
  private animate: Function = (offset: number = 0, backwards: boolean = false) => {
    let dauer: number = 0;
    this._segments.forEach( seg => {
    if (seg.class() === HALT)
        dauer += (<Halt>seg).dauer();
    else if (seg.class() === PIAFFE)
        dauer += (<Piaffe>seg).dauer();
    else if (seg.gang())
        dauer += seg.spurLaenge() / seg.gang().speed;

    });
    let startzeit: number = performance.now();

    const animateme: FrameRequestCallback = () => {
      let now: number = performance.now();
      if (backwards && offset > 0)
        this.delta = offset - (performance.now() - startzeit) / 1000 ;
      else if (backwards)
        this.delta = dauer - (performance.now() - startzeit) / 1000 ;
      else {
        this.delta = (now - startzeit) / 1000 + offset;
      }
      if (this.delta <= dauer && this.delta >= 0) {
        // debugger
        let st: any = streckeAt(this.delta, this._segments, this.lastStreckeAt);
        this.lastStreckeAt = st.last;
        let z: number = st.strecke;
        let pos: Position = this.standpunktNachStrecke(z);

        if (st.g) {
          if (st.g.name === 'Passage')
            this.triggerSchwankung();
          else
            this.stopSchwankung();
        }
        else if (st._class === HALT) {
          this.stopSchwankung();
        }
        else if (st._class === PIAFFE) {
          this.triggerSchwankung();
        }
        if (pos) {
          let newPos: Position = {x: pos.x, y: pos.y, direction: pos.direction, gang: pos.gang,
                                    rotation: (pos.rotation || 0) + this.schwankung, hand: pos.hand, stellung: pos.stellung};
          this.store.dispatch({type: 'STANDPUNKTE_ADD_ITEMS', payload: [newPos]});
        }
        this.store.dispatch({type: 'SEGMENTS_SELECT_ITEM', payload: st.seg});
        if (this._videoRunning) {
          this.store.dispatch({type: 'SET_VIDEO_RUNTIME', payload: this.delta});
          requestAnimationFrame(animateme);
        }
      }
      else {
        if (this.audioService)
          this.audioService.pause();
        this.store.dispatch({type: 'SET_RUNNING', payload: false});
        this.delta = 0;
      }
    };

    requestAnimationFrame(animateme );
  }

  private standpunktNachStrecke(entfernung: number): Position {
    let distanz: number = 0;
    let index: number = 1;
    let s: Position;
    if (this.lastStandpunktNachStrecke && this.lastStandpunktNachStrecke.entfernung < entfernung) {
      distanz = this.lastStandpunktNachStrecke.distanz;
      index = this.lastStandpunktNachStrecke.index;
    }
    else {
      this.lastStandpunktNachStrecke = undefined;
    }
    if (index === this._standpunkte.length - 1) {
      s = this._standpunkte[index];
    }
    else {
      for (let i: number = index; i < this._standpunkte.length; i++) {
        if (distanz >= entfernung) {
          s = this._standpunkte[i];
          this.lastStandpunktNachStrecke = {index: i, entfernung: entfernung, distanz: distanz};
          break;
        }
        distanz += vector_distance(this._standpunkte[i - 1], this._standpunkte[i]);
      }
    }
    return s;
  }
  private triggerSchwankung(): void {
    if (!this.schwankungsTrigger) {
      this.schwankungsTrigger = setInterval( () => {
        if (this.schwankung === 0)
          this.schwankung = 0.1;
        else if (this.schwankung === 0.1)
          this.schwankung = -0.1;
        else
          this.schwankung = 0.1;
      },                                     500);
    }
  }
  private stopSchwankung(): void {
    this.schwankung = 0;
    clearInterval(this.schwankungsTrigger);
    this.schwankungsTrigger = undefined;
  }
}
