import { ConnectionService } from '../../connection.service';
import { GameState } from '../models/game-state';
import { Role } from '../models/role';
import { PlayerService } from '../../playerService';
import { ConnectionPath } from '../../shared/connectionPath';
import { Router } from '@angular/router';
import { Injector } from '@angular/core';
import { DialogService } from '../../dialog/dialog.service';
import { DialogMode } from '../../dialog/dialogMode';
import { DialogComponent } from '../../dialog/dialog.component';
import { GameService } from '../../gameService';
import { IdParam } from '../../shared/parameters/id.param';
import { NumberParam } from '../../shared/parameters/number.param';
import { QuestionParam } from '../parameters/question.param';
import { StateUpdateAdapter } from './state-update-adapter';
import { CardAdapter } from './cards-adapter';
import { RoleAdapter } from '../../shared/messages/role-adapter';
import { GamePlayerAdapter } from './player-adapter';
import { TeamAdapter } from 'src/app/shared/messages/team-adapter';
import { PlayerAdapter } from 'src/app/shared/messages/player-adapter';

export class GameEventsManager {
  private playerRole: Role;
  private router: Router;
  private dialog: DialogService;

  constructor(
    private gameService: GameService,
    private playerService: PlayerService,
    private state: GameState
  ) {}

  public init(gameState: GameState, router: Router, injector: Injector) {
    this.state = gameState;
    this.playerRole = this.playerService.getRole();
    this.router = router;
    this.dialog = injector.get(DialogService);

    this.subscribeEvents();
  }

  private subscribeEvents() {
    this.subscribeStartEvent();
    this.subscribeNewBossEvent();
    this.subscribeEndEvent();
    this.subscribeQuestionEvent();
    this.subscribeAnswerEvent();
    this.subscribeClickEvent();
    this.subscribeDisconnect();
    this.setOnCloseEvent();

    if (this.playerRole == Role.PLAYER) {
      this.subscribeClickEvent();
    }
  }

  private subscribeEndEvent() {
    this.endGame();
  }

  private endGame() {
    ConnectionService.subscribe(ConnectionPath.END_GAME_RESPONSE, (message) => {
      this.router.navigate(['summary']);
    });
  }

  private subscribeQuestionEvent() {
    ConnectionService.subscribe(ConnectionPath.QUESTION_RESPONSE, (message) => {
      this.updateStateAfterReceiveQuestion(message);
    });
  }

  private updateStateAfterReceiveQuestion(message: any) {
    let data = JSON.parse(message.body);
    StateUpdateAdapter.update(data['gameState'], this.state);
  }

  private subscribeClickEvent() {
    ConnectionService.subscribe(ConnectionPath.CLICK_RESPONSE, (message) => {
      this.updateStateAfterClick(message);
    });
  }

  private updateStateAfterClick(message: any) {
    var data = JSON.parse(message.body);
    CardAdapter.updateCatrds(data["editedCards"], this.state);
  }

  private subscribeAnswerEvent() {
    ConnectionService.subscribe(ConnectionPath.ANSWER_RESPONSE, (message) => {
      this.updateStateAfterReceiveAnswer(message);
    });
  }

  private updateStateAfterReceiveAnswer(message: any) {
    var data = JSON.parse(message.body);
    CardAdapter.updateCatrds(data["cardsToUpdate"], this.state);
    StateUpdateAdapter.update(data['gameState'], this.state);
    if (!data['active']) {
      this.endGame();
    }
  }

  private subscribeStartEvent() {
    ConnectionService.subscribe(ConnectionPath.START_RESPONSE, (message) => {
      this.startGame(message);
    });
  }

  private subscribeNewBossEvent() {
    ConnectionService.subscribe(ConnectionPath.NEW_BOSS_RESPONSE, (message) => {
      this.startGame(message);
      this.openNewBossMessage();
    });
  }

  private openNewBossMessage() {
    this.dialog
      .setMode(DialogMode.ALERT)
      .setMessage('dialog.you_are_new_boss')
      .setOnOkClick(() => {
        this.dialog.close();
      })
      .open(DialogComponent);
  }

  private startGame(message: any) {
    var data = JSON.parse(message.body);
    this.playerService.setNickname(data['nickname']);
    this.playerService.setRole(RoleAdapter.getRole(data['playerRole']));
    this.playerService.setTeam(TeamAdapter.getTeam(data['playerTeam']));
    StateUpdateAdapter.update(data['gameState'], this.state);
    this.state.setCards(CardAdapter.createCards(data['cards']));
    GamePlayerAdapter.addPlayers(data['players'], this.state);
  }

  public sendFlag(cardId: number) {
    let param = new NumberParam(this.gameService.getId(), cardId);
    let json = JSON.stringify(param);
    ConnectionService.send(json, ConnectionPath.FLAG);
  }

  public sendBossMessage(word: string, number: number) {
    let param = new QuestionParam(this.gameService.getId(), word, number);
    let json = JSON.stringify(param);
    ConnectionService.send(json, ConnectionPath.QUESTION);
  }

  public sendClick(cardId: number) {
    let param = new NumberParam(this.gameService.getId(), cardId);
    let json = JSON.stringify(param);
    ConnectionService.send(json, ConnectionPath.CLICK);
  }

  public sendPass() {
    ConnectionService.send(-1, ConnectionPath.CLICK);
  }

  public sendStartMessage() {
    let param = new IdParam(this.gameService.getId());
    let json = JSON.stringify(param);
    ConnectionService.send(json, ConnectionPath.GAME_START);
  }

  private setOnCloseEvent() {
    ConnectionService.setOnCloseEvent(() => {
      this.dialog
        .setMessage('dialog.disconnected')
        .setMode(DialogMode.WARNING)
        .setOnOkClick(() => {
          this.exit('mainmenu');
        })
        .open(DialogComponent);
    });
  }

  private subscribeDisconnect() {
    ConnectionService.subscribe(
      ConnectionPath.DISCONNECT_RESPONSE,
      (message) => {
        let data = JSON.parse(message.body);
        console.log(data);
        let player = PlayerAdapter.createPlayer(data['disconnectedPlayer']);
        console.log('Disconnected: ' + player.nickname);
        this.state.removePlayer(player.id);

        if (data['currentStep'] == 'LOBBY') {
          this.dialog
            .setMessage('dialog.not_enough_players')
            .setMode(DialogMode.WARNING)
            .setOnOkClick(() => {
              this.exit('lobby');
            })
            .open(DialogComponent);
        }

        let playersText = data['players'];
        if (playersText != null) {
          let players = GamePlayerAdapter.createPlayers(playersText);
          this.state.removeAllPlayers();
          players.forEach((x) => this.state.addPlayer(x));
        }
      }
    );
  }

  private exit(newLocation: string) {
    this.unsubscribeAll();
    this.dialog.close();
    this.router.navigate([newLocation]);
  }

  public unsubscribeAll() {
    ConnectionService.unsubscribe(ConnectionPath.END_GAME_RESPONSE);
    ConnectionService.unsubscribe(ConnectionPath.QUESTION_RESPONSE);
    ConnectionService.unsubscribe(ConnectionPath.CLICK_RESPONSE);
    ConnectionService.unsubscribe(ConnectionPath.ANSWER_RESPONSE);
    ConnectionService.unsubscribe(ConnectionPath.START_RESPONSE);
    ConnectionService.unsubscribe(ConnectionPath.NEW_BOSS_RESPONSE);
    ConnectionService.unsubscribe(ConnectionPath.DISCONNECT_RESPONSE);
    ConnectionService.setOnCloseEvent(null);
  }

  public closeDialog() {
    this.dialog.close();
  }
}
