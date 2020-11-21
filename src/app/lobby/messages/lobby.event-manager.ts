import { ConnectionService } from '../../connection.service';
import { PlayerService } from '../../playerService';
import { ConnectionPath } from '../../shared/connectionPath';
import { GameService } from '../../gameService';
import { Router } from '@angular/router';
import { DialogService } from '../../dialog/dialog.service';
import { Injector } from '@angular/core';
import { DialogMode } from '../../dialog/dialogMode';
import { DialogComponent } from '../../dialog/dialog.component';
import { LobbyModel } from '../lobby.model';
import { Team } from '../team';
import { EventManager } from 'src/app/shared/messages/events-manager';
import { ChangeTeamEvent, EndLobbyEvent, JointToLobbyEvent, LobbyDisconnectEvent, LobbyReadyEvent, PlayerConnectEvent } from './response-event';

export class LobbyEventsManager extends EventManager {

  public constructor(connectionService: ConnectionService, gameService: GameService,
    private router: Router, private dialog: DialogService,  private playerService: PlayerService,
    private model: LobbyModel) {
    super(connectionService, gameService);
  }

  public init() {

    this.subscribe(ConnectionPath.DISCONNECT_RESPONSE, new LobbyDisconnectEvent(this.model));
    this.subscribe(ConnectionPath.LOBBY_END_RESPONSE, new EndLobbyEvent(this.router));
    this.subscribe(ConnectionPath.READY_RESPONSE, new LobbyReadyEvent(this.model));
    this.subscribe(ConnectionPath.CHANGE_TEAM_REPONSE, new ChangeTeamEvent(this.model));
    this.subscribe(ConnectionPath.PLAYERS_RESPONSE, new JointToLobbyEvent(this.gameService, this.playerService, this.model));
    this.subscribe(ConnectionPath.CONNECT_RESPONSE, new PlayerConnectEvent(this.model));
    this.subscribeOnClose(()=>this.runOnCloseEvent());
  }

  private runOnCloseEvent(){
    this.unsubscribeAll();
    this.dialog
      .setMessage('dialog.disconnected')
      .setMode(DialogMode.WARNING)
      .setOnOkClick(() => {
        this.unsubscribeAll();
        this.dialog.close();
        this.router.navigate(['mainmenu']);
      })
      .open(DialogComponent);
  }

  public sendReady() {
    this.sendWithValue(ConnectionPath.READY, !this.model.getClientPlayer().ready);
  }

  public sendJoinBlue() {
    this.sendJoinToTeam(Team.BLUE);
  }

  private sendJoinToTeam(team: Team) {
    // TODO: sprawdzić, czy to zadziała
    this.sendWithValue(ConnectionPath.CHANGE_TEAM, team);
  }

  public sendJoinRed() {
    this.sendJoinToTeam(Team.RED);
  }

  public sendJoinToLobby() {
    this.sendMessage(ConnectionPath.CONNECT, this.playerService.getNickname());
  }

  public sendAutoJoinToTeam() {
    this.sendWithId(ConnectionPath.AUTO_TEAM);
  }

  public closeDialog() {
    this.dialog.close();
  }
}
