import { GameService } from 'src/app/gameService';
import { PlayerService } from 'src/app/playerService';
import { IResponseEvent } from 'src/app/shared/messages/response-event';
import { LobbyModel } from '../../lobby.model';
import { LobbyPlayerAdapter } from '../adapters/player-adapter';

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
