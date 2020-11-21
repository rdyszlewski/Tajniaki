import { Router } from '@angular/router';
import { DialogComponent } from 'src/app/dialog/dialog.component';
import { DialogService } from 'src/app/dialog/dialog.service';
import { DialogMode } from 'src/app/dialog/dialogMode';
import { PlayerService } from 'src/app/playerService';
import { PlayerAdapter } from 'src/app/shared/messages/player-adapter';
import { IResponseEvent } from 'src/app/shared/messages/response-event';
import { RoleAdapter } from 'src/app/shared/messages/role-adapter';
import { TeamAdapter } from 'src/app/shared/messages/team-adapter';
import { GameState } from '../models/game-state';
import { CardAdapter } from './cards-adapter';
import { GamePlayerAdapter } from './player-adapter';
import { StateUpdateAdapter } from './state-update-adapter';

export class EndGameEvent implements IResponseEvent {
  constructor(private router: Router) {}

  public execute(data: any) {
    this.router.navigate(['summary']);
  }
}

export class QuestionEvent implements IResponseEvent {
  constructor(private state: GameState) {}

  public execute(data: any) {
    StateUpdateAdapter.update(data['gameState'], this.state);
    // TODO: można tutaj przenieść to z adaptera
  }
}

export class ClickEvent implements IResponseEvent {
  constructor(private state: GameState) {}

  public execute(data: any) {
    CardAdapter.updateCatrds(data['editedCards'], this.state);
  }
}

export class AnswerEvent implements IResponseEvent {
  constructor(private state: GameState) {}

  public execute(data: any) {
    CardAdapter.updateCatrds(data['cardsToUpdate'], this.state);
    StateUpdateAdapter.update(data['gameState'], this.state);
    // if (!data['active']) {
    //   this.endMethod();
    // }
    // TODO: sprawdzić, jak wygląda koniec gry
  }
}

export class CreateGameEvent {
  constructor(private playerService: PlayerService, private state: GameState) {}

  protected createGame(data: any) {
    this.playerService.setNickname(data['nickname']);
    this.playerService.setRole(RoleAdapter.getRole(data['playerRole']));
    this.playerService.setTeam(TeamAdapter.getTeam(data['playerTeam']));
    StateUpdateAdapter.update(data['gameState'], this.state);
    this.state.setCards(CardAdapter.createCards(data['cards']));
    GamePlayerAdapter.addPlayers(data['players'], this.state);
  }
}

export class StartGameEvent extends CreateGameEvent implements IResponseEvent {
  constructor(playerService: PlayerService, state: GameState) {
    super(playerService, state);
  }

  public execute(data: any) {
    this.createGame(data);
  }
}

export class NewBossEvent extends CreateGameEvent implements IResponseEvent {
  constructor(
    playerService: PlayerService,
    state: GameState,
    private dialog: DialogService
  ) {
    super(playerService, state);
  }

  public execute(data: any) {
    this.createGame(data); // TODO: sprawdzić, czy to zadziała
    this.openNewBossMessage();
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
}

export class GameDisconnectEvetn implements IResponseEvent {
  constructor(
    private state: GameState,
    private dialog: DialogService,
    private endMethod: () => void
  ) {}

  public execute(data: any) {
    console.log(data);
    let player = PlayerAdapter.createPlayer(data['disconnectedPlayer']);
    this.state.removePlayer(player.id);

    if (data['currentStep'] == 'LOBBY') {
      this.dialog
        .setMessage('dialog.not_enough_players')
        .setMode(DialogMode.WARNING)
        .setOnOkClick(() => {
          this.endMethod();
          // this.exit('lobby');
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
}
