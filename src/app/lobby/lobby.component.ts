import { Component, OnInit } from '@angular/core';
import { Team } from './team';
import { LobbyModel } from './lobby.model';
import { LobbyEventsManager } from './messages/lobby.event-manager';
import { ViewComponent } from '../shared/view-component';
import { PlayerService } from '../playerService';
import { GameService } from '../gameService';
import { ConnectionService } from '../connection.service';
import { DialogService } from '../widgets/dialog/dialog.service';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css'],
})
export class LobbyComponent extends ViewComponent implements OnInit {
  team = Team;

  private _eventsManager: LobbyEventsManager;
  public get eventsManager(): LobbyEventsManager {
    return this._eventsManager;
  }

  constructor(
    private connectionService: ConnectionService,
    private dialog: DialogService,
    private gameService: GameService,
    private playerService: PlayerService,
    private _model: LobbyModel
  ) {
    super();
    this._eventsManager = new LobbyEventsManager(
      connectionService,
      gameService,
      dialog,
      playerService,
      this.model,
      this
    );
  }

  public get model(): LobbyModel {
    return this._model;
  }

  public init() {
    this._eventsManager.init();
    this._eventsManager.sendJoinToLobby();
  }

  public close() {
    this.model.clear();
    this.eventsManager.close();
  }

  ngOnInit(): void {}

  isBlue(player) {
    return player.team == Team.BLUE;
  }

  isRed(player) {
    return player.team == Team.RED;
  }

  isObserver(player) {
    return player.team == Team.LACK;
  }

  countBlue() {
    return this._model.getPlayers(Team.BLUE).length;
  }

  countRed() {
    return this._model.getPlayers(Team.RED).length;
  }

  countObserver() {
    return this._model.getPlayers(Team.LACK).length;
  }

  isPlayerReady() {
    if (this._model.getClientPlayer()) {
      return this._model.getClientPlayer().ready;
    }
    return false;
  }

  canJoinToBlue() {
    return this.countBlue() < this._model.getMaxPlayersInTeam();
  }

  canJoinToRed() {
    return this.countRed() < this._model.getMaxPlayersInTeam();
  }

  canSetReady() {
    if (this._model.getClientPlayer()) {
      return (
        this._model.getClientPlayer().team == Team.BLUE ||
        this._model.getClientPlayer().team == Team.RED
      );
    }
    return false;
  }

  getNickname() {
    return this.playerService.getNickname();
  }

  getTeam() {
    return this.playerService.getTeam();
  }
}
