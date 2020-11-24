import { ConnectionService } from '../../connection.service';
import { PlayerService } from '../../playerService';
import { ConnectionPath } from '../../shared/connectionPath';
import { GameService } from '../../gameService';
import { LobbyModel } from '../lobby.model';
import { Team } from '../team';
import { EventManager } from 'src/app/shared/messages/events-manager';
import { ChangeTeamEvent } from './events/lobby.change-team-event';
import { PlayerConnectEvent } from './events/lobby.connect-event';
import { LobbyDisconnectEvent } from './events/lobby.disconnect-event';
import { EndLobbyEvent } from './events/lobby.end-event';
import { JointToLobbyEvent } from './events/lobby.join-event';
import { LobbyReadyEvent } from './events/lobby.ready-event';
import { IStateEvent } from 'src/app/shared/change-state';
import { DialogComponent } from 'src/app/widgets/dialog/dialog.component';
import { DialogService } from 'src/app/widgets/dialog/dialog.service';
import { DialogMode } from 'src/app/widgets/dialog/dialogMode';

export class LobbyEventsManager extends EventManager {

  public constructor(connectionService: ConnectionService, gameService: GameService,
    private dialog: DialogService,  private playerService: PlayerService,
    private model: LobbyModel, private stateEvent: IStateEvent) {
    super(connectionService, gameService);
  }

  public init() {
    this.subscribe(ConnectionPath.DISCONNECT_RESPONSE, new LobbyDisconnectEvent(this.model));
    this.subscribe(ConnectionPath.LOBBY_END_RESPONSE, new EndLobbyEvent(this.stateEvent));
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
        this.stateEvent.disconnect();
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

  public close(){
    super.close();
    this.closeDialog();
  }
}
