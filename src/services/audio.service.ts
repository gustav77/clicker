import {Injectable, ChangeDetectorRef} from '@angular/core';
import {Audiofile} from '../sharedmodels/audio/audiofile';

import {Store} from '@ngrx/store';
import {MediaPlugin} from 'ionic-native';
import {Media, MediaObject} from '@ionic-native/media';
import {Subscription} from 'rxjs/Rx';
@Injectable()
export class AudioService {
  private audioFiles: Audiofile[] = [];
  private selectedAudiofile: Audiofile;
  private mediaObj: MediaObject;
  private selectedAudiofileSubscription: Subscription;
  private afPositionSubscription: Subscription;
  private mediaUriSubscription: Subscription;
  private volume: number = 0.7;
  private position: number;
  private mediaTimer: any;
  private mediaStatus: number;
  private interval: any;
  private offset: number = 0;
  constructor(private media: Media, private store: Store<any> ) {
    store.select('audiofiles').subscribe( (afs: Audiofile[]) => {
      this.audioFiles = afs;
    });
    this.selectedAudiofileSubscription = store.select('selectedAudiofile').subscribe( (af: Audiofile) => {
      this.selectedAudiofile = af;
      if (this.mediaObj) {
        this.mediaObj.stop();
        this.mediaObj.release();
      }
      if (af && af.exportedUrl) {
        let src: string = decodeURI( af.exportedUrl.replace('file:///', '/') );
        this.mediaObj = this.media.create(src); // new Media(src, this.mediaSuccess, this.mediaError, this.onMediaStatus);
      }
      else if (af && af.dauer) {
        //
        this.mediaObj = undefined;
      }
    });
    this.mediaUriSubscription = store.select('mediaUri').subscribe( (uri: string) => {
      if (this.mediaObj) {
        this.mediaObj.stop();
        this.mediaObj.release();
      }
      if (uri) {
        let src: string = decodeURI( uri.replace('file:///', '/') );
        this.mediaObj = this.media.create(src); // new Media(src, this.mediaSuccess, this.mediaError, this.onMediaStatus);
      }
    });
    this.afPositionSubscription = store.select('afPosition').subscribe( (pos: number) => {
      this.position = pos;
      if (this.selectedAudiofile && this.position >= this.selectedAudiofile.endzeit) {
        this.mediaObj.stop();
        store.dispatch({type: 'SET_AFPOSITION', payload: this.selectedAudiofile.startzeit});
        clearInterval(this.mediaTimer);
      }
    });
    store.select('mediaStatus').subscribe( (status: number) => this.mediaStatus = status);
  }
  public get_von(af: Audiofile): number {
    let start: number = 0;
    for (let i: number = 0; i < this.audioFiles.length; i++) {
      if (af === this.audioFiles[i])
        break;
      start += this.audioFiles[i].spieldauer();
    }
    return start;
  }
  public get_bis(af: Audiofile): number {
    return this.get_von(af) + af.spieldauer();
  }
  public stop(): void {
    if (this.mediaObj)
      this.mediaObj.stop();
  }
  public pause(): void {
    if (this.mediaObj)
      this.mediaObj.pause();
    if (this.interval)
      clearInterval(this.interval);
  }
  public reset(): void {
    let beginn: number = 0;
    if (this.selectedAudiofile)
      beginn = this.selectedAudiofile.startzeit;
    if (this.mediaObj)
      this.mediaObj.seekTo(beginn * 1000);
    this.store.dispatch({type: 'SET_AFPOSITION', payload: beginn});
  }
  public lauter(): void {
    if (this.volume < 1)
      this.volume += 0.1;
    if (this.mediaObj)
      this.mediaObj.setVolume(this.volume);
  }
  public leiser(): void {
    if (this.volume > 0)
      this.volume -= 0.1;
    if (this.mediaObj)
      this.mediaObj.setVolume(this.volume);
  }
  public seekTo(n: number): void {
    if (this.mediaObj)
      this.mediaObj.seekTo(n);
  }
  private getAudiofileAt(time: number): any {
    let s: number = 0;
    for (let i: number = 0; i < this.audioFiles.length; i++) {
      if ( time < this.audioFiles[i].spieldauer() + s ) {
        return {af: this.audioFiles[i], offset: time - s};
      }
      s += this.audioFiles[i].spieldauer();
    }
  }
  public clearAll(): void {
    clearInterval(this.interval);
    if (this.mediaObj) {
      this.mediaObj.stop();
      this.mediaObj.release();
    }
    this.store.dispatch({type: 'SET_AUDIOPOSITION', payload: 0});
  }
  public pauseAll(): void {
    clearInterval(this.interval);
    if (this.mediaObj) {
      this.mediaObj.stop();
    }
  }
  public play(start: number): void {
    this.playAb(start);
  }
  public playAb(start: number, cdr?: ChangeDetectorRef): void {
    if (!this.audioFiles || this.audioFiles.length === 0)
      return;
    // der audiofile muss zurückgesetzt werden
    this.store.dispatch({type: 'AUDIOFILES_SELECT_ITEM', payload: undefined});
    let beginn: number = performance.now();
    this.interval = setInterval( () => {
      // if (!this.pausenFlag) {
        let vergangen: number = (performance.now() - beginn) / 1000;
        let tmp: any = this.getAudiofileAt(start + vergangen);

        if (tmp)
          this.offset = tmp.offset;

        this.store.dispatch({type: 'SET_AUDIOPOSITION', payload: start + vergangen});
        if (cdr)
          cdr.detectChanges();

        if (!tmp || !tmp.af) {
          this.store.dispatch({type: 'SET_AUDIOPOSITION', payload: 0});
          clearInterval(this.interval);
        }
        else if (tmp.af.exportedUrl) {
          if (this.mediaStatus === 3 /* Media.MEDIA_PAUSED */) {
            this.mediaObj.play();
          }
          else if (!this.mediaObj || this.mediaStatus !== 2 /*Media.MEDIA_RUNNING*/) {
            this.store.dispatch({type: 'AUDIOFILES_SELECT_ITEM', payload: tmp.af});
            this.mediaObj.play();
          }
        }
      // }
    },                           500);
  }
  public togglePlayAudio(): void {
    if (this.mediaStatus !== 2 /*Media.MEDIA_RUNNING*/) {
      this.playAudio();
    }
    else {
      this.pause();
    }
  }
  public playAudio(): void {
    if (!this.mediaObj)
      return;

    this.mediaObj.play();
    // Update media position every second
    this.mediaTimer = setInterval(() => {
      if (this.mediaStatus === 2 /*Media.MEDIA_RUNNING*/) {
        this.mediaObj.getCurrentPosition().then( (position) => {
          if (position > -1) {
              this.store.dispatch({type: 'SET_AFPOSITION', payload: position});

          }
          else {
            this.store.dispatch({type: 'SET_AFPOSITION', payload: 0});
            clearInterval(this.mediaTimer);
          }
        });
      }
    },
                                  1000);
  }

  private mediaSuccess = () => {
    // console.log('Media Success');
  }
  private mediaError = (e: any) => {
    // console.log('Media Error', JSON.stringify(e));
  }
  private prevMediaStatus: number = 0;
  private onMediaStatus = (e: any) => {
    // this.mediaStatus !== Media.MEDIA_PAUSED &&
    if (this.prevMediaStatus !== 3 /*Media.MEDIA_PAUSED*/ && e === 2 /*Media.MEDIA_RUNNING*/) {
      let stz: number = 0;
      if (this.selectedAudiofile.startzeit) {
        stz += this.selectedAudiofile.startzeit;
      }
      stz += this.offset;
      this.mediaObj.seekTo( stz * 1000 );
    }
    this.prevMediaStatus = e;
    this.store.dispatch({type: 'SET_MEDIA_STATUS', payload: e});
  }
}
