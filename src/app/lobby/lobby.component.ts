import { Component, OnInit } from '@angular/core';
import { Player } from './lobby_player';
import {Team} from './team';
import { ConnectionService } from '../connection.service';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit {
  // TODO: należy pozmieniać tak, żeby zmiana druzyny i gotowość obejmowała klienta
  players = [];

  constructor() { }

  ngOnInit(): void {
    // TODO: metoda do testowania, należy później usunąć
    this.addPlayers();

  }

  private addPlayers(){
    let player1 = new Player("Robert", Team.BLUE, false);
    let player2 = new Player("Maciek", Team.OBSERVER, false);
    let player3 = new Player("Kaszanke", Team.BLUE, true);

    this.players.push(player1);
    this.players.push(player2);
    this.players.push(player3);
  }

  ready(){
    var player = this.players[0];
    player.ready = !player.ready;
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
    var player = this.players[0];
    player.team = Team.RED;
  }

  joinBlueTeam(){
    var player = this.players[0];
    player.team = Team.BLUE;
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
