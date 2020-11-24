import { DialogComponent } from 'src/app/dialog/dialog.component';
import { DialogService } from 'src/app/dialog/dialog.service';
import { DialogMode } from 'src/app/dialog/dialogMode';
import { IStateEvent } from 'src/app/shared/change-state';
import { PlayerAdapter } from 'src/app/shared/messages/player-adapter';
import { IResponseEvent } from 'src/app/shared/messages/response-event';
import { VotingModel } from '../votingModel';
import { VotingPlayer } from '../voting_player';

export class TimerEvent implements IResponseEvent {
  constructor(private model: VotingModel) {}

  public execute(data: any) {
    this.model.setTime(data["message"]);
  }
}

export class StartTimerEvent implements IResponseEvent {
  constructor(private model: VotingModel) {}

  public execute(data: any) {
    this.model.setTime(data['time']);
    this.updateList(data['players']);
  }

  private updateList(playersList) {
    playersList.forEach((element) => {
      let player = this.createVotingPlayer(element);
      this.model.addPlayer(player);
    });
  }

  private createVotingPlayer(element) {
    return new VotingPlayer(
      element['id'],
      element['nickname'],
      element['votes']
    );
  }
}

export class VotingDisconnectEvent implements IResponseEvent {
  constructor(
    private dialog: DialogService,
    private model: VotingModel,
    private stateEvent: IStateEvent
  ) {}

  public execute(data: any) {
    let player = PlayerAdapter.createPlayer(data['disconnectedPlayer']);
    this.model.removePlayerById(player.id);
    let currentStep = data['currentStep'];
    if (currentStep == 'LOBBY') {
      this.dialog
        .setMessage('dialog.not_enough_players')
        .setMode(DialogMode.WARNING)
        .setOnOkClick(() => {
          this.stateEvent.goToMain();
          this.dialog.close();
        })
        .open(DialogComponent);
    }
  }
}

export class VoteEvent implements IResponseEvent {
  constructor(private model: VotingModel) {}

  public execute(data: any) {
    data.forEach((element) => {
      let player = this.model.getPlayer(element['id']);
      player.votes = element['votes'];
    });
  }
}

export class EndVotingEvent implements IResponseEvent {
  constructor(private event: IStateEvent) {}

  public execute(data: any) {
    this.event.nextState();
  }
}
