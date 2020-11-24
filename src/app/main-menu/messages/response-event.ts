import { GameService } from 'src/app/gameService';
import { State } from 'src/app/main/state';
import { PlayerService } from 'src/app/playerService';
import { IStateEvent } from 'src/app/shared/change-state';
import { IResponseEvent } from 'src/app/shared/messages/response-event';

export class TestStartGameEvent implements IResponseEvent {
  constructor(
    private gameService: GameService,
    private playerService: PlayerService
  ) {}

  public execute(data: any) {
    this.gameService.setId(data['gameId']);
    this.playerService.setId(data['playerId']);
  }
}

export class TestReadyGameEvent implements IResponseEvent {
  constructor(private stateEvent: IStateEvent) {}

  public execute(data: any) {
    this.stateEvent.goToState(State.GAME);
  }
}
