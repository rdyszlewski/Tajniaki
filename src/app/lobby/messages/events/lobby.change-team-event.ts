import { IResponseEvent } from 'src/app/shared/messages/response-event';
import { TeamAdapter } from 'src/app/shared/messages/team-adapter';
import { LobbyModel } from '../../lobby.model';

export class ChangeTeamEvent implements IResponseEvent{

  constructor(private model: LobbyModel){
  }

  public execute(data: any) {
    var player = this.model.getPlayerById(data['id']);
    player.team = TeamAdapter.getTeam(data['team']);
  }

}
