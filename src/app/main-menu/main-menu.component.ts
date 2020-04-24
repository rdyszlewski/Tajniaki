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

  private sendButton;
  private textField;

  constructor(private router: Router) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(){


    this.sendButton = $("#send_button");
    this.textField = $("#input_text");

    $("#game_button").click(x=>this.router.navigate(["game"]));
    

    this.sendButton.onclick = () => {
      var message = this.textField.value;
      ConnectionService.send(message, '/app/send/message');
      this.textField.value = "";
    }
  }

  connect(){
    ConnectionService.connect("localhost", 8080, function(){
        console.log("Połączono");
    });
  }

  sendMessage(){
    console.log("Wysyłanie");
  }

  changeNickname(){
    var element = $("#nick_text");
    PlayerService.setNickname(element.val() as string);
  }

  boss(){
    this.router.navigate(["boss"]);
  }
  
}
