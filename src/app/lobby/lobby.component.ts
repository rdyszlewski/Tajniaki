import { Component, OnInit, Injector} from '@angular/core';
import {Team} from './team';
import { LobbyModel } from './lobbyModel';
import { LobbyEventsManager } from './lobbyEventManager';
import { ConnectionService } from '../connection.service';
import { ConnectionPath } from '../shared/connectionPath';
import { Router } from '@angular/router';
import { View as ViewComponent } from '../shared/view';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent extends ViewComponent implements OnInit {

  team = Team;
  model: LobbyModel = new LobbyModel();
  eventsManager: LobbyEventsManager;

  constructor(private router:Router, private injector: Injector) {
    super(); 
    this.eventsManager = new LobbyEventsManager(router, injector);
  }

  ngOnInit(): void {
    console.log("ngOnInit()");
    this.eventsManager.init(this.model);
    this.eventsManager.sendJoinToLobby();
    this.setOnLeave(this.onLeaveEvent);
  }

  private onLeaveEvent(){
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
    return player.team == Team.LACK;
  }

  countBlue(){
    return this.model.getPlayers(Team.BLUE).length; 
  }

  countRed(){
    return this.model.getPlayers(Team.RED).length;
  }

  countObserver(){
    return this.model.getPlayers(Team.LACK).length;
  }

  autoJoinToTeam(){
    ConnectionService.send("AUTO", ConnectionPath.AUTO_TEAM);
  }

  isPlayerReady(){
    let clientPlayer = this.model.getClientPlayer();
    if(clientPlayer){
      return this.model.getClientPlayer().ready;
    }
    return false;
  }

  canJoinToBlue(){
    return this.countBlue() < this.model.getMaxPlayersInTeam();
  }

  canJoinToRed(){
    return this.countRed() < this.model.getMaxPlayersInTeam();
  }

  canSetReady(){
    let clientPlayer = this.model.getClientPlayer();
    if(clientPlayer){
      return this.model.getClientPlayer().team == Team.BLUE || this.model.getClientPlayer().team == Team.RED;
    }
    return false;
  }
}
