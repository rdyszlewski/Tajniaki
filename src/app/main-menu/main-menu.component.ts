import { Component, OnInit, Inject, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { ConnectionService } from '../connection.service';
import { PlayerService } from '../playerService';
import * as $ from 'jquery';
import { DialogService } from '../dialog/dialog.service';
import { DialogMode } from '../dialog/dialogMode';
import { DialogComponent } from '../dialog/dialog.component';

(window as any).global = window;

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent implements OnInit {

  nickname_editing:boolean;
  infoDialog: DialogService;

  constructor(private router: Router, private injector:Injector) {
    
  }

  ngOnInit(): void {
    this.infoDialog = this.injector.get(DialogService);
    this.connect();
  }

  start(){
    console.log("start");
    this.router.navigate(['lobby']);
  }

  connect(){
    this.infoDialog.setMessage("Łączenie...").setMode(DialogMode.INFO).open(DialogComponent);
    let connected = false;
    ConnectionService.connect('localhost', 8080, ()=>{
      console.log("Połączono");
      setTimeout(() => 
      {
        this.infoDialog.close();
      },
      500);
    });

    setTimeout(()=>{
      if(!connected){
        // TODO: poinformować o błędzie połączniea
        this.infoDialog.close();
      }
    }, 5000); // TODO: ustawić zmienną z timeout
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
}
