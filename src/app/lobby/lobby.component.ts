import { Component, OnInit } from '@angular/core';
import {Team} from './team';
import { LobbyModel } from './lobbyModel';
import { LobbyEventsManager } from './lobbyEventManager';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit {

  private readonly HOST = "localhost";
  private readonly PORT = 8080;

  teams = Team;
  model: LobbyModel = new LobbyModel();
  eventsManager: LobbyEventsManager = new LobbyEventsManager();

  constructor() { }

  ngOnInit(): void {
    this.eventsManager.init(this.model);
    this.eventsManager.connect(this.HOST, this.PORT);
  }


  isBlue(player){
    return player.team==Team.BLUE;
  }

  isRed(player){
    return player.team == Team.RED;
  }

  isObserver(player){
    return player.team == Team.OBSERVER;
  }

  countBlue(){
    return this.model.getPlayers(Team.BLUE).length; 
  }

  countRed(){
    return this.model.getPlayers(Team.RED).length;
  }

  countObserver(){
    return this.model.getPlayers(Team.OBSERVER).length;
  }

}
