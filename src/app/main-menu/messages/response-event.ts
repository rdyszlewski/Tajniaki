import { Router } from '@angular/router';
import { GameService } from 'src/app/gameService';
import { PlayerService } from 'src/app/playerService';
import { IResponseEvent } from 'src/app/shared/messages/response-event';

export class TestStartGameEvent implements IResponseEvent{

  constructor(private gameService: GameService, private playerService: PlayerService){}

  public execute(data: any) {
    console.log("Otrzymałem id gry");
      this.gameService.setId(data['gameId']);
      this.playerService.setId(data['playerId']);  }

}

export class TestReadyGameEvent implements IResponseEvent {

  constructor(private router: Router){

  }

  public execute(data: any) {
    this.router.navigate(["game"]);
  }
}
