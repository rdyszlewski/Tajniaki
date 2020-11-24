
import { PlayerService } from 'src/app/playerService';
import { IResponseEvent } from 'src/app/shared/messages/response-event';
import { DialogComponent } from 'src/app/widgets/dialog/dialog.component';
import { DialogService } from 'src/app/widgets/dialog/dialog.service';
import { DialogMode } from 'src/app/widgets/dialog/dialogMode';
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
