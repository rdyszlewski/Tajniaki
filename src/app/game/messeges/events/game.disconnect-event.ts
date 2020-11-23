import { DialogComponent } from 'src/app/dialog/dialog.component';
import { DialogService } from 'src/app/dialog/dialog.service';
import { DialogMode } from 'src/app/dialog/dialogMode';
import { State } from 'src/app/main/state';
import { IStateEvent } from 'src/app/shared/change-state';
import { PlayerAdapter } from 'src/app/shared/messages/player-adapter';
import { IResponseEvent } from 'src/app/shared/messages/response-event';
import { GameState } from '../../models/game-state';
import { GamePlayerAdapter } from '../adapters/player-adapter';

export class GameDisconnectEvent implements IResponseEvent {
  constructor(
    private state: GameState,
    private dialog: DialogService,
    private stateEvent: IStateEvent
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
          this.stateEvent.goToState(State.LOBBY);
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
