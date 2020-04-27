import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConnectionService } from '../connection.service';
import { PlayerService } from '../playerService';
import * as $ from 'jquery';

(window as any).global = window;

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent implements OnInit {

  nickname_editing:boolean;

  constructor(private router: Router) {
    this.connect();
  }


  ngOnInit(): void {
    
    // throw new Error("Method not implemented.");
  }

  start(){
    console.log("start");
    this.router.navigate(['lobby']);
  }

  connect(){
    ConnectionService.connect('localhost', 8080, ()=>{});
  }

  isConnected():boolean{
    return ConnectionService.isConnected();
    return false;
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

}
