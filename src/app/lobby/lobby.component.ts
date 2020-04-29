import { Component, OnInit } from '@angular/core';
import {Team} from './team';
import { LobbyModel } from './lobbyModel';
import { LobbyEventsManager } from './lobbyEventManager';
import { ConnectionService } from '../connection.service';
import { ConnectionPath } from '../shared/connectionPath';
import { PlayerService } from '../playerService';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit {

  teams = Team;
  model: LobbyModel = new LobbyModel();
  eventsManager: LobbyEventsManager = new LobbyEventsManager();

  constructor() { }

  ngOnInit(): void {
    this.eventsManager.init(this.model);
    this.eventsManager.sendJoinToLobby();
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
    console.log(this.model.getPlayers(Team.OBSERVER));
    return this.model.getPlayers(Team.OBSERVER).length;
  }

  autoJoinToTeam(){
    // TODO: zrobić automatyczne przyłączanie do grupy
    // TODO: wysłać zgłoszenie na serwer
    ConnectionService.send("AUTO", ConnectionPath.AUTO_TEAM);
  }

  isPlayerReady(){
    return this.model.getClientPlayer().ready;
  }

}
