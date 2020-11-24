import { Component, OnInit, Injector, HostListener } from '@angular/core';
import { ConnectionService } from '../connection.service';
import { Role } from './models/role';
import { PlayerService } from '../playerService';
import { GameState } from './models/game-state';
import { Card } from './models/card';
import { TooltipCreator } from './tooltip_creator';
import { GameEventsManager } from './messeges/game.events-manager';
import { Team } from '../lobby/team';
import { LobbyPlayer } from '../lobby/lobby_player';
import { GamePlayer } from './models/game-player';
import { ViewComponent } from '../shared/view-component';
import { GameService } from '../gameService';
import { SpymasterWord } from './models/spymaster-word';
import { DialogService } from '../dialog/dialog.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
})
export class GameComponent extends ViewComponent implements OnInit  {

  team = Team;
  role = Role;
  private _tooltip: TooltipCreator = new TooltipCreator();
  private _eventsManager: GameEventsManager;
  private _bluePlayers: LobbyPlayer[];
  private _redPlayers: LobbyPlayer[];
  private _spymasterWord: SpymasterWord = new SpymasterWord();

  public get state(){return this._state;}
  public get tooltip() {return this._tooltip;}
  public get eventsManager(){return this._eventsManager;}
  public get bluePlayers(){return this._bluePlayers;}
  public get redPlayers(){return this._redPlayers;}
  public get spymasterWord():SpymasterWord {return this._spymasterWord;}


  constructor(private gameService: GameService, private playerService: PlayerService,
    private _state: GameState, private connectionService: ConnectionService, dialog: DialogService) {
    super();
    this._eventsManager = new GameEventsManager(connectionService, gameService, playerService, this.state, dialog, this);
   }

   public init(): void{
    this._eventsManager.init();
    this._eventsManager.sendStartMessage();
   }

   public close(){
     this._eventsManager.close();
   }

  ngOnInit(): void {

  }

  isSpymaster(){
    return this.playerService.getRole()==Role.SPYMASTER;
  }

  isPlayerSpymaster(player:GamePlayer){
    return player.role == Role.SPYMASTER;
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
    return card.checked && this.playerService.getRole() == Role.SPYMASTER;
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
      return this._state.bluePlayers;
    } else if (this.playerService.getTeam()==Team.RED){
      return this._state.redPlayers;
    }
  }

  getSecondTeamPlayers(){
    if(this.playerService.getTeam() == Team.RED){
      return this._state.bluePlayers;
    } else if (this.playerService.getTeam()==Team.BLUE){
      return this._state.redPlayers;
    }
  }

  isPlayerAnswer(player:GamePlayer){
    let cards: Card[] = this._state.getCardsWithPassCard();
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
    return player.team == this._state.currentTeam && player.role == this._state.currentStage;
  }

  isPlayerTurn(){
    return this.playerService.getTeam() == this._state.currentTeam
      && this.playerService.getRole() == this._state.currentStage;
  }

  getRemainingWordsInPlayerTeam(){
    return this.playerService.getTeam() == Team.BLUE? this._state.remainingBlue : this._state.remainingRed;
  }

  getRemainingsCollection(number:number){
    let result = [];
    for(let i=0; i<number; i++){
      result.push(i);
    }
    return result;
  }

  getRemainings(team:Team){
    return team==Team.BLUE ? this._state.remainingBlue: this._state.remainingRed;
  }

  public sendSpymasterMessage(){
    let word = this.spymasterWord.word;
    let number = this.spymasterWord.number;
    this.eventsManager.sendSpymasterMessage(word, number);
    this.spymasterWord.word = "";
    this.spymasterWord.number = 1;
  }

}
