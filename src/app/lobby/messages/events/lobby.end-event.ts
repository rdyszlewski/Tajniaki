import { IStateEvent } from 'src/app/shared/change-state';
import { IResponseEvent } from 'src/app/shared/messages/response-event';

export class EndLobbyEvent implements IResponseEvent{

  constructor(private stateEvent: IStateEvent){
  }

  public execute(data: any) {
    this.stateEvent.nextState();
  }
}
