import { PlayerAdapter } from 'src/app/shared/messages/player-adapter';
import { IResponseEvent } from 'src/app/shared/messages/response-event';
import { LobbyModel } from '../../lobby.model';

export class LobbyDisconnectEvent implements IResponseEvent {
  constructor(private model: LobbyModel) {}

  public execute(data: any) {
    let player = PlayerAdapter.createPlayer(data['disconnectedPlayer']);
    this.model.removePlayer(this.model.getPlayerById(player.id));
  }
}
