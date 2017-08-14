import {uuid} from '../utils/utils';
import {Segment} from '../segments/segment';
export class Pattern {
  private _arenaWidth: number;
  private _arenaLength: number;
  private _uuid: string;
  constructor(width: number, length: number, segments: Segment[] = []) {
    this._arenaWidth = width;
    this._arenaLength = length;
    this._uuid = uuid();
  }
  public uuid(): string {
    return this._uuid;
  }
}
