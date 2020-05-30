import { Component, OnInit, Injector, HostListener } from '@angular/core';
import { VotingPlayer } from './voting_player';
import { Router } from '@angular/router';
import { PlayerService } from '../playerService';
import { VotingModel } from './votingModel';
import { VotingEventManager } from './votingEventManager';
import { View } from '../shared/view';

@Component({
  selector: 'app-boss',
  templateUrl: './voting.component.html',
  styleUrls: ['./voting.component.css']
})
export class BossComponent extends View implements OnInit {

  model: VotingModel;
  eventManager: VotingEventManager;


  constructor(private router: Router, private injector:Injector) {
    super();
    this.model = new VotingModel();
    this.eventManager = new VotingEventManager();
  }

  ngOnInit(): void {
    this.eventManager.init(this.model, this.router, this.injector);
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
      PlayerService.getNickname
      if(votingPlayer.id == PlayerService.getId()){
        return true;
      }
    }
    return false;
  }

  getNickname(){
    return PlayerService.getNickname();
  }

  continue(): void {
    //TODO:przejście do gry po kliknięciu przycisku
  }
}
