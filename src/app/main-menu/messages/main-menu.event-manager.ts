import { Router } from '@angular/router';
import { ConnectionService } from 'src/app/connection.service';
import { GameService } from 'src/app/gameService';
import { PlayerService } from 'src/app/playerService';
import { IStateEvent } from 'src/app/shared/change-state';
import { EventManager } from 'src/app/shared/messages/events-manager';
import { TestReadyGameEvent, TestStartGameEvent } from './response-event';

export class TestMainMenuEventManager extends EventManager{

  private readonly START_RESPONSE = '/app/test/start';
  private readonly READY_START_RESPONSE = "/app/test/start_ready";

  private readonly START = '/user/queue/test/start';
  private readonly READY_START = "/user/queue/test/startGame";

  constructor(connectionService: ConnectionService, gameService: GameService,
    private playerService:PlayerService, private stateEvent: IStateEvent){
    super(connectionService, gameService);
  }

  public init() {
    this.subscribe(this.START, new TestStartGameEvent(this.gameService, this.playerService));
    this.subscribe(this.READY_START, new TestReadyGameEvent(this.stateEvent));
  }


  public sendStart(){
    this.sendWithId(this.START_RESPONSE);
  }

  public sendReadyStartGame(){
    this.sendMessage(this.READY_START_RESPONSE, "siema");
  }

}
