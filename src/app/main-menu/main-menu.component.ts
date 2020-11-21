import { Component, OnInit, Inject, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { ConnectionService } from '../connection.service';
import { PlayerService } from '../playerService';
import { DialogService } from '../dialog/dialog.service';
import { DialogMode } from '../dialog/dialogMode';
import { DialogComponent } from '../dialog/dialog.component';
import { CookieService } from 'ngx-cookie-service';
import { TranslateService } from '@ngx-translate/core';
import { GameService } from '../gameService';
import { TestMainMenuEventManager } from './messages/main-menu.event-manager';
(window as any).global = window;

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent implements OnInit {

  private readonly CONNECTION_DIALOG_DELAY = 500;
  private readonly CONNECTION_TIMEOUT = 5000;

  public nickname_editing:boolean;
  public nickname: string;
  private _testEventManager: TestMainMenuEventManager;

  public get eventManager(){
    return this._testEventManager;
  }

  constructor(private router: Router, private dialog: DialogService, private connectionService: ConnectionService,
    private cookieService: CookieService, private translate: TranslateService,
    private gameService: GameService, private playerService: PlayerService ) {
      this._testEventManager = new TestMainMenuEventManager(connectionService, gameService, playerService, router);
  }

  ngOnInit(): void {

    this.setPlayerNickname();
    if(!this.isConnected()){
      this.connect();
    }
  }

  private setPlayerNickname(){
    const nickname = this.readNickname();
    if(nickname){
      this.playerService.setNickname(nickname);
    } else {
      this.playerService.setNickname("Player");
    }
  }

  connect(){
    this.dialog.setMessage("dialog.connecting").setMode(DialogMode.INFO).open(DialogComponent);
    this.connectionService.connect('localhost', 8080, ()=>{
      // ConnectionService.connect("172.17.0.2", 8080, ()=>{
      this._testEventManager.init();
      setTimeout(() => this.dialog.close(), this.CONNECTION_DIALOG_DELAY);
    });
    this.startConnectionTimeout();
  }

  private startConnectionTimeout() {
    setTimeout(() => {
      if (!this.isConnected()) {
        this.dialog.close();
        this.showConnectionError();
      }
    }, this.CONNECTION_TIMEOUT);
  }

  private showConnectionError(){
    this.dialog.setMessage("dialog.connecting_failed").setMode(DialogMode.WARNING)
        .setOnOkClick(()=>this.dialog.close())
        .open(DialogComponent);
  }


  isConnected():boolean{
    return this.connectionService.isConnected();
  }

  exit(){

  }

  setChangeNicknameState(){
    this.nickname_editing = true;
    this.nickname = this.playerService.getNickname();
  }

  confirmNickname(){
    this.playerService.setNickname(this.nickname);
    this.nickname_editing = false;
    this.saveNickname(this.nickname);
  }

  private saveNickname(nickname:string):void{
    this.cookieService.set('tajniaki-nickname', nickname);
  }

  private readNickname():string{
    return this.cookieService.get("tajniaki-nickname");
  }

  getNickname(){
    return this.playerService.getNickname();
  }

  start(){
    this.router.navigate(['lobby']);
  }

  startVoting(){
    this.router.navigate(['voting']);
  }

  startSummary(){
    this.router.navigate(['summary']);
  }

  startLobby(){
    this.router.navigate(["lobby"]);
  }

  nicknameKeydown(event){
    if (event.keyCode === 13) { //ENTER
      this.confirmNickname();
    }
  }

}
