import { Component, OnInit, Inject, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { ConnectionService } from '../connection.service';
import { PlayerService } from '../playerService';
import * as $ from 'jquery';
import { DialogService } from '../dialog/dialog.service';
import { DialogMode } from '../dialog/dialogMode';
import { DialogComponent } from '../dialog/dialog.component';
import { CookieService } from 'ngx-cookie-service';
import { ConnectionPath } from '../shared/connectionPath';
import { TranslateService } from '@ngx-translate/core';
import { TestClass } from './test.class';
import * as uuid from 'uuid'
(window as any).global = window;

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent implements OnInit {

  private readonly CONNECTION_DIALOG_DELAY = 500;
  private readonly CONNECTION_TIMEOUT = 5000;

  nickname_editing:boolean;
  infoDialog: DialogService;

  constructor(private router: Router, private injector:Injector, private cookieService: CookieService, private translate: TranslateService ) {

  }

  ngOnInit(): void {
    this.infoDialog = this.injector.get(DialogService);

    this.setPlayerNickname();
    if(!ConnectionService.isConnected()){
      this.connect();
    }
    // this.testSubscribeIdEvent();
  }

  public test(){
    console.log("Testowanko");
    let model = new TestClass();
    model.first = "Jeden";
    model.second = "Dwa";
    model.uuid = uuid.v4();
    ConnectionService.send(JSON.stringify(model), "/app/test/uuid")
  }



  private testSubscribeIdEvent(){
    ConnectionService.subscribe("/user/queue/lobby/id", message => {
      PlayerService.setId(parseInt(message.body));
    });
    ConnectionService.send("DAJ","/app/test/getid");
  }

  private setPlayerNickname(){
    const nickname = this.readNickname();
    if(nickname){
      PlayerService.setNickname(nickname);
    } else {
      PlayerService.setNickname("Player");
    }
  }

  start(){
    this.router.navigate(['lobby']);
  }

  connect(){
    let message = this.translate.instant("dialog.connecting");
    console.log(message);
    this.infoDialog.setMessage("dialog.connecting").setMode(DialogMode.INFO).open(DialogComponent);
    ConnectionService.connect('localhost', 8080, ()=>{
      this.testSubscribeIdEvent();
      this.subscribeCheckPossibleGame();
      setTimeout(() => this.infoDialog.close(), this.CONNECTION_DIALOG_DELAY);
    });
    this.startConnectionTimeout();
  }

  private startConnectionTimeout() {
    setTimeout(() => {
      if (!ConnectionService.isConnected()) {
        this.infoDialog.close();
        this.showConnectionError();
      }
    }, this.CONNECTION_TIMEOUT);
  }

  private showConnectionError(){
    this.infoDialog.setMessage("dialog.connecting_failed").setMode(DialogMode.WARNING)
        .setOnOkClick(()=>this.infoDialog.close())
        .open(DialogComponent);
  }

  private subscribeCheckPossibleGame(){
    ConnectionService.subscribe(ConnectionPath.POSSIBLE_GAME_RESPONSE, message=>{
      console.log(message.body);
      if(message.body =='true'){
        this.router.navigate(['lobby']);
      } else {
        this.infoDialog.setMode(DialogMode.WARNING).setMessage("dialog.no_game").setOnOkClick(()=>this.infoDialog.close()).open(DialogComponent);
      }
    });
  }

  isConnected():boolean{
    return ConnectionService.isConnected();
  }

  exit(){

  }

  setChangeNicknameState(){
    this.nickname_editing = true;
    $("#nickname_input").val(PlayerService.getNickname());
  }

  confirmNickname(){
    let nickname = $("#nickname_input").val();
    PlayerService.setNickname(nickname as string);
    this.nickname_editing = false;
    this.saveNickname(nickname as string);
  }

  private saveNickname(nickname:string):void{
    this.cookieService.set('tajniaki-nickname', nickname);
  }

  private readNickname():string{
    return this.cookieService.get("tajniaki-nickname");
  }

  getNickname(){
    return PlayerService.getNickname();
  }

  startGame(){
    this.router.navigate(["game"]);
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

  sendCheckPossibleGame(){
    ConnectionService.send("?", ConnectionPath.FREE_GAME);
  }
}
