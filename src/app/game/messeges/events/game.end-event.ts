import { Router } from '@angular/router';
import { IStateEvent } from 'src/app/shared/change-state';
import { IResponseEvent } from 'src/app/shared/messages/response-event';

export class EndGameEvent implements IResponseEvent {
  constructor(private stateEvent: IStateEvent) {}

  public execute(data: any) {
    this.stateEvent.nextState();
  }
}
