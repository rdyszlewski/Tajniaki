import { Component, OnInit } from '@angular/core';
import { ConnectionService } from '../connection.service';
import { VotingPlayer } from './voting_player';
import { Router } from '@angular/router';
import { ConnectionPath } from '../shared/connectionPath';
import { PlayerService } from '../playerService';

@Component({
  selector: 'app-boss',
  templateUrl: './boss.component.html',
  styleUrls: ['./boss.component.css']
})
export class BossComponent implements OnInit {

  players: VotingPlayer[] = [];

  constructor(private router: Router) { }

  ngOnInit(): void {
      var that = this;
      ConnectionService.subscribe(ConnectionPath.START_VOTING_RESPONSE, message=>{
          this.players = [];
          that.updateList(message);
      });
      ConnectionService.subscribe(ConnectionPath.END_VOTING_RESPONSE,  message=>{
        console.log("Koniec głosowania");
        this.router.navigate(['game']);
      });
      ConnectionService.subscribe(ConnectionPath.VOTE_RESPONSE, message=>{
        console.log(message);
        let data = JSON.parse(message.body);
        console.log(this.players);
        data.forEach(element=>{
          let id = element['id'];
          console.log(id);
          let player = this.players.find(x=>x.id === id);
          player.votes = element['votes'];
        });
      });
      
      ConnectionService.send("Siema", ConnectionPath.START_VOTING);
  }

  private updateList(message){
    // TODO: na razie listy są zastępowane, a nie tylo aktualizowane. Później można to naprawić
    
    let playersList = JSON.parse(message.body);
      playersList.forEach(element => {
        let player = new VotingPlayer(element["id"], element["nickname"], element["votes"]);
      this.players.push(player);
    });
  }

  vote(player:VotingPlayer):void {
    ConnectionService.send(player.id, ConnectionPath.VOTE);
  }

  isSelected(player:VotingPlayer):boolean{
    // TODO: zmienić to na id
    for(let i =0; i < player.votes.length; i++){
      let id = player.votes[i];
      let votingPlayer = this.players.find(x=>x.id===id);
      if(votingPlayer.nickname===PlayerService.getNickname()){
        return true;
      }
    }
    return false;

  }
}
