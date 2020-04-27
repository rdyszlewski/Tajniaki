import { Component, OnInit } from '@angular/core';
import { ConnectionService } from '../connection.service';
import { Role } from './role';
import { PlayerService } from '../playerService';
import { GameState } from './models/gameState';
import { Card } from './models/card';
import { TooltipCreator } from './tooltip_creator';
import { GameEventsManager } from './gameEventsManager';
import { ConnectionPath } from '../shared/connectionPath';
import { Team } from '../lobby/team';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  team = Team;
  role = Role;
  model: GameState = new GameState();
  tooltip: TooltipCreator = new TooltipCreator();
  eventsManager: GameEventsManager = new GameEventsManager();
  constructor() { }

  ngOnInit(): void {
    this.preventRightClickMenu();
    this.eventsManager.init(this.model);
    this.sendStartMessage();
    
  }

  private preventRightClickMenu() {
    document.addEventListener('contextmenu', event => event.preventDefault());
  }

  private sendStartMessage() {
    ConnectionService.send("START", ConnectionPath.GAME_START);
  }

  // TODO: przenieść to do oddzielnej klasy


  // TODO: wymyślić fajniejszą nazwę


  isBoss(){
    return PlayerService.getRole()==Role.BOSS;
  }

  getClientTeam(){
    // TODO: dodać jakieś informacje
    console.log(PlayerService.getTeam());
    return PlayerService.getTeam();
  }

  getClientRole(){
    return PlayerService.getRole();
  }

  preventWhispace(event)
  {
    if (event.keyCode === 32){
      console.log("Naciśnięto spację");
      event.preventDefault();
    }
  }

  isAnswerByClient(card:Card){
    return card.answers.includes(PlayerService.getNickname());
  }

  isFlagByClient(card: Card){
    return card.flags.includes(PlayerService.getNickname())
  }

  isWordHidden(card: Card){
    return card.checked && PlayerService.getRole() == Role.BOSS;
  }

  getNickname(){
    return PlayerService.getNickname();
  }
}
