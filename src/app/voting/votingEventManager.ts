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

export class VotingEventManager{

    private model:VotingModel;
    private router: Router;
    private injector: Injector;

    private dialog: DialogService;

    public init(model:VotingModel, router:Router, injector:Injector):void{
        this.model = model;
        this.router = router;
        this.dialog = injector.get(DialogService);
        // this.injector = injector;

        this.subscribeStart();
        this.subscribeEnd();
        this.subscribeVote();
        this.subscribeDisconnect();
        this.setOncloseEvent();
    }

    private subscribeStart(){
        ConnectionService.subscribe(ConnectionPath.START_VOTING_RESPONSE, message=>{
            this.updateList(message);
        });
    }

    private updateList(message){
        // TODO: na razie listy są zastępowane, a nie tylo aktualizowane. Później można to naprawić 
        let playersList = JSON.parse(message.body);
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
            console.log("Koniec głosowania");
            this.router.navigate(['game']);
          });
    }

    private subscribeVote(){
        ConnectionService.subscribe(ConnectionPath.VOTE_RESPONSE, message=>{
            console.log(message);
            let data = JSON.parse(message.body);
            data.forEach(element=>{
              let player = this.model.getPlayer(element['id']);
              player.votes = element['votes'];
            });
          });
    }

    private setOncloseEvent(){
        ConnectionService.setOnCloseEvent(()=>{
            alert("Nastąpiło rozłączenie z serwerem");
            this.unsubscribeAll();
            this.dialog.setMessage("Nastąpiło rozłączenie z serwerem").setMode(DialogMode.WARNING).setOnOkClick(()=>{
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
                this.dialog.setMessage("Zbyt mało graczy. Powrót do lobby").setMode(DialogMode.WARNING).setOnOkClick(()=>{
                    this.unsubscribeAll();
                    this.dialog.close();
                    this.router.navigate(['lobby']);
                }).open(DialogComponent);
            }
          });
    }

    public sendStartMessage(){
        ConnectionService.send("Siema", ConnectionPath.START_VOTING);
    }

    public sendVote(player:VotingPlayer){
        ConnectionService.send(player.id, ConnectionPath.VOTE);
    }

    public unsubscribeAll(){
        ConnectionService.unsubscribe(ConnectionPath.START_VOTING_RESPONSE);
        ConnectionService.unsubscribe(ConnectionPath.END_VOTING_RESPONSE);
        ConnectionService.unsubscribe(ConnectionPath.VOTE_RESPONSE);
        ConnectionService.unsubscribe(ConnectionPath.DISCONNECT_RESPONSE);
    }

}   