import { Component, OnInit } from '@angular/core';
import { Player } from './lobby_player';
import {Team} from './team';
import { ConnectionService } from '../connection.service';
import { PlayerService } from '../playerService';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit {
  // TODO: należy pozmieniać tak, żeby zmiana druzyny i gotowość obejmowała klienta
  players = [];

  private clientPlayer;

  constructor() { }

  ngOnInit(): void {
    // TODO: później to usunąć, ustawianie zrobić w menu
    PlayerService.setNickname("RoMan");
    this.connect();
  }

  private connect(){
    let that = this;
    ConnectionService.connect("localhost", 8080, function(){
      // TODO: pomyśleć, jak to powinno zostać prawidłowo zrobione
      ConnectionService.subscribe("/topic/lobby/players", (players)=>{
        console.log(players);
        that.setPlayers(players);
      });
      ConnectionService.send(PlayerService.getNickname(), "/app/lobby/connect");
    });
  }

  private setPlayers(message):void{
      var body = message.body;
      var json = JSON.parse(body);
      json.forEach(element => {
        // TODO: dodać informacje, czy gracz jest gotowy
        var player = new Player(element["nickName"], this.getTeam(element["team"]), false);
        this.players.push(player);
        console.log(element["nickName"]);
        if (this.isClientPlayer(player))
          this.clientPlayer = player;
      });
  }

  private isClientPlayer(player:Player):boolean{
    // TODO: zastanwoić się, co zrobić w sytuacji, w której więcej graczy ustawi sobie ten sam nick
    return player.nickname == PlayerService.getNickname();
  }

  // TODO: przenieść tę metodę w odpowiedniejsze miejsce
  private getTeam(teamText){
    switch(teamText){
      case "RED":
        return Team.RED;
      case "BLUE":
        return Team.BLUE;
      case "OBSERVER":
        return Team.OBSERVER;
    }
  }
  
  ready(){
    this.clientPlayer.ready = !this.clientPlayer.ready;
  }

  isBlue(player){
    return player.team==Team.BLUE;
  }

  isRed(player){
    return player.team == Team.RED;
  }

  isObserver(player){
    return player.team == Team.OBSERVER;
  }

  joinRedTeam(){
    this.clientPlayer.team = Team.RED;
  }

  joinBlueTeam(){
    this.clientPlayer.team = Team.BLUE;
  }

  countBlue(){
    return this.players.filter(x=>x.team == Team.BLUE).length;
  }

  countRed(){
    return this.players.filter(x=>x.team == Team.RED).length;
  }

  countObserver(){
    return this.players.filter(x=>x.team == Team.OBSERVER).length;

  }
}
