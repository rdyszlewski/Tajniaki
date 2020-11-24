import {
  Component,
  OnInit,
} from '@angular/core';
import { VotingPlayer } from './voting_player';
import { PlayerService } from '../playerService';
import { VotingModel } from './votingModel';
import { VotingEventManager } from './messages/voting.event-manager';
import { ViewComponent } from '../shared/view-component';
import { GameService } from '../gameService';
import { ConnectionService } from '../connection.service';
import { DialogService } from '../dialog/dialog.service';

@Component({
  selector: 'app-voting',
  templateUrl: './voting.component.html',
  styleUrls: ['./voting.component.css'],
})
export class VotingComponent extends ViewComponent implements OnInit {
  model: VotingModel;
  eventManager: VotingEventManager;

  constructor(
    private gameService: GameService,
    private playerService: PlayerService,
    private connectionService: ConnectionService,
    private dialog: DialogService
  ) {
    super();
    this.model = new VotingModel(); // TODO: przerobić na serwis
    this.eventManager = new VotingEventManager(
      connectionService,
      gameService,
      this.model,
      dialog,
      this
    );
  }

  public init(): void {
    this.eventManager.init();
    this.eventManager.sendStartMessage();
  }

  public close() {
    this.model.clear();
    this.eventManager.close();
  }

  ngOnInit(): void {}

  isSelected(player: VotingPlayer): boolean {
    for (let i = 0; i < player.votes.length; i++) {
      let id = player.votes[i];
      let votingPlayer = this.model.getPlayer(id);
      this.playerService.getNickname;
      if (votingPlayer.id == this.playerService.getId()) {
        return true;
      }
    }
    return false;
  }

  getNickname() {
    return this.playerService.getNickname();
  }

  continue(): void {}
}
