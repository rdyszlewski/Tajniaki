import { Component, OnInit, Injector} from '@angular/core';
import {Team} from './team';
import { LobbyModel } from './lobbyModel';
import { LobbyEventsManager } from './lobbyEventManager';
import { Router } from '@angular/router';
import { View as ViewComponent } from '../shared/view';
import {PlayerService} from "../playerService";
import { GameService } from '../gameService';


@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent extends ViewComponent implements OnInit {

  team = Team;
  private _model: LobbyModel;
  public get model():LobbyModel{return this._model;}
  private _eventsManager: LobbyEventsManager;
  public get eventsManager():LobbyEventsManager{return this._eventsManager;}


  constructor(private router:Router, private injector: Injector, private gameService: GameService, private playerService: PlayerService) {
    super();
    this._model = new LobbyModel(playerService);
    this._eventsManager = new LobbyEventsManager(router, injector, gameService, playerService);
  }

  ngOnInit(): void {
    this._eventsManager.init(this._model);
    this._eventsManager.sendJoinToLobby();
    this.setOnLeave(this.onLeaveEvent);
  }

  private onLeaveEvent(){
    this._eventsManager.unsubscribeAll();
    this._eventsManager.closeDialog();
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
    return this._model.getPlayers(Team.BLUE).length;
  }

  countRed(){
    return this._model.getPlayers(Team.RED).length;
  }

  countObserver(){
    return this._model.getPlayers(Team.LACK).length;
  }

  isPlayerReady(){
    if(this._model.getClientPlayer()){
      return this._model.getClientPlayer().ready;
    }
    return false;
  }

  canJoinToBlue(){
    return this.countBlue() < this._model.getMaxPlayersInTeam();
  }

  canJoinToRed(){
    return this.countRed() < this._model.getMaxPlayersInTeam();
  }

  canSetReady(){
    if(this._model.getClientPlayer()){
      return this._model.getClientPlayer().team == Team.BLUE || this._model.getClientPlayer().team == Team.RED;
    }
    return false;
  }

  getNickname(){
    return this.playerService.getNickname();
  }

  getTeam(){
    return this.playerService.getTeam();
  }
}
