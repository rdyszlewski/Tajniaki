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

  private readonly END_GAME_RESPONSE  = "/user/queue/game/end_game";
  private readonly QUESTION_RESPONSE = "/user/queue/game/question";
  private readonly CLICK_RESPONSE = "/user/queue/game/click";
  private readonly ANSWER_RESPONSE = "/user/queue/game/answer";
  private readonly START_RESPONSE = "/user/queue/game/start";
  private readonly NEW_SPYMASTER_RESPONSE = "/user/queue/game/new_spymaster";

  private readonly GAME_START = "/app/game/start";
  private readonly CLICK = "/app/game/click";
  private readonly QUESTION = "/app/game/question"
  private readonly FLAG = "/app/game/flag"

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
    this.subscribe(this.START_RESPONSE, new StartGameEvent(this.playerService, this.state));
    this.subscribe(this.NEW_SPYMASTER_RESPONSE, new NewSpymasterEvent(this.playerService, this.state, this.dialog));
    this.subscribe(this.END_GAME_RESPONSE, new EndGameEvent(this.stateEvent));
    this.subscribe(this.QUESTION_RESPONSE, new QuestionEvent(this.state));
    this.subscribe(this.ANSWER_RESPONSE, new AnswerEvent(this.state));
    this.subscribe(this.CLICK_RESPONSE, new ClickEvent(this.state));
    this.subscribe(ConnectionPath.DISCONNECT_RESPONSE, new GameDisconnectEvent(this.state, this.dialog, this.stateEvent));
    this.subscribeOnClose(()=>this.onCloseEvent());
  }

  public sendFlag(cardId: number) {
    this.sendWithValue(this.FLAG, cardId);
  }

  public sendSpymasterMessage(word: string, number: number) {
    let param = new QuestionParam(this.gameService.getId(), word, number);
    let json = JSON.stringify(param);
    this.sendMessage(this.QUESTION, json);
  }

  public sendClick(cardId: number) {
    this.sendWithValue(this.CLICK, cardId);
  }

  public sendPass() {
    this.sendClick(-1);
  }

  public sendStartMessage() {
    this.sendWithId(this.GAME_START);
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
