import { Component, OnInit, Injector, HostListener } from '@angular/core';
import {Team} from './team';
import { LobbyModel } from './lobbyModel';
import { LobbyEventsManager } from './lobbyEventManager';
import { ConnectionService } from '../connection.service';
import { ConnectionPath } from '../shared/connectionPath';
import { GameService } from '../gameService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit {

  teams = Team;
  model: LobbyModel = new LobbyModel();
  eventsManager: LobbyEventsManager;

  constructor(private router:Router, private injector: Injector) { 
    this.eventsManager = new LobbyEventsManager(router, injector);
  }

  ngOnInit(): void {
    this.eventsManager.init(this.model);
    this.eventsManager.sendJoinToLobby();
  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event) { // back button pressed
    this.onLeave();    
  }

  @HostListener('window:unload')
  onUnload(){
    console.log("Usuwanie subskrybcji");
    this.onLeave();
  }

  private onLeave(){
    this.eventsManager.unsubscribeAll();
    this.eventsManager.closeDialog();
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

  autoJoinToTeam(){
    ConnectionService.send("AUTO", ConnectionPath.AUTO_TEAM);
  }

  isPlayerReady(){
    return this.model.getClientPlayer().ready;
  }

  canJoinToBlue(){
    return this.countBlue() < this.model.getMaxPlayersInTeam();
  }

  canJoinToRed(){
    return this.countRed() < this.model.getMaxPlayersInTeam();
  }

  canSetReady(){
    return this.model.getClientPlayer().team == Team.BLUE || this.model.getClientPlayer().team == Team.RED;
  }
}
