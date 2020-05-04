import { VotingModel } from './votingModel';
import { ConnectionService } from '../connection.service';
import { ConnectionPath } from '../shared/connectionPath';
import { VotingPlayer } from './voting_player';
import { Router } from '@angular/router';
import { PlayerAdapter } from '../shared/adapters/playerAdapter';

export class VotingEventManager{

    private model:VotingModel;
    private router: Router;

    public init(model:VotingModel, router:Router):void{
        this.model = model;
        this.router = router;

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
            this.router.navigate(['mainmenu']);
          });
    }

    private subscribeDisconnect(){
        ConnectionService.subscribe(ConnectionPath.DISCONNECT_RESPONSE, message=>{
            let data = JSON.parse(message.body);
            let player = PlayerAdapter.createPlayer(data);
            this.model.removePlayerById(player.id);
          });
    }

    public sendStartMessage(){
        ConnectionService.send("Siema", ConnectionPath.START_VOTING);
    }

    public sendVote(player:VotingPlayer){
        ConnectionService.send(player.id, ConnectionPath.VOTE);
    }


}   