import {Component, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs/Rx';
import {Arena} from './arena';

@Component({
  selector: 'arena-ctrl',
  template: `<div class="row">
                <div class="col-sm-10 col-sm-offset-2">
                  <button (click)="chng60()" *ngIf="arena.height() === 40" class="btn btn-default" >20 * 60</button>
                  <button (click)="chng40()" *ngIf="arena.height() === 60" class="btn btn-default">20 * 40</button>
                  <button (click)="setGitter(true)" *ngIf="!_gitterOn" class="btn btn-default" >{{'Hilfslinien' | translate}} {{'general_yes' | translate}}</button>
                  <button (click)="setGitter(false)" *ngIf="_gitterOn" class="btn btn-default">{{'Hilfslinien' | translate}} {{'general_no' | translate}}</button>
                </div>
              </div>`,
})

export class ArenaControllerComponent implements OnInit {
  private selectedArena: Observable<Arena>;
  private arena: Arena;
  private gitterOn: Observable<boolean>;
  private _gitterOn: boolean;
  constructor(private store: Store<any>) {}

  public ngOnInit(): void {
    this.gitterOn = <Observable<boolean>> this.store.select('gitterOn');
    this.gitterOn.subscribe( val => this._gitterOn = val);
    this.selectedArena = <Observable<Arena>> this.store.select('selectedArena');
    this.selectedArena.subscribe( a => this.arena = a );
  }
  public chng60(): void {
    this.store.dispatch({type: 'SET_ARENA', payload: new Arena(20, 60)});
  }
  public chng40(): void {
    this.store.dispatch({type: 'SET_ARENA', payload: new Arena(20, 40)});
  }
  public setGitter(on: boolean): void {
    this.store.dispatch({type: 'SET_GITTER_ON', payload: on});
  }
}
