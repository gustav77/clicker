import { NgModule }         from '@angular/core';
import { IonicModule }      from 'ionic-angular';
import { ComponentsModule } from '../components';
import { ClickerList }      from './clickerList/clickerList';
import { Page2 }            from './page2/page2';
import { ArenaPage }        from './arenaPage/arenaPage';
@NgModule({
  declarations: [
    ArenaPage,
    ClickerList,
    Page2,
  ],
  imports: [ IonicModule, ComponentsModule ],
  exports: [
    ArenaPage,
    ClickerList,
    // Page2,
  ],
  entryComponents: [],
  providers: [ ],
})

export class PagesModule {}
