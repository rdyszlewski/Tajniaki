import { Component, OnInit } from '@angular/core';
import { ConnectionService } from 'src/app/connection.service';
import { GameService } from 'src/app/gameService';
import { State } from 'src/app/main/state';
import { ConnectionPath } from 'src/app/shared/connectionPath';
import { IdParam } from 'src/app/shared/parameters/id.param';
import { DialogComponent } from '../dialog/dialog.component';
import { DialogService } from '../dialog/dialog.service';
import { DialogMode } from '../dialog/dialogMode';

export interface IMenuControl{
  isMenuVisible();
  changeState(state: State);
}

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  private menuOpen: boolean;
  private menuControl: IMenuControl;

  constructor(private dialog: DialogService, private connectionService: ConnectionService, private gameService: GameService ) { }

  ngOnInit(): void {
  }

  public setControl(control: IMenuControl){
    this.menuControl = control;
  }

  public isMenuOpen():boolean{
    return this.menuOpen;
  }

  public isMenuVisible():boolean{
    if(this.menuControl){
      return this.menuControl.isMenuVisible();
    }
    return false;
  }

  public openMenu(){
    this.menuOpen = true;
  }

  public onGoToMainMenuClick(){
    this.dialog.setMessage("dialog.sure_quit").setMode(DialogMode.ALERT)
    .setOnOkClick(()=>this.onOkGoToMenuClick())
    .setOnCancelClick(()=>{this.menuOpen = false;})
    .open(DialogComponent);
  }

  private onOkGoToMenuClick(){
    this.menuOpen = false;
    this.sendQuitMessage();
    this.dialog.close();
    if(this.menuControl){
      this.menuControl.changeState(State.MAIN_MENU);
    }
  }

  private sendQuitMessage() {
    let param = new IdParam(this.gameService.getId());
    let json = JSON.stringify(param);
    this.connectionService.send(json, ConnectionPath.QUIT);
  }
}
