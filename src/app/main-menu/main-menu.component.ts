import { Component, OnInit, Inject, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { ConnectionService } from '../connection.service';
import { PlayerService } from '../playerService';
import * as $ from 'jquery';
import { DialogService } from '../dialog/dialog.service';
import { DialogMode } from '../dialog/dialogMode';
import { DialogComponent } from '../dialog/dialog.component';
import { CookieService } from 'ngx-cookie-service';
import { TranslateService } from '@ngx-translate/core';
import { TestClass } from './test.class';
import * as uuid from 'uuid'
import { GameService } from '../gameService';
import { IdParam } from '../shared/parameters/id.param';
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

  constructor(private router: Router, private injector:Injector,
    private cookieService: CookieService, private translate: TranslateService,
    private gameService: GameService, private playerService: PlayerService ) {

  }

  ngOnInit(): void {
    this.infoDialog = this.injector.get(DialogService);

    this.setPlayerNickname();
    if(!ConnectionService.isConnected()){
      this.connect();
    }
  }

  public test(){
    console.log("Testowanko");
    let model = new TestClass();
    model.first = "Jeden";
    model.second = "Dwa";
    model.uuid = uuid.v4();
    ConnectionService.send(JSON.stringify(model), "/app/test/uuid")
  }

  private setPlayerNickname(){
    const nickname = this.readNickname();
    if(nickname){
      this.playerService.setNickname(nickname);
    } else {
      this.playerService.setNickname("Player");
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
      // ConnectionService.connect("172.17.0.2", 8080, ()=>{
      this.testSubscribeIdEvent();
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


  isConnected():boolean{
    return ConnectionService.isConnected();
  }

  exit(){

  }

  setChangeNicknameState(){
    this.nickname_editing = true;
    $("#nickname_input").val(this.playerService.getNickname());
  }

  confirmNickname(){
    let nickname = $("#nickname_input").val();
    this.playerService.setNickname(nickname as string);
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
    return this.playerService.getNickname();
  }

  readyStartGame(){
    ConnectionService.send("siema", "/app/test/start_ready");
  }

  startGame(){
    let param = new IdParam(this.gameService.getId());
    let json = JSON.stringify(param);
    ConnectionService.send(json, '/app/test/start')
  }

  private testSubscribeIdEvent(){
    ConnectionService.subscribe('/user/queue/test/start', message=>{
      console.log("Otrzymałem id gry");
      var data = JSON.parse(message.body);
      this.gameService.setId(data['gameId']);
      this.playerService.setId(data['playerId']);
    });

    ConnectionService.subscribe("/user/queue/test/startGame", message=>{
      console.log("Odbieram to")
      this.router.navigate(["game"]);
    });
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
