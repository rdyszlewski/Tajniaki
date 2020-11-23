import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SummaryModel} from './summaryModel';
import { ConnectionService } from '../connection.service';
import { WordColor } from '../game/models/word-color';
import { ViewComponent } from '../shared/view-component';
import { GameService } from '../gameService';
import { Team } from '../lobby/team';
import { SummaryEventManager } from './messages/summary.event-manager';
import { WinnerCause } from './winnerCause';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent extends ViewComponent implements OnInit {

  @Output() onNextStateEvent: EventEmitter<null> = new EventEmitter();

  team = Team;
  cause = WinnerCause;
  color = WordColor;
  model: SummaryModel = new SummaryModel();

  private eventManager;

  constructor(private gameService: GameService, private connectionService: ConnectionService) {
    super();
    this.eventManager = new SummaryEventManager(connectionService, gameService, this.model);
  }

  public init(){
    this.eventManager.init();
    this.eventManager.sendSummary();
   }

   public close(){
    this.eventManager.close();
   }

  ngOnInit(): void {

  }

  isBlue(entry){
    return entry.team == Team.BLUE;
  }

  isRed(entry){
    return entry.team == Team.RED;
  }

  backToMenu(){
    this.onNextStateEvent.emit();
  }

  getLoserRemainings(){
    return Math.max(this.model.blueRemaining, this.model.redRemaining);
  }

}
