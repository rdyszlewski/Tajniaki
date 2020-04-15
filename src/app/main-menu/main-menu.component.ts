import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConnectionService } from '../connection.service';
import { PlayerService } from '../playerService';

(window as any).global = window;

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent implements OnInit {

  private connectButton;
  private sendButton;
  private textField;
  private gameButton;

  constructor(private router: Router) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(){


    this.connectButton = document.getElementById("connect_button");
    this.sendButton = document.getElementById("send_button");
    this.textField = document.getElementById("input_text");
    this.gameButton = document.getElementById("game_button");
    this.gameButton.onclick = () => {
      this.router.navigate(["lobby"]);
    }
    this.connectButton.onclick = function(){
      console.log("łczenie");
      
    }

    this.sendButton.onclick = () => {
      var message = this.textField.value;
      ConnectionService.send(message, '/app/send/message');
      this.textField.value = "";
    }
  }

  sendMessage(){
    console.log("Wysyłanie");
  }

  changeNickname(){
    var element = ((document.getElementById("nick_text") as HTMLInputElement));
    PlayerService.setNickname(element.value);
  }
  
}
