import { IResponseEvent } from 'src/app/shared/messages/response-event';
import { LobbyModel } from '../../lobby.model';
import { LobbyPlayerAdapter } from '../adapters/player-adapter';

export class LobbyReadyEvent implements IResponseEvent{

  constructor(private model: LobbyModel){
  }

  public execute(data: any) {
    LobbyPlayerAdapter.setPlayerReady(data, this.model);
  }
}
