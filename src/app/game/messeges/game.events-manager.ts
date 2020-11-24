import { ConnectionService } from '../../connection.service';
import { GameState } from '../models/game-state';
import { PlayerService } from '../../playerService';
import { ConnectionPath } from '../../shared/connectionPath';
import { GameService } from '../../gameService';
import { QuestionParam } from '../parameters/question.param';
import { EventManager } from 'src/app/shared/messages/events-manager';
import { AnswerEvent } from './events/game.answer-event';
import { ClickEvent } from './events/game.click-event';
import { EndGameEvent } from './events/game.end-event';
import { NewSpymasterEvent } from './events/game.new-spymaster-event';
import { QuestionEvent } from './events/game.question-event';
import { StartGameEvent } from './events/game.start-game-event';
import { GameDisconnectEvent } from './events/game.disconnect-event';
import { IStateEvent } from 'src/app/shared/change-state';
import { DialogComponent } from 'src/app/widgets/dialog/dialog.component';
import { DialogService } from 'src/app/widgets/dialog/dialog.service';
import { DialogMode } from 'src/app/widgets/dialog/dialogMode';

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
    this.subscribe(ConnectionPath.NEW_SPYMASTER_RESPONSE, new NewSpymasterEvent(this.playerService, this.state, this.dialog));
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

  public sendSpymasterMessage(word: string, number: number) {
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
