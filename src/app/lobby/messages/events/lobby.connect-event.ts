import { IResponseEvent } from 'src/app/shared/messages/response-event';
import { LobbyModel } from '../../lobby.model';
import { LobbyPlayerAdapter } from '../adapters/player-adapter';

export class PlayerConnectEvent implements IResponseEvent{

  constructor(private model: LobbyModel){
  }

  public execute(data: any) {
    let newPlayer = LobbyPlayerAdapter.create(data);
    this.model.addPlayer(newPlayer);
  }

}
