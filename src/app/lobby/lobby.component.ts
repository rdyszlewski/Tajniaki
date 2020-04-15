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
  nick;

  players = [];

  private clientPlayer;

  constructor() { }

  ngOnInit(): void {
    // TODO: później to usunąć, ustawianie zrobić w menu
    this.connect();
  }

  private connect(){
    // TODO: zrobić tutaj porządek
    let that = this;
    ConnectionService.connect("localhost", 8080, function(){
      // TODO: pomyśleć, jak to powinno zostać prawidłowo zrobione
      ConnectionService.subscribe("/user/lobby/players", (players)=>{
        console.log(players);
        that.setPlayers(players);
      });
      // ConnectionService.subscribe("/user/lobby/team", message=>{
      //   console.log("zmiana drużyny");
      //   that.clientPlayer.team = that.getTeam(message.body);
      // });
      ConnectionService.subscribe("/user/queue/connect", message => {
        // TODO: wyświetlić informacje o podłączeniu gracza
        console.log("Gracz " + message.body + " się podłączył");
        var newPlayer = new Player(message.body, Team.OBSERVER, false);
        that.players.push(newPlayer);
      });
      ConnectionService.subscribe("/topic/lobby/team", message => {
          console.log(message);
          var json = JSON.parse(message.body);
          let nickname = json['nickname'];
          let team = that.getTeam(json['team']);
          console.log(that.players);
          var player = that.getPlayerByNick(nickname);
          player.team = team;

      });
      ConnectionService.send(PlayerService.getNickname(), "/app/lobby/connect");
    });
  }

  private setPlayers(message):void{
      var body = message.body;
      var json = JSON.parse(body);
      json.forEach(element => {
        // TODO: dodać informacje, czy gracz jest gotowy
        var player = new Player(element["nickName"], this.getTeam(element["team"]), element["ready"]);
        this.players.push(player);
        if (this.isClientPlayer(player))
          console.log("ja gracz " + player.nickname);
          this.clientPlayer = player;
      });
  }

  private isClientPlayer(player:Player):boolean{
    // TODO: zastanwoić się, co zrobić w sytuacji, w której więcej graczy ustawi sobie ten sam nick
    return player.nickname == PlayerService.getNickname();
  }

  // TODO: przenieść tę metodę w odpowiedniejsze miejsce
  private getTeam(teamText:string):Team{
    console.log("getTeam");
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
    ConnectionService.send(Team.RED, "/app/lobby/team");
  }

  joinBlueTeam(){
    ConnectionService.send(Team.BLUE, "/app/lobby/team");
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

  private getPlayerByNick(nick:string):Player{
    console.log(this.players);
    console.log(nick);
    for(let i=0; i<this.players.length; i++){
      var player = this.players[i];
      if(player.nickname==nick){
        console.log("Znaleziono " + player);
        return player;
      }
    }
    // var filteredPlayers = this.players.filter(x=> x.nickName == nick);
    // return filteredPlayers[0];
  }
  
}
