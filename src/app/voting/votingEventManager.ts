import { VotingModel } from './votingModel';
import { ConnectionService } from '../connection.service';
import { ConnectionPath } from '../shared/connectionPath';
import { VotingPlayer } from './voting_player';
import { Router } from '@angular/router';
import { PlayerAdapter } from '../shared/adapters/playerAdapter';
import { Injector } from '@angular/core';
import { DialogService } from '../dialog/dialog.service';
import { DialogMode } from '../dialog/dialogMode';
import { DialogComponent } from '../dialog/dialog.component';
import { GameService } from '../gameService';
import { IdParam } from '../shared/parameters/id.param';
import { NumberParam } from '../shared/parameters/number.param';

export class VotingEventManager{

    private model:VotingModel;
    private router: Router;

    private dialog: DialogService;

    constructor(private gameService: GameService){

    }

    public init(model:VotingModel, router:Router, injector:Injector):void{
        this.model = model;
        this.router = router;
        this.dialog = injector.get(DialogService);

        this.subscribeStart();
        this.subscribeEnd();
        this.subscribeVote();
        this.subscribeDisconnect();
        this.setOncloseEvent();
        this.subscribeTimer();
    }

    private subscribeTimer(){
        ConnectionService.subscribe(ConnectionPath.VOTING_TIMER_RESPONSE, message=>{
            this.model.setTime(message.body);
        });
    }

    private subscribeStart(){
        ConnectionService.subscribe(ConnectionPath.START_VOTING_RESPONSE, message=>{
            let data = JSON.parse(message.body);
            this.model.setTime(data['time']);
            this.updateList(data['players']);
        });
    }

    private updateList(playersList){
        // TODO: na razie listy są zastępowane, a nie tylo aktualizowane. Później można to naprawić
        playersList.forEach(element => {
        let player = this.createVotingPlayer(element);
        this.model.addPlayer(player);
        });
    }

    private createVotingPlayer(element){
        return new VotingPlayer(element["id"], element["nickname"], element["votes"]);
    }

    private subscribeEnd(){
        ConnectionService.subscribe(ConnectionPath.END_VOTING_RESPONSE,  message=>{
            this.router.navigate(['game']);
          });
    }

    private subscribeVote(){
        ConnectionService.subscribe(ConnectionPath.VOTE_RESPONSE, message=>{
            let data = JSON.parse(message.body);
            data.forEach(element=>{
              let player = this.model.getPlayer(element['id']);
              player.votes = element['votes'];
            });
          });
    }

    private setOncloseEvent(){
        ConnectionService.setOnCloseEvent(()=>{
            this.unsubscribeAll();
            this.dialog.setMessage("dialog.disconnected").setMode(DialogMode.WARNING).setOnOkClick(()=>{
                this.dialog.close();
                this.router.navigate(['mainmenu']);
            }).open(DialogComponent);
          });
    }

    private subscribeDisconnect(){
        ConnectionService.subscribe(ConnectionPath.DISCONNECT_RESPONSE, message=>{
            let data = JSON.parse(message.body);
            let player = PlayerAdapter.createPlayer(data['disconnectedPlayer']);
            this.model.removePlayerById(player.id);
            let currentStep = data['currentStep'];
            if(currentStep == "LOBBY"){
                this.dialog.setMessage("dialog.not_enough_players").setMode(DialogMode.WARNING).setOnOkClick(()=>{
                    this.unsubscribeAll();
                    this.dialog.close();
                    this.router.navigate(['lobby']);
                }).open(DialogComponent);
            }
          });
    }

    public sendStartMessage(){
        let param = new IdParam(this.gameService.getId());
        let json = JSON.stringify(param);
        ConnectionService.send(json, ConnectionPath.START_VOTING);
    }

    public sendVote(player:VotingPlayer){
      let param = new NumberParam(this.gameService.getId(), player.id);
      let json = JSON.stringify(param);
        ConnectionService.send(json, ConnectionPath.VOTE);
    }

    public unsubscribeAll(){
        ConnectionService.unsubscribe(ConnectionPath.START_VOTING_RESPONSE);
        ConnectionService.unsubscribe(ConnectionPath.END_VOTING_RESPONSE);
        ConnectionService.unsubscribe(ConnectionPath.VOTE_RESPONSE);
        ConnectionService.unsubscribe(ConnectionPath.DISCONNECT_RESPONSE);
        ConnectionService.unsubscribe(ConnectionPath.VOTING_TIMER_RESPONSE);
    }

    public closeDialog(){
        this.dialog.close();
    }

}
