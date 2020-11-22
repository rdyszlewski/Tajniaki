import { IResponseEvent } from 'src/app/shared/messages/response-event';
import { GameState } from '../../models/game-state';
import { CardAdapter } from '../adapters/cards-adapter';

export class ClickEvent implements IResponseEvent {
  constructor(private state: GameState) {}

  public execute(data: any) {
    CardAdapter.updateCatrds(data['editedCards'], this.state);
  }
}
