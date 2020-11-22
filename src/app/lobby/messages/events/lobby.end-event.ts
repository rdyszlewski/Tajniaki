import { Router } from '@angular/router';
import { IResponseEvent } from 'src/app/shared/messages/response-event';

export class EndLobbyEvent implements IResponseEvent{

  constructor(private router: Router){
  }

  public execute(data: any) {
    this.router.navigate(['voting']);
  }
}
