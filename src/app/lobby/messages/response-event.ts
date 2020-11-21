import { Router } from '@angular/router';
import { GameService } from 'src/app/gameService';
import { PlayerService } from 'src/app/playerService';
import { PlayerAdapter } from 'src/app/shared/messages/player-adapter';
import { IResponseEvent } from 'src/app/shared/messages/response-event';
import { TeamAdapter } from 'src/app/shared/messages/team-adapter';
import { LobbyModel } from '../lobby.model';
import { LobbyPlayerAdapter } from './player-adapter';

export class LobbyDisconnectEvent implements IResponseEvent{

  constructor(private model: LobbyModel){
  }

  public execute(data: any) {
    let player = PlayerAdapter.createPlayer(data['disconnectedPlayer']);
    this.model.removePlayer(this.model.getPlayerById(player.id));
  }

}

export class EndLobbyEvent implements IResponseEvent{

  constructor(private router: Router){
  }

  public execute(data: any) {
    this.router.navigate(['voting']);
  }
}

export class LobbyReadyEvent implements IResponseEvent{

  constructor(private model: LobbyModel){
  }

  public execute(data: any) {
    LobbyPlayerAdapter.setPlayerReady(data, this.model);
    // TODO: sprawdzić, czy tutaj nie można wstawić treści klasy
  }
}

export class ChangeTeamEvent implements IResponseEvent{

  constructor(private model: LobbyModel){
  }

  public execute(data: any) {
    var player = this.model.getPlayerById(data['id']);
    player.team = TeamAdapter.getTeam(data['team']);
  }

}

export class JointToLobbyEvent implements IResponseEvent{

  constructor(private gameService: GameService, private playerService: PlayerService, private model: LobbyModel){
  }

  public execute(data: any) {
    this.gameService.setId(data['gameId']);
    this.playerService.setId(data['playerId']);
    this.setSettings(data['settings']);
    LobbyPlayerAdapter.addPlayers(data["players"], this.model);
    this.model.setMinPlayersInTeam(data['minPlayersInTeam']);
    this.model.setMaxPlayersInTeam(data['maxPlayersInTeam']);
  }

  private setSettings(settings): void {
    let maxTeamSize = settings['maxTeamSize'];
    this.gameService.setMaxTeamSize(maxTeamSize);
  }

}

export class PlayerConnectEvent implements IResponseEvent{

  constructor(private model: LobbyModel){
  }

  public execute(data: any) {
    let newPlayer = LobbyPlayerAdapter.create(data);
    this.model.addPlayer(newPlayer);
  }

}
