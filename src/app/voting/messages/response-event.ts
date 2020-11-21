import { Router } from '@angular/router';
import { DialogComponent } from 'src/app/dialog/dialog.component';
import { DialogService } from 'src/app/dialog/dialog.service';
import { DialogMode } from 'src/app/dialog/dialogMode';
import { PlayerAdapter } from 'src/app/shared/messages/player-adapter';
import { IResponseEvent } from 'src/app/shared/messages/response-event';
import { VotingModel } from '../votingModel';
import { VotingPlayer } from '../voting_player';

export class TimerEvent implements IResponseEvent {
  constructor(private model: VotingModel) {}

  public execute(data: any) {
    this.model.setTime(data["message"]); // TODO: sprawdzić, czy to będzie tak
  }
}

export class StartTimerEvent implements IResponseEvent {
  constructor(private model: VotingModel) {}

  public execute(data: any) {
    // TODO: chyba powinno być tak
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
    private router: Router,
    private dialog: DialogService,
    private model: VotingModel,
    private unsuscribeMethod: () => void
  ) {}

  public execute(data: any) {
    // let data = JSON.parse(message.body);
    let player = PlayerAdapter.createPlayer(data['disconnectedPlayer']);
    this.model.removePlayerById(player.id);
    let currentStep = data['currentStep'];
    if (currentStep == 'LOBBY') {
      this.dialog
        .setMessage('dialog.not_enough_players')
        .setMode(DialogMode.WARNING)
        .setOnOkClick(() => {
          this.unsuscribeMethod();
          this.dialog.close();
          this.router.navigate(['mainmenu']);
        })
        .open(DialogComponent);
    }
  }
}

export class VoteEvent implements IResponseEvent {
  constructor(private model: VotingModel) {}

  public execute(data: any) {
    // let data = JSON.parse(message.body);
    data.forEach((element) => {
      let player = this.model.getPlayer(element['id']);
      player.votes = element['votes'];
    });
  }
}

export class EndVotingEvent implements IResponseEvent {
  constructor(private router: Router) {}

  public execute(data: any) {
    this.router.navigate(['game']);
  }
}
