'use strict';

import {Component, Input, Output, ElementRef, OnInit, OnDestroy, OnChanges, EventEmitter} from '@angular/core';
import {Arena, drawSpur, drawGitter, drawRahmen, drawBahnpunkte, drawAnimation, translateX, translateY,
        convertX, convertY, getNearByBahnpunkt } from './arena';
import {Bahnpunkt, Position} from '../segments/vector';
import {Store} from '@ngrx/store';
import {Observable, Subscription} from 'rxjs/Rx';

// import {Vector,vector_add,vector_rotate,vector_scalar_multiply} from '../segments/shared/vector';
// import {Standpunkt} from '../segments/standpunkt';
import {Spur} from '../segments/spur';
import {Segment} from '../segments/segment';
@Component({
  selector: 'arena-component',
  template: `<div id="canvas-container" style="position: relative;">
            <canvas  id="layer_0" style="z-index: 0; position: absolute; left: 1px; top: 10px;"></canvas>
            <canvas  id="layer_1" style="z-index: 1; position: absolute; left: 1px; top: 10px;"></canvas>
            <canvas  id="layer_2" style="z-index: 2; position: absolute; left: 1px; top: 10px;"></canvas>
            <canvas (click)="onClick($event)" id="layer_3" style="z-index: 3; position: absolute; left: 1px; top: 10px;"></canvas>
    </div>`,
})

export class ArenaComponent implements OnInit, OnDestroy, OnChanges {
  private arena: Arena;
  private _spuren: Spur[];
  private _segments: Segment[];
  private _selectedSegment: Segment;
  private _previewSegment: Segment;

  private _lastChanged: string;
  @Input() private scale: number = 10;
  @Input() private randBreite: number = 40;
  @Input() private fontSize: number = 18;
  @Input() private maxWidthProz: number = 100; // prozentual zur window size
  @Input() private maxHeightProz: number = 100;
  @Input() private maxHeight: number = 0;
  @Input() private maxWidth: number = 0;
  // Context.
  @Output() private touchPoint: EventEmitter<string> = new EventEmitter<string>();

  private ctX0: CanvasRenderingContext2D;
  private ctX1: CanvasRenderingContext2D;
  private ctX2: CanvasRenderingContext2D;
  private ctX3: CanvasRenderingContext2D;
  private c0: any;
  private c1: any;
  private c2: any;
  private c3: any;
  private scrollerHandle: any;
  // private canvasWidth: number;
  // private canvasHeight: number;

  // subscriptions
  private segmentsSubscription: Subscription;
  private selectedSegmentSubscription: Subscription;
  private previewSegmentSubscription: Subscription;
  private spurenSubscription: Subscription;
  private selectedStandpunkteSubscription: Subscription;
  private gitterOnArenaCombiSub: Subscription;
  private el: ElementRef;
  private store: Store<any>;
  private pinchScale: number = 1;
  constructor(_el: ElementRef, store: Store<any>) {
    this.el = _el;
    this.store = store;
  }
  public ngOnChanges(): void {
    // Sicherstellen, dass die Parameter wirklich numerisch sind
    this.randBreite = Number(this.randBreite) || 40;
    this.scale = Number(this.scale) || 10;
    this.fontSize = Number(this.fontSize) || 18;
    this.maxWidthProz = Number(this.maxWidthProz) || 100; // prozentual zur window size
    this.maxHeightProz = Number(this.maxHeightProz) || 100;
    this.maxHeight = Number(this.maxHeight) || 0;
    this.maxWidth = Number(this.maxWidth) || 0;

  }
  public onClick(evt: any): void {
    let rect: any = this.c3.getBoundingClientRect();
    let x: number = evt.clientX - rect.left;
    let y: number = evt.clientY - rect.top;
    let X: number = convertX(x, this.scale, this.randBreite);
    let Y: number = convertY(y, this.scale, this.randBreite, this.arena);
    let bp: Bahnpunkt = getNearByBahnpunkt(X, Y, 2, this.arena);
    if (bp) {
      this.touchPoint.emit(bp.name);
    }
  }
  public ngOnDestroy(): void {
    this.segmentsSubscription.unsubscribe();
    this.selectedSegmentSubscription.unsubscribe();
    this.previewSegmentSubscription.unsubscribe();
    this.spurenSubscription.unsubscribe();
    this.selectedStandpunkteSubscription.unsubscribe();
    this.gitterOnArenaCombiSub.unsubscribe();
  }
  public ngOnInit(): void {
    if (this.el) {
      this.scrollerHandle = this.el.nativeElement.children[0];

      this.c0 = this.el.nativeElement.querySelector('#layer_0');
      this.c1 = this.el.nativeElement.querySelector('#layer_1');
      this.c2 = this.el.nativeElement.querySelector('#layer_2');
      this.c3 = this.el.nativeElement.querySelector('#layer_3');

      this.ctX0 = this.c0.getContext('2d');
      this.ctX1 = this.c1.getContext('2d');
      this.ctX2 = this.c2.getContext('2d');
      this.ctX3 = this.c3.getContext('2d');

    }
    let windowResize: Observable<{}> = Observable.fromEvent(window, 'resize').startWith('');
    this.gitterOnArenaCombiSub = Observable.combineLatest(windowResize, this.store.select('gitterOn'),
                                                          this.store.select('selectedArena'), this.store.select('pinchScale'),
                                                          (event: any, gitterOn: boolean, arena: Arena, pinchScale: number) => {
                                                            return {gitterOn: gitterOn, arena: arena, pinchScale: pinchScale };
                                                          })
    .subscribe( (value) => {
      this.arena = value.arena;
      this.pinchScale = value.pinchScale;
      this.setDim();
      this.drawPattern();
      this.drawBahnpunkteAndGitter(value.gitterOn);

    });
    this.segmentsSubscription = this.store.select('segments').subscribe( (segs: Segment[]) => {
      this._lastChanged = 'selectedSegment';
      this._segments = segs;
      this.drawPattern();
    });
    this.selectedSegmentSubscription = this.store.select('selectedSegment').debounce(() => { return Observable.timer(200); }).subscribe( (seg: Segment) => {
      this._lastChanged = 'selectedSegment';
      this._selectedSegment = seg;
      this.drawPattern();
    });
    this.previewSegmentSubscription = this.store.select('previewSegment').subscribe( (segs: Segment) => {
      this._previewSegment = segs;
      this.drawPattern();
    });

    this.spurenSubscription = this.store.select('spuren').subscribe( (sp: Spur[]) => {
      if (sp && sp.length > 0) {
        this._lastChanged = 'spuren';
        this._spuren = sp;
        this.clearCanvas_2();
        this._spuren.forEach(spur => {
            drawSpur(this.ctX2, spur, this.scale, this.randBreite, this.arena); },
          );
      }
    });

    this.selectedStandpunkteSubscription = this.store.select('selectedStandpunkte').subscribe( (standpunkte: Position[]) => {
      // this.clearCanvas_3();
      standpunkte.forEach(pos => {
          let x: number = translateX(pos.x, this.scale, this.randBreite);
          let y: number = translateY(pos.y, this.scale, this.randBreite, this.arena);
          let direction: number = pos.direction;
          if (pos.gang && pos.gang.name === 'Rueckwaertz')
            direction += Math.PI;
          let stellung: string = pos.stellung || 'GERADE';
          let rotation: number = pos.rotation || 0;

          drawAnimation(this.ctX3, x, y, direction, stellung, rotation);
        });
    });
  }

  private setDim(): void {
    let h: number = 60;
    let w: number = 20;
    if (this.arena) {
      h = this.arena.height();
      w = this.arena.width();
    }
    let maxHeight: number;
    let maxWidth: number;
    if (this.maxHeight === 0)
      maxHeight = window.innerHeight * this.maxHeightProz / 100;
    else
      maxHeight = this.maxHeight;

    if (this.maxWidth === 0)
      maxWidth = window.innerWidth * this.maxHeightProz / 100 * this.maxWidthProz / 100;
    else
      maxWidth = this.maxWidth;

    maxHeight *= this.pinchScale;
    maxWidth *= this.pinchScale;

    if (this.c0 && this.c1 && this.c2 && this.c3) {
      this.c0.width = Math.ceil(maxWidth);
      this.c0.height = Math.ceil(maxHeight);
      this.c1.width = Math.ceil(maxWidth);
      this.c1.height = Math.ceil(maxHeight);
      this.c2.width = Math.ceil(maxWidth);
      this.c2.height = Math.ceil(maxHeight);
      this.c3.width = Math.ceil(maxWidth);
      this.c3.height = Math.ceil(maxHeight);
    }
    this.scale = Math.min((maxHeight - 2 * this.randBreite) / h, (maxWidth - 2 * this.randBreite) / w);
    // console.log('Scale', this.scale);
  }
  private drawPattern(): void {
    this.clearCanvas_2();
    if (this._segments) {
        this._segments.forEach( seg => {
          if (seg)
            drawSpur(this.ctX2, seg.spur(), this.scale, this.randBreite, this.arena);
        });
      }
    if (this._selectedSegment && !this._previewSegment) {
        drawSpur(this.ctX2, this._selectedSegment.spur('#ff0000'), this.scale, this.randBreite, this.arena);
      }
    if (this._previewSegment) {
        let color: string = '#ff0000';
        drawSpur(this.ctX2, this._previewSegment.spur(color), this.scale, this.randBreite, this.arena);
      }
    // }
  }
  private drawBahnpunkteAndGitter(gitterOn: boolean): void {
    this.clearCanvas_0();
    this.clearCanvas_1();
    drawRahmen(this.ctX0, this.scale, this.randBreite, this.arena, this.fontSize);

    if (gitterOn)
      drawGitter(this.ctX0, this.scale, this.randBreite, this.arena, this.fontSize);

    drawBahnpunkte(this.ctX1, this.scale, this.randBreite, this.arena, this.fontSize);
  }

  private clearCanvas_0(): void {
    if (this.ctX0)
      this.ctX0.clearRect(0, 0, 2000, 2000);
  }
  private clearCanvas_1(): void {
    if (this.ctX1)
      this.ctX1.clearRect(0, 0, 2000, 2000);
  }
  private clearCanvas_2(): void {
    if (this.ctX2)
      this.ctX2.clearRect(0, 0, 2000, 2000);
  }
}
