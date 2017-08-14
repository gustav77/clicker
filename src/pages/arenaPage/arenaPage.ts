import { Component }       from '@angular/core';
import { NavController }   from 'ionic-angular';
// import { ClickersService } from '../../services';

@Component({
  templateUrl: './arena.html',
})

export class ArenaPage {

  // public clickerService: ClickersService;
  public title: string;
  private nav: NavController;

  constructor(nav: NavController) {
    this.nav = nav;
    // this.clickerService = clickerService;
    this.title = 'Arena';
  }
}
