import {uuid} from '../utils/utils';

export class Audiofile {
  public file: any;
  // von iTunes
  public artist: string;
  public albumTitle: string;
  public title: string;
  public exportedUrl: string;
  public ipodurl: string;
  // iTunes und filesystem
  public duration: number;

  // filesystem
  public filename: string;
  public filesize: number;
  public filetype: string;
  public objectUrl: string;

  // steuerungsdaten
  public startzeit: number;
  public endzeit: number;
  public dauer: number;
  public von: number;
  private _uuid: string;
  constructor(file?: any, uUid?: string) {
    this.file = file;
    this._uuid = uUid;
    if (!this._uuid || this._uuid.length < 10) {
      // eine gültige uuid ist länger als 40 zeichen
      this._uuid = uuid();
    }
    if (this.file) {
      this.filename = this.file.name;
      this.filesize = this.file.size;
      this.filetype = this.file.type;
    }
    else {
      this.filename = 'unknown';
    }
  }
  public copy(): Audiofile {
    return new Audiofile(this.file);
  }

  public toJSON(): any {
    return {artist: this.artist, albumTitle: this.albumTitle, title: this.title, exportedUrl: this.exportedUrl,
            duration: this.duration, filename: this.filename, ipodurl: this.ipodurl, dauer: this.dauer, von: this.von,
            startzeit: this.startzeit, endzeit: this.endzeit, objectUrl: this.objectUrl, _uuid: this._uuid, };
  }
  public spieldauer(): number {
    if (this.dauer) {
      return this.dauer;
    }
    else if (this.startzeit) {
      if (this.endzeit) {
        return this.endzeit - this.startzeit;
      }
      else {
        return (this.duration / 1000) - this.startzeit;
      }
    }
    else
      return this.duration / 1000;
  }
  public uuid(): string {
    return this._uuid;
  };

  public play( audio: HTMLAudioElement, vonSec?: number, bisSec?: number): void {
    // HTML 5 Audio
    if (this.file) {
      audio.src = URL.createObjectURL(this.file);
      if (vonSec) {
        audio.currentTime = vonSec;
      }
      audio.oncanplay = () => {
        if (bisSec) {
          setTimeout(() => { audio.pause(); }, bisSec * 1000);
        }
        audio.play();
      };

    }
  }
  public resume( audio: HTMLAudioElement): void {
    audio.play();
  }
}

export class Silence extends Audiofile {
  constructor(dauer: number) {
    super();
    this.duration = dauer;
  }
}
export function audiofile_fromJSON(json: string): Audiofile {
  'use strict';
  return audiofile_fromObject( JSON.parse(json) );
}
export function audiofile_fromObject(obj: any): Audiofile {
  'use strict';
  let af: Audiofile = new Audiofile(undefined, obj._uuid);
  af.artist = obj.artist;
  af.albumTitle = obj.albumTitle;
  af.title = obj.title;
  af.exportedUrl = obj.exportedUrl;
  af.ipodurl = obj.ipodurl;
  af.duration = obj.duration;

  af.filesize = obj.filesize;
  af.filetype = obj.filetype;

  af.filename = obj.filename;
  af.objectUrl = obj.objectUrl;
  af.startzeit = obj.startzeit;
  af.endzeit = obj.endzeit;
  af.dauer = obj.dauer;
  af.von = obj.von;
  return af;
}
