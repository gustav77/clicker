import {uuid} from '../utils/utils';
export class PatternName {
  public name: string;
  public uuid: string;
  public arenaLength: number;
  constructor(_name: string, _arenaLength: number, _uuid?: string) {
    if (_uuid) {
      this.uuid = _uuid;
    }
    else {
      this.uuid = uuid();
    }
    this.name = _name;
    this.arenaLength = _arenaLength;
  }
}
