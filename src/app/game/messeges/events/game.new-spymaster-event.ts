import { DialogComponent } from 'src/app/dialog/dialog.component';
import { DialogService } from 'src/app/dialog/dialog.service';
import { DialogMode } from 'src/app/dialog/dialogMode';
import { PlayerService } from 'src/app/playerService';
import { IResponseEvent } from 'src/app/shared/messages/response-event';
import { GameState } from '../../models/game-state';
import { CreateGameEvent } from './game.create-game-event';

export class NewSpymasterEvent
  extends CreateGameEvent
  implements IResponseEvent {
  constructor(
    playerService: PlayerService,
    state: GameState,
    private dialog: DialogService
  ) {
    super(playerService, state);
  }

  public execute(data: any) {
    this.createGame(data);
    this.openNewSpymasterMessage();
  }

  private openNewSpymasterMessage() {
    this.dialog
      .setMode(DialogMode.ALERT)
      .setMessage('dialog.you_are_new_spymaster')
      .setOnOkClick(() => {
        this.dialog.close();
      })
      .open(DialogComponent);
  }
}
