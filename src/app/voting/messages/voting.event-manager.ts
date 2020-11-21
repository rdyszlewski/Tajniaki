import { VotingModel } from '../votingModel';
import { ConnectionService } from '../../connection.service';
import { ConnectionPath } from '../../shared/connectionPath';
import { VotingPlayer } from '../voting_player';
import { Router } from '@angular/router';
import { Injector } from '@angular/core';
import { DialogService } from '../../dialog/dialog.service';
import { DialogMode } from '../../dialog/dialogMode';
import { DialogComponent } from '../../dialog/dialog.component';
import { GameService } from '../../gameService';
import { EventManager } from 'src/app/shared/messages/events-manager';
import { EndVotingEvent, StartTimerEvent, TimerEvent, VoteEvent, VotingDisconnectEvent } from './response-event';

export class VotingEventManager extends EventManager{

    constructor( connectionService: ConnectionService, gameService: GameService,
      private model:VotingModel, private router: Router, private dialog: DialogService){
      super(connectionService, gameService);
    }

    public init(){
      this.subscribe(ConnectionPath.START_VOTING_RESPONSE, new StartTimerEvent(this.model));
      this.subscribe(ConnectionPath.END_VOTING_RESPONSE, new EndVotingEvent(this.router));
      this.subscribe(ConnectionPath.VOTE_RESPONSE, new VoteEvent(this.model));
      this.subscribe(ConnectionPath.DISCONNECT_RESPONSE, new VotingDisconnectEvent(this.router, this.dialog, this.model, ()=>this.unsubscribeAll()));
      this.subscribe(ConnectionPath.VOTING_TIMER_RESPONSE, new TimerEvent(this.model));
      this.subscribeOnClose(()=>this.onCloseEvent());
    }

    private onCloseEvent(){
      this.unsubscribeAll();
      this.dialog.setMessage("dialog.disconnected").setMode(DialogMode.WARNING).setOnOkClick(()=>{
          this.dialog.close();
          this.router.navigate(['mainmenu']);
      }).open(DialogComponent);
    }

    public sendStartMessage(){
      this.sendWithId(ConnectionPath.START_VOTING);
    }

    public sendVote(player:VotingPlayer){
      this.sendWithValue(ConnectionPath.VOTE, player.id);
    }

    public closeDialog(){
        this.dialog.close();
    }

}
