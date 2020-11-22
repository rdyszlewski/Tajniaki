import { IResponseEvent } from 'src/app/shared/messages/response-event';
import { GameState } from '../../models/game-state';
import { CardAdapter } from '../adapters/cards-adapter';
import { StateUpdateAdapter } from '../adapters/state-update-adapter';

export class AnswerEvent implements IResponseEvent {
  constructor(private state: GameState) {}

  public execute(data: any) {
    CardAdapter.updateCatrds(data['cardsToUpdate'], this.state);
    StateUpdateAdapter.update(data['gameState'], this.state);
    // if (!data['active']) {
    //   this.endMethod();
    // }
    // TODO: sprawdzić, jak wygląda koniec gry
  }
}
