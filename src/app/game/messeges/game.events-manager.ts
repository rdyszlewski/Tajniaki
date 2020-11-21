import { ConnectionService } from '../../connection.service';
import { GameState } from '../models/game-state';
import { Role } from '../models/role';
import { PlayerService } from '../../playerService';
import { ConnectionPath } from '../../shared/connectionPath';
import { Router } from '@angular/router';
import { DialogService } from '../../dialog/dialog.service';
import { DialogMode } from '../../dialog/dialogMode';
import { DialogComponent } from '../../dialog/dialog.component';
import { GameService } from '../../gameService';
import { QuestionParam } from '../parameters/question.param';
import { EventManager } from 'src/app/shared/messages/events-manager';
import { AnswerEvent, ClickEvent, EndGameEvent, GameDisconnectEvetn as GameDisconnectEvent, NewBossEvent, QuestionEvent, StartGameEvent } from './response-event';

export class GameEventsManager extends EventManager {

  constructor(
    connectionService: ConnectionService,
    gameService: GameService,
    private playerService: PlayerService,
    private state: GameState,
    private router: Router,
    private dialog:DialogService
  ) {
    super(connectionService, gameService);
  }

  public get playerRole(){
    return this.playerService.getRole();
  }

  public init() {
    this.subscribe(ConnectionPath.START_RESPONSE, new StartGameEvent(this.playerService, this.state));
    this.subscribe(ConnectionPath.NEW_BOSS_RESPONSE, new NewBossEvent(this.playerService, this.state, this.dialog));
    this.subscribe(ConnectionPath.END_GAME_RESPONSE, new EndGameEvent(this.router));
    this.subscribe(ConnectionPath.QUESTION_RESPONSE, new QuestionEvent(this.state));
    this.subscribe(ConnectionPath.ANSWER_RESPONSE, new AnswerEvent(this.state));
    this.subscribe(ConnectionPath.CLICK_RESPONSE, new ClickEvent(this.state));
    this.subscribe(ConnectionPath.DISCONNECT_RESPONSE, new GameDisconnectEvent(this.state, this.dialog, ()=>this.exit("mainmenu")));
    this.subscribeOnClose(()=>this.onCloseEvent());
    // if(this.playerRole == Role.PLAYER){ // TODO: tutaj
    //   this.subscribe(ConnectionPath.CLICK_RESPONSE, new ClickEvent(this.state));
    // }
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
          this.exit('mainmenu');
        })
        .open(DialogComponent);
  }

  private exit(newLocation: string) {
    this.unsubscribeAll();
    this.dialog.close();
    this.router.navigate([newLocation]);
  }

  public closeDialog() {
    this.dialog.close();
  }
}
