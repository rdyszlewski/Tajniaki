import { Component, OnInit, Inject, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { ConnectionService } from '../connection.service';
import { PlayerService } from '../playerService';
import * as $ from 'jquery';
import { DialogService } from '../dialog/dialog.service';
import { DialogMode } from '../dialog/dialogMode';
import { DialogComponent } from '../dialog/dialog.component';
import { CookieService } from 'ngx-cookie-service';

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

  constructor(private router: Router, private injector:Injector, private cookieService: CookieService) {
    
  }

  ngOnInit(): void {
    this.infoDialog = this.injector.get(DialogService);
    this.setPlayerNickname();
    if(!ConnectionService.isConnected()){
      this.connect();
    }
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
    console.log("start");
    this.router.navigate(['lobby']);
  }

  connect(){
    this.infoDialog.setMessage("Łączenie...").setMode(DialogMode.INFO).open(DialogComponent);
    ConnectionService.connect('localhost', 8080, ()=>{
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
    this.infoDialog.setMessage("Połączenie nieudane").setMode(DialogMode.WARNING)
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
    console.log(PlayerService.getNickname());
    return PlayerService.getNickname();
  }

  startGame(){
    this.router.navigate(["game"]);
  }

  startVoting(){
    this.router.navigate(['boss']);
  }

  startSummary(){
    console.log("Przechodzenie do posumowania");
    this.router.navigate(['summary']);
  }

  startLobby(){
    this.router.navigate(["lobby"]);
  }
}
