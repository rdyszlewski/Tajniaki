import { Team } from '../lobby/team';
import { ConnectionService } from '../connection.service';
import { GameState } from './models/gameState';
import { Role } from './role';
import { CardCreator } from './models/card';
import { PlayerService } from '../playerService';
import { ConnectionPath } from '../shared/connectionPath';
import { BossMessage } from './bossMessage';
import * as $ from 'jquery';
import { GamePlayer } from './models/gamePlayer';
import { Router } from '@angular/router';
import { PlayerAdapter } from '../shared/adapters/playerAdapter';
import { Injector } from '@angular/core';
import { DialogService } from '../dialog/dialog.service';
import { DialogMode } from '../dialog/dialogMode';
import { DialogComponent } from '../dialog/dialog.component';

export class GameEventsManager{

    // TODO: przenieść wszystkie tworzneia obiektów do adapterów
  
    private model:GameState;
    private playerRole:Role;
    private router: Router;
    private dialog: DialogService;

    public init( model:GameState, router:Router, injector: Injector){
        this.model = model;
        this.playerRole = PlayerService.getRole();
        this.router = router;
        this.dialog = injector.get(DialogService);
        
        this.subscribeEvents();
    }

    private subscribeEvents(){
        this.subscribeStartEvent();
        this.subscribeEndEvent();
        this.subscribeQuestionEvent();
        this.subscribeAnswerEvent();
        this.subscribeClickEvent();
        this.subscribeDisconnect();
        this.setOnCloseEvent();

        if(this.playerRole==Role.PLAYER){
            this.subscribeClickEvent();
        }
    }

    private subscribeEndEvent() {
        this.endGame();
      }
    
    private endGame() {
        ConnectionService.subscribe(ConnectionPath.END_GAME_RESPONSE, message => {
            console.log(message);
        });
    }

      private subscribeQuestionEvent() {
        ConnectionService.subscribe(ConnectionPath.QUESTION_RESPONSE, message => {
          this.updateStateAfterReceiveQuestion(message);
        });
      }
    
    private updateStateAfterReceiveQuestion(message: any) {
        console.log(message);
        let data = JSON.parse(message.body);
        this.updateGameState(data["gameState"]);
    }

      private subscribeClickEvent() {
        ConnectionService.subscribe(ConnectionPath.CLICK_RESPONSE, message => {
          this.updateStateAfterClick(message);
        });
      }
    
    private updateStateAfterClick(message: any) {
      console.log(message);
        var data = JSON.parse(message.body);
        let editedCards = data['editedCards'];
        let cards = this.createCards(editedCards);
        this.updateCards(cards);
    }

      private subscribeAnswerEvent() {
        ConnectionService.subscribe(ConnectionPath.ANSWER_RESPONSE, message => {
          this.updateStateAfterReceiveAnswer(message);
        });
      }
    
    private updateStateAfterReceiveAnswer(message: any) {
        var data = JSON.parse(message.body);
        let clientCard = CardCreator.createCard(data['card']);
        var correct = data["correct"]; // TODO: coś z tym zrobić
        this.model.replaceCard(clientCard.word, clientCard);
        this.updateGameState(data["gameState"]);
    }

      private subscribeStartEvent() {
        ConnectionService.subscribe(ConnectionPath.START_RESPONSE, message => {
          this.startGame(message);
        });
      }

    private startGame(message: any) {
        console.log(message.body);
        var data = JSON.parse(message.body);
        PlayerService.setNickname(data['nickname']);
        PlayerService.setRole(this.getRole(data["playerRole"]));
        PlayerService.setTeam(this.getTeam(data['playerTeam']));
        this.updateGameState(data["gameState"]);
        this.model.cards = this.createCards(data["cards"]);
        let playersList = this.getPlayersList(data['players']);
        playersList.forEach(x=>this.model.addPlayer(x));
    }

    private getPlayersList(playersList){
        let playersResult = [];
        playersList.forEach(x=>{
          let player = new GamePlayer();
          player.id = x['id'];
          player.nickname = x['nickname'];
          player.role = this.getRole(x['role']);
          player.team = this.getTeam(x['team']);
          playersResult.push(player);
        });
        console.log("Wynik tworzenia listy graczy");
        console.log(playersResult);
        return playersResult;
    }

    private updateGameState(data){
        this.model.currentTeam = this.getTeam(data["currentTeam"]);
        this.model.currentStage = this.getRole(data["currentStage"]);
        this.model.remainingBlue = data["remainingBlue"];
        this.model.remainingRed = data["remainingRed"];
        this.model.currentWord = data["currentWord"];
        this.model.remainingAnswers = data["remainingAnswers"];
    }

    // TODO: przenieśc to do innej metody
    private getTeam(teamText){
        return teamText == "BLUE" ? Team.BLUE :Team.RED;
    }

    private getRole(roleText){
        return roleText == "BOSS" ? Role.BOSS: Role.PLAYER;
    }

    // TODO: utworzyć 
    private updateCards(cards){
        cards.forEach(card => {
            this.model.replaceCard(card.word, card);
        });
    }

    private createCards(cardsTextList){
        let cards= []
        cardsTextList.forEach(element => {
            cards.push(CardCreator.createCard(element));
        });
        cards = cards.sort((x1,x2)=>x1.id-x2.id);
        return cards
    }

    public sendFlag(word){
        ConnectionService.send(word, ConnectionPath.FLAG);
    }

    public sendBossMessage(){
      let wordInput = $("#wordInput");
      let numberInput = $("#numberInput");
      let message = new BossMessage(wordInput.val() as string, numberInput.val() as number);
      ConnectionService.send(JSON.stringify(message),ConnectionPath.QUESTION);
      wordInput.val("");
      numberInput.val(1);
    }

    public sendClick(word:string){
        ConnectionService.send(word, ConnectionPath.CLICK);
    }

    public sendPass(){
      ConnectionService.send("--PASS--", ConnectionPath.CLICK);
    }

    public sendStartMessage() {
        ConnectionService.send("START", ConnectionPath.GAME_START);
    }

    private setOnCloseEvent(){
      ConnectionService.setOnCloseEvent(()=>{
        this.dialog.setMessage("Nastąpiło rozłączenie z serwerem").setMode(DialogMode.WARNING).setOnOkClick(()=>{
          this.exit('mainmenu');
        }).open(DialogComponent);
      });
    }

    private subscribeDisconnect(){
      ConnectionService.subscribe(ConnectionPath.DISCONNECT_RESPONSE, message=>{
        console.log("To się daje wykonuje");
        let data = JSON.parse(message.body);
        let player = PlayerAdapter.createPlayer(data['disconnectedPlayer']);
        let currentStep = data['currentStep'];
        let playersText = data['players'];
        this.model.removePlayer(player.id);
        if(currentStep == 'LOBBY'){
          this.dialog.setMessage("Za mało graczy. Powrót do lobby").setMode(DialogMode.WARNING).setOnOkClick(()=>{
            this.exit('lobby');
          }).open(DialogComponent);
        }

        if(playersText != null){
          // TODO: można wysłać informacje do nowego szefa
          let players = this.getPlayersList(playersText);
          this.model.removeAllPlayers();
          players.forEach(x=>this.model.addPlayer(x));

        }
      });
    }

    private exit(newLocation:string){
        this.unsubscribeAll();
        this.dialog.close();
        this.router.navigate([newLocation]);
    }

    public unsubscribeAll(){
      ConnectionService.unsubscribe(ConnectionPath.END_GAME_RESPONSE);
      ConnectionService.unsubscribe(ConnectionPath.QUESTION_RESPONSE);
      ConnectionService.unsubscribe(ConnectionPath.CLICK_RESPONSE);
      ConnectionService.unsubscribe(ConnectionPath.ANSWER_RESPONSE);
      ConnectionService.unsubscribe(ConnectionPath.START_RESPONSE);
      ConnectionService.unsubscribe(ConnectionPath.DISCONNECT_RESPONSE);
      ConnectionService.setOnCloseEvent(null);
    }
}