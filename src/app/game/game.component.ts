import { Component, OnInit, Injector, HostListener } from '@angular/core';
import { ConnectionService } from '../connection.service';
import { Role } from './role';
import { PlayerService } from '../playerService';
import { GameState } from './models/gameState';
import { Card } from './models/card';
import { TooltipCreator } from './tooltip_creator';
import { GameEventsManager } from './gameEventsManager';
import { ConnectionPath } from '../shared/connectionPath';
import { Team } from '../lobby/team';
import { Player } from '../lobby/lobby_player';
import { GamePlayer } from './models/gamePlayer';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
})
export class GameComponent implements OnInit {

  team = Team;
  role = Role;
  model: GameState = new GameState();
  tooltip: TooltipCreator = new TooltipCreator();
  eventsManager: GameEventsManager = new GameEventsManager();
  bluePlayers: Player[];
  redPlayers: Player[];
  constructor(private router:Router, private injector: Injector) { }

  ngOnInit(): void {
    this.preventRightClickMenu();
    this.eventsManager.init(this.model, this.router, this.injector);
    this.sendStartMessage();
    
  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event) { // back button pressed
    this.onLeave();    
  }

  @HostListener('window:beforeunload', ['$event'])
  onBeforeunload(event){
    // sprawdzamy, czy połączenie jest aktywne. Nie chcemy, aby komunikat wyskakiwał w przypadku rozłączenia z siecią
    if(ConnectionService.isConnected()){
      event.returnValue = "Czy na pewno wyjść?";
    }
  }

  @HostListener('window:unload')
  onUnload(){
    console.log("Usuwanie subskrybcji");
    this.onLeave();
  }

  private onLeave(){
    this.eventsManager.unsubscribeAll();
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

  isPlayerBoss(player:GamePlayer){
    return player.role == Role.BOSS;
  }

  getClientTeam(){
    return PlayerService.getTeam();
  }

  getClientRole(){
    return PlayerService.getRole();
  }

  preventWhispace(event)
  {
    if (event.keyCode === 32){
      event.preventDefault();
    }
  }

  isAnswerByClient(card:Card){
    return card.answers.includes(PlayerService.getId());
  }

  isFlagByClient(card: Card){
    return card.flags.includes(PlayerService.getId());
  }

  isWordHidden(card: Card){
    return card.checked && PlayerService.getRole() == Role.BOSS;
  }

  getNickname(){
    return PlayerService.getNickname();
  }

  getFirstTeamPlayers(){
    if(PlayerService.getTeam() == Team.BLUE){
      return this.model.bluePlayers;
    } else if (PlayerService.getTeam()==Team.RED){
      return this.model.redPlayers;
    }
  }

  getSecondTeamPlayers(){
    if(PlayerService.getTeam() == Team.RED){
      return this.model.bluePlayers;
    } else if (PlayerService.getTeam()==Team.BLUE){
      return this.model.redPlayers;
    }
  }

  isPlayerAnswer(player:GamePlayer){
    let cards: Card[] = this.model.getCardsWithPassCard();
    for(let i=0; i< cards.length; i++){
      let card = cards[i];
      for(let j=0; j< card.answers.length; j++){
        let answer = card.answers[j];
        if(answer == player.id){
          return true;
        }
      }
    }
    return false;
  }

  isCurrentPlayer(player:GamePlayer){
    return player.team == this.model.currentTeam && player.role == this.model.currentStage;
  }

  isPlayerTurn(){
    return PlayerService.getTeam() == this.model.currentTeam && PlayerService.getRole() == this.model.currentStage;
  }

}
