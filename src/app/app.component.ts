import { Component, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { DialogService } from './dialog/dialog.service';
import { DialogMode } from './dialog/dialogMode';
import { DialogComponent } from './dialog/dialog.component';
import { ConnectionService } from './connection.service';
import {TranslateService} from '@ngx-translate/core'
import { IdParam } from './shared/parameters/id.param';
import { GameService } from './gameService';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private readonly title = 'Tajniaki';

  private dialog: DialogService;

  private  menuShow = false;

  constructor (private router:Router, private injector: Injector, private translate:TranslateService, private gameService: GameService, private ConnectionService: ConnectionService){
    this.dialog = injector.get(DialogService);
    translate.setDefaultLang('pl');

  }

  public openMenu(){
    this.menuShow = !this.menuShow;
  }

  public areMenuItemHidden(){
    return !this.menuShow;
  }

  public isMenuHidden(){
    // only in main menu menu is hidden
    return this.router.url.includes("mainmenu");
  }

  public goToMenu(){
    this.menuShow = false;
    this.dialog.setMessage("dialog.sure_quit").setMode(DialogMode.ALERT)
    .setOnOkClick(()=>this.onOkExitClick())
    .setOnCancelClick(()=>this.onCancelClick())
    .open(DialogComponent);
  }

  private onOkExitClick(){
    let param = new IdParam(this.gameService.getId());
    let json = JSON.stringify(param);
    this.ConnectionService.send(json, '/app/game/quit');
    this.dialog.close();
    this.menuShow = false;
    this.router.navigate(['mainmenu']);
  }

  private onCancelClick(){
    this.dialog.close();
  }
}


