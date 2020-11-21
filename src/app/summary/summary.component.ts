import { Component, OnInit } from '@angular/core';
import { SummaryModel, SummaryEntry, SummaryWord, SummaryCard } from './summaryModel';
import { ConnectionService } from '../connection.service';
import { ConnectionPath } from '../shared/connectionPath';
import { WordColor } from '../game/models/word-color';
import { CauseGetter, WinnerCause } from './winnerCause';
import { Router } from '@angular/router';
import { View } from '../shared/view';
import { IdParam } from '../shared/parameters/id.param';
import { GameService } from '../gameService';
import { Team } from '../lobby/team';
import { TeamAdapter } from '../shared/messages/team-adapter';
import { SummaryEventManager } from './messages/summary.event-manager';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent extends View implements OnInit {

  team = Team;
  cause = WinnerCause;
  color = WordColor;
  model: SummaryModel = new SummaryModel();

  private eventManager;

  constructor(private router: Router, private gameService: GameService, private connectionService: ConnectionService) {
    super();
    this.eventManager = new SummaryEventManager(connectionService, gameService, this.model);
    this.eventManager.init();
   }

  ngOnInit(): void {
    this.eventManager.sendSummary();

  }

  isBlue(entry){
    return entry.team == Team.BLUE;
  }

  isRed(entry){
    return entry.team == Team.RED;
  }

  backToMenu(){
    this.router.navigate(['lobby']);
  }

  getLoserRemainings(){
    return Math.max(this.model.blueRemaining, this.model.redRemaining);
  }

}
