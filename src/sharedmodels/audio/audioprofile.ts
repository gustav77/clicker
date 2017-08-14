import { Audiofile } from '../audio/audiofile';
/**
 * Ein AudioProfile beschreibt den musikalischen Ablauf eines Patterns
 */
export class AudioProfile {
  // private _dauer: number;
  private _audiofiles: Audiofile[];
  constructor(audiofiles: Audiofile[]) {
    this._audiofiles = audiofiles;
  }
  public dauer(): number {
    if (!this._audiofiles || this._audiofiles.length === 0)
      return 0;
    else {
      let dauer: number = 0;
      this._audiofiles.forEach(f => {
        dauer += f.spieldauer();
      });
      return dauer;
    }
  }
  public audiofiles(): Audiofile[] {
    // return copy
    return this._audiofiles.slice(0);
  }
  /**
   * errechnet das Audiofile und den offset darin
   */
  public getAt(start: number): {audiofile: Audiofile, offset: number} {
    let abgespielt: number = 0;
    for (let i: number = 0; i < this._audiofiles.length; i++) {
      if (abgespielt + this._audiofiles[i].file.duration > start) {
        let audiofile: Audiofile = this._audiofiles[i];
        let offset: number = start - abgespielt;
        return {audiofile, offset};
      }
      else {
        abgespielt += this._audiofiles[i].duration;
      }
    }
  }
}

export function audioprofile_insertOrReplace(gw: Audiofile, sp: AudioProfile): AudioProfile {
  'use strict';
  let oldgws: Audiofile[] = sp.audiofiles();
  let newgws: Audiofile[] = [];
  let pushed: boolean = false;
  oldgws.forEach(g => {
    if (gw.uuid() === g.uuid()) {
      newgws.push(gw);
      pushed = true;
    }
    else {
      newgws.push(g);
    }
  });
  if (!pushed) {
    newgws.push(gw);
  }
  return new AudioProfile(newgws);
}
export function audioprofile_push(seg: Audiofile, sp: AudioProfile): AudioProfile {
  'use strict';
  let gws: Audiofile[] = sp.audiofiles();
  gws.push(seg);
  return new AudioProfile(gws);

}

export function audioprofile_pop(sp: AudioProfile): any {
  'use strict';
  let gws: Audiofile[] = sp.audiofiles();
  let audiofile: Audiofile = gws.pop();
  let audioprofileNew: AudioProfile = new AudioProfile(gws);
  return {audiofile, audioprofileNew};
}

export function audioprofile_delete(gw: Audiofile, sp: AudioProfile): AudioProfile {
  'use strict';
  if (gw) {
    let gws: Audiofile[] = sp.audiofiles();
    let index: number = gws.indexOf(gw);
    if (index > -1) {
      gws.splice(index, 1);
      return new AudioProfile(gws);
    }
    else
      return sp;
  }
  return undefined;
}
export function audioprofile_insertAt(newSeg: Audiofile, pos: number, sp: AudioProfile): AudioProfile {
  'use strict';
  let gws: Audiofile[] = sp.audiofiles();
  if (pos <= 0) {
    gws.unshift(newSeg);
    return new AudioProfile(gws);
  }
  else if (pos >= gws.length) {
    gws.push(newSeg);
    return new AudioProfile(gws);
  }
  else {
    gws.splice(pos, 0, newSeg);
    return new AudioProfile(gws);
  }

}
