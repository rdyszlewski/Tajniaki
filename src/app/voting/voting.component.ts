import { Component, OnInit, Injector, HostListener } from '@angular/core';
import { VotingPlayer } from './voting_player';
import { Router } from '@angular/router';
import { PlayerService } from '../playerService';
import { VotingModel } from './votingModel';
import { VotingEventManager } from './votingEventManager';
import { DialogService } from '../dialog/dialog.service';
import { Player } from '../lobby/lobby_player';

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

  @HostListener('window:beforeunload', ['$event'])
  onBeforeunload(event){
    this.onLeave();
  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event) { // back button pressed
    this.onLeave();    
  }

  private onLeave(){
    this.eventManager.unsubscribeAll();
  }

  isSelected(player:VotingPlayer):boolean{
    // TODO: sprawdzić, czy to działa
    // TODO: zmienić to na id
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
}
