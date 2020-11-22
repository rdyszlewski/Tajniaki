import { PlayerService } from 'src/app/playerService';
import { IResponseEvent } from 'src/app/shared/messages/response-event';
import { GameState } from '../../models/game-state';
import { CreateGameEvent } from './game.create-game-event';

export class StartGameEvent extends CreateGameEvent implements IResponseEvent {
  constructor(playerService: PlayerService, state: GameState) {
    super(playerService, state);
  }

  public execute(data: any) {
    this.createGame(data);
  }
}
