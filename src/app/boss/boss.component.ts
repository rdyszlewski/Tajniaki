import { Component, OnInit } from '@angular/core';
import { ConnectionService } from '../connection.service';
import { VotingPlayer } from './voting_player';
import { Router } from '@angular/router';

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
      ConnectionService.subscribe("/user/boss/start", message=>{
          that.updateList(message);
      });
      ConnectionService.subscribe("/user/boss/end",  message=>{
        console.log("Koniec głosowania");
        this.router.navigate(['game']);
      })
      ConnectionService.send("Siema", "/app/boss/start");
  }

  private updateList(message){
    // TODO: na razie listy są zastępowane, a nie tylo aktualizowane. Później można to naprawić
    this.players = [];
    let playersList = JSON.parse(message.body);
      playersList.forEach(element => {
        let player = new VotingPlayer(element["id"], element["nickname"], element["votes"]);
      console.log(player);
      this.players.push(player);
    });
  }

  vote(player:VotingPlayer):void {
    ConnectionService.send(player.id, "/app/boss/vote");
  }

}
