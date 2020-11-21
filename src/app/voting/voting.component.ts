import { Component, OnInit, Injector } from '@angular/core';
import { VotingPlayer } from './voting_player';
import { Router } from '@angular/router';
import { PlayerService } from '../playerService';
import { VotingModel } from './votingModel';
import { VotingEventManager } from './messages/voting.event-manager';
import { View } from '../shared/view';
import { GameService } from '../gameService';
import { ConnectionService } from '../connection.service';
import { inject } from '@angular/core/testing';
import { DialogService } from '../dialog/dialog.service';

@Component({
  selector: 'app-boss',
  templateUrl: './voting.component.html',
  styleUrls: ['./voting.component.css']
})
export class BossComponent extends View implements OnInit {

  model: VotingModel;
  eventManager: VotingEventManager;

  constructor(private router: Router, private injector:Injector, private gameService: GameService, private playerService: PlayerService,
    private connectionService: ConnectionService, private dialog: DialogService) {
    super();
    this.model = new VotingModel(); // TODO: przerobić na serwis
    this.eventManager = new VotingEventManager(connectionService, gameService, this.model, router, dialog);
  }

  ngOnInit(): void {
    this.eventManager.init();
    this.eventManager.sendStartMessage();
    this.setOnLeave(this.onLeaveEvent);
  }

  private onLeaveEvent(){
    this.eventManager.unsubscribeAll();
    this.eventManager.closeDialog();
  }

  isSelected(player:VotingPlayer):boolean{
    for(let i =0; i < player.votes.length; i++){
      let id = player.votes[i];
      let votingPlayer = this.model.getPlayer(id);
      this.playerService.getNickname
      if(votingPlayer.id == this.playerService.getId()){
        return true;
      }
    }
    return false;
  }

  getNickname(){
    return this.playerService.getNickname();
  }

  continue(): void {

  }
}
