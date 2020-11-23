import { ConnectionService } from '../../connection.service';
import { GameState } from '../models/game-state';
import { PlayerService } from '../../playerService';
import { ConnectionPath } from '../../shared/connectionPath';
import { Router } from '@angular/router';
import { DialogService } from '../../dialog/dialog.service';
import { DialogMode } from '../../dialog/dialogMode';
import { DialogComponent } from '../../dialog/dialog.component';
import { GameService } from '../../gameService';
import { QuestionParam } from '../parameters/question.param';
import { EventManager } from 'src/app/shared/messages/events-manager';
import { AnswerEvent } from './events/game.answer-event';
import { ClickEvent } from './events/game.click-event';
import { EndGameEvent } from './events/game.end-event';
import { NewBossEvent } from './events/game.new-boss-event';
import { QuestionEvent } from './events/game.question-event';
import { StartGameEvent } from './events/game.start-game-event';
import { GameDisconnectEvent } from './events/game.disconnect-event';
import { IStateEvent } from 'src/app/shared/change-state';

export class GameEventsManager extends EventManager {

  constructor(
    connectionService: ConnectionService,
    gameService: GameService,
    private playerService: PlayerService,
    private state: GameState,
    private dialog:DialogService,
    private stateEvent: IStateEvent
  ) {
    super(connectionService, gameService);
  }

  public get playerRole(){
    return this.playerService.getRole();
  }

  public init() {
    this.subscribe(ConnectionPath.START_RESPONSE, new StartGameEvent(this.playerService, this.state));
    this.subscribe(ConnectionPath.NEW_BOSS_RESPONSE, new NewBossEvent(this.playerService, this.state, this.dialog));
    this.subscribe(ConnectionPath.END_GAME_RESPONSE, new EndGameEvent(this.stateEvent));
    this.subscribe(ConnectionPath.QUESTION_RESPONSE, new QuestionEvent(this.state));
    this.subscribe(ConnectionPath.ANSWER_RESPONSE, new AnswerEvent(this.state));
    this.subscribe(ConnectionPath.CLICK_RESPONSE, new ClickEvent(this.state));
    this.subscribe(ConnectionPath.DISCONNECT_RESPONSE, new GameDisconnectEvent(this.state, this.dialog, this.stateEvent));
    this.subscribeOnClose(()=>this.onCloseEvent());
  }

  public sendFlag(cardId: number) {
    this.sendWithValue(ConnectionPath.FLAG, cardId);
  }

  public sendBossMessage(word: string, number: number) {
    let param = new QuestionParam(this.gameService.getId(), word, number);
    let json = JSON.stringify(param);
    this.sendMessage(ConnectionPath.QUESTION, json);
  }

  public sendClick(cardId: number) {
    this.sendWithValue(ConnectionPath.CLICK, cardId);
  }

  public sendPass() {
    this.sendClick(-1);
  }

  public sendStartMessage() {
    this.sendWithId(ConnectionPath.GAME_START);
  }

  public onCloseEvent(){
    this.dialog
        .setMessage('dialog.disconnected')
        .setMode(DialogMode.WARNING)
        .setOnOkClick(() => {
          this.stateEvent.disconnect();
        })
        .open(DialogComponent);
  }

  public closeDialog() {
    this.dialog.close();
  }

  public close(){
    super.close();
    this.closeDialog();
  }
}
