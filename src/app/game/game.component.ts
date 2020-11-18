import { Component, OnInit, Injector, HostListener } from '@angular/core';
import { ConnectionService } from '../connection.service';
import { Role } from './role';
import { PlayerService } from '../playerService';
import { GameState } from './models/gameState';
import { Card } from './models/card';
import { TooltipCreator } from './tooltip_creator';
import { GameEventsManager } from './gameEventsManager';
import { Team } from '../lobby/team';
import { Player } from '../lobby/lobby_player';
import { GamePlayer } from './models/gamePlayer';
import { Router } from '@angular/router';
import { View } from '../shared/view';
import { GameService } from '../gameService';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
})
export class GameComponent extends View implements OnInit  {

  team = Team;
  role = Role;
  private _model: GameState = new GameState();
  private _tooltip: TooltipCreator = new TooltipCreator();
  private _eventsManager: GameEventsManager;
  private _bluePlayers: Player[];
  private _redPlayers: Player[];

  public get model(){return this._model;}
  public get tooltip() {return this._tooltip;}
  public get eventsManager(){return this.eventsManager;}
  public get bluePlayers(){return this._bluePlayers;}
  public get redPlayers(){return this._redPlayers;}

  constructor(private router:Router, private injector: Injector, private gameService: GameService, private playerService: PlayerService) {
    super();
    this._eventsManager = new GameEventsManager(gameService, playerService);
   }

  ngOnInit(): void {
    this.preventRightClickMenu();
    this._eventsManager.init(this._model, this.router, this.injector);
    this._eventsManager.sendStartMessage();
    this.setOnLeave(this.onLeaveEvent);
  }

  @HostListener('window:beforeunload', ['$event'])
  onBeforeunload(event){
    // sprawdzamy, czy połączenie jest aktywne. Nie chcemy, aby komunikat wyskakiwał w przypadku rozłączenia z siecią
    if(ConnectionService.isConnected()){
      // TODO: sprawdzić, czy to się rzeczywiście wyświetla. Jesli tak, wstawić tutaj lokalizacje
      event.returnValue = "Czy na pewno wyjść?";
    } else {
      event.returnValue = false;
    }
  }

  private onLeaveEvent(){
    this._eventsManager.unsubscribeAll();
    this._eventsManager.closeDialog();
  }

  private preventRightClickMenu() {
    document.addEventListener('contextmenu', event => event.preventDefault());
  }

  isBoss(){
    return this.playerService.getRole()==Role.BOSS;
  }

  isPlayerBoss(player:GamePlayer){
    return player.role == Role.BOSS;
  }

  getClientTeam(){
    return this.playerService.getTeam();
  }

  getOppositeTeam(team:Team){
    return team==Team.BLUE? Team.RED : Team.BLUE;
  }

  getClientRole(){
    return this.playerService.getRole();
  }

  preventWhispace(event)
  {
    if (event.keyCode === 32){
      event.preventDefault();
    }
  }

  isAnswerByClient(card:Card){
    return card.answers.includes(this.playerService.getId());
  }

  isFlagByClient(card: Card){
    return card.flags.includes(this.playerService.getId());
  }

  isWordHidden(card: Card){
    return card.checked && this.playerService.getRole() == Role.BOSS;
  }

  getNickname(){
    return this.playerService.getNickname();
  }

  getRole(){
    return this.playerService.getRole();
  }

  getTeam(){
    return this.playerService.getTeam();
  }

  getFirstTeamPlayers(){
    if(this.playerService.getTeam() == Team.BLUE){
      return this._model.bluePlayers;
    } else if (this.playerService.getTeam()==Team.RED){
      return this._model.redPlayers;
    }
  }

  getSecondTeamPlayers(){
    if(this.playerService.getTeam() == Team.RED){
      return this._model.bluePlayers;
    } else if (this.playerService.getTeam()==Team.BLUE){
      return this._model.redPlayers;
    }
  }

  isPlayerAnswer(player:GamePlayer){
    let cards: Card[] = this._model.getCardsWithPassCard();
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
    return player.team == this._model.currentTeam && player.role == this._model.currentStage;
  }

  isPlayerTurn(){
    return this.playerService.getTeam() == this._model.currentTeam
      && this.playerService.getRole() == this._model.currentStage;
  }

  getRemainingWordsInPlayerTeam(){
    return this.playerService.getTeam() == Team.BLUE? this._model.remainingBlue : this._model.remainingRed;
  }

  getRemainingsCollection(number:number){
    let result = [];
    for(let i=0; i<number; i++){
      result.push(i);
    }
    return result;
  }

  getRemainings(team:Team){
    return team==Team.BLUE ? this._model.remainingBlue: this._model.remainingRed;
  }

}
