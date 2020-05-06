import { Component, OnInit, Injector } from '@angular/core';
import { VotingPlayer } from './voting_player';
import { Router } from '@angular/router';
import { PlayerService } from '../playerService';
import { VotingModel } from './votingModel';
import { VotingEventManager } from './votingEventManager';
import { DialogService } from '../dialog/dialog.service';

@Component({
  selector: 'app-boss',
  templateUrl: './voting.component.html',
  styleUrls: ['./voting.component.css']
})
export class BossComponent implements OnInit {

  model: VotingModel;
  eventManager: VotingEventManager;


  constructor(private router: Router, private injector:Injector) { 
    this.model = new VotingModel();
    this.eventManager = new VotingEventManager();
  }

  ngOnInit(): void {
    this.eventManager.init(this.model, this.router, this.injector);
    this.eventManager.sendStartMessage();
  }

  isSelected(player:VotingPlayer):boolean{
    // TODO: sprawdzić, czy to działa
    // TODO: zmienić to na id
    for(let i =0; i < player.votes.length; i++){
      let id = player.votes[i];
      let votingPlayer = this.model.getPlayer(id);
      if(votingPlayer.nickname===PlayerService.getNickname()){
        return true;
      }
    }
    return false;
  }
}
