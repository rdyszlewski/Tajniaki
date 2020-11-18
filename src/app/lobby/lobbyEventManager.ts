import { ConnectionService } from '../connection.service';
import { LobbyModel } from './lobbyModel';
import { PlayerService } from '../playerService';
import { ConnectionPath } from '../shared/connectionPath';
import { Team, TeamAdapter } from './team';
import { GameService } from '../gameService';
import { Router } from '@angular/router';
import { PlayerAdapter } from '../shared/adapters/playerAdapter';
import { DialogService } from '../dialog/dialog.service';
import { Injector } from '@angular/core';
import { DialogMode } from '../dialog/dialogMode';
import { DialogComponent } from '../dialog/dialog.component';
import { StringParam } from '../shared/parameters/string.param';
import { IdParam } from '../shared/parameters/id.param';
import { BoolParam } from '../shared/parameters/bool.param';

export class LobbyEventsManager {
  private dialog: DialogService;

  public constructor(private router: Router, private injector: Injector, private gameService: GameService, private playerService: PlayerService,
    private model: LobbyModel) {
    }

  public init() {
    this.dialog = this.injector.get(DialogService);

    this.subscribeJoinToLobbyResponse();
    this.subscribePlayerConnect();
    this.subscribeChangeTeam();
    this.subscribeReady();
    this.subscribeEndLobby();
    this.subscribeDisconnect();
    this.subscribeOnCloseEvent();
  }

  private subscribeOnCloseEvent() {
    ConnectionService.setOnCloseEvent(() => {
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
    });
  }

  private subscribeDisconnect() {
    ConnectionService.subscribe(
      ConnectionPath.DISCONNECT_RESPONSE,
      (message) => {
        let data = JSON.parse(message.body);
        let player = PlayerAdapter.createPlayer(data['disconnectedPlayer']);
        this.model.removePlayer(this.model.getPlayerById(player.id));
      }
    );
  }

  private subscribeEndLobby() {
    ConnectionService.subscribe(
      ConnectionPath.LOBBY_END_RESPONSE,
      (message) => {
        this.router.navigate(['voting']);
      }
    );
  }

  private subscribeReady() {
    ConnectionService.subscribe(ConnectionPath.READY_RESPONSE, (message) =>
      this.setPlayerReady(message)
    );
  }

  private setPlayerReady(message: any) {
    var data = JSON.parse(message.body);
    let player = this.model.getPlayerById(data['playerId']);
    player.ready = data['ready'];
  }

  private subscribeChangeTeam() {
    ConnectionService.subscribe(ConnectionPath.CHANGE_TEAM_REPONSE, (message) =>
      this.setPlayerTeam(message)
    );
  }

  private setPlayerTeam(message: any) {
    var json = JSON.parse(message.body);
    var player = this.model.getPlayerById(json['id']);
    player.team = TeamAdapter.getTeam(json['team']);
  }

  private subscribePlayerConnect() {
    ConnectionService.subscribe(ConnectionPath.CONNECT_RESPONSE, (message) => {
      let data = JSON.parse(message.body);
      let newPlayer = PlayerAdapter.createPlayer(data);
      this.model.addPlayer(newPlayer);
    });
  }

  private subscribeJoinToLobbyResponse() {
    ConnectionService.subscribe(ConnectionPath.PLAYERS_RESPONSE, (message) => {
      var data = JSON.parse(message.body);
      this.gameService.setId(data['gameId']);
      this.playerService.setId(data['playerId']);
      this.setSettings(data['settings']);
      this.setPlayers(data['players']);
      console.log(data["players"]);
      this.model.setMinPlayersInTeam(data['minPlayersInTeam']);
      this.model.setMaxPlayersInTeam(data['maxPlayersInTeam']);
    });
  }

  private setSettings(settings): void {
    let maxTeamSize = settings['maxTeamSize'];
    this.gameService.setMaxTeamSize(maxTeamSize);
  }

  private setPlayers(players): void {
    players.forEach((playerElement) => {
      console.log("Player");
      var player = PlayerAdapter.createPlayer(playerElement);
      this.model.addPlayer(player);
    });
  }

  public sendReady() {
    let param = new BoolParam(
      this.gameService.getId(),
      !this.model.getClientPlayer().ready
    );
    let json = JSON.stringify(param);
    ConnectionService.send(json, ConnectionPath.READY);
  }

  public sendJoinBlue() {
    this.sendJoinToTeam(Team.BLUE);
  }

  private sendJoinToTeam(team: Team) {
    let param = new StringParam(this.gameService.getId(), team.toString());
    let json = JSON.stringify(param);
    ConnectionService.send(json, ConnectionPath.CHANGE_TEAM);
  }

  public sendJoinRed() {
    this.sendJoinToTeam(Team.RED);
  }

  public sendJoinToLobby() {
    ConnectionService.send(this.playerService.getNickname(), ConnectionPath.CONNECT);
  }

  public sendAutoJoinToTeam() {
    let param = new IdParam(this.gameService.getId());
    let json = JSON.stringify(param);
    ConnectionService.send(json, ConnectionPath.AUTO_TEAM);
  }

  public unsubscribeAll() {
    ConnectionService.unsubscribe(ConnectionPath.DISCONNECT_RESPONSE);
    ConnectionService.unsubscribe(ConnectionPath.LOBBY_END_RESPONSE);
    ConnectionService.unsubscribe(ConnectionPath.READY_RESPONSE);
    ConnectionService.unsubscribe(ConnectionPath.CHANGE_TEAM_REPONSE);
    ConnectionService.unsubscribe(ConnectionPath.CONNECT_RESPONSE);
    ConnectionService.unsubscribe(ConnectionPath.PLAYERS_RESPONSE);
  }

  public closeDialog() {
    this.dialog.close();
  }
}
