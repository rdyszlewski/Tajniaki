import { IResponseEvent } from 'src/app/shared/messages/response-event';
import { GameState } from '../../models/game-state';
import { StateUpdateAdapter } from '../adapters/state-update-adapter';

export class QuestionEvent implements IResponseEvent {
  constructor(private state: GameState) {}

  public execute(data: any) {
    StateUpdateAdapter.update(data['gameState'], this.state);
  }
}
