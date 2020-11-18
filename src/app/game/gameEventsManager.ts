import { TeamAdapter } from '../lobby/team';
import { ConnectionService } from '../connection.service';
import { GameState } from './models/gameState';
import { Role } from './role';
import { CardCreator, Card } from './models/card';
import { PlayerService } from '../playerService';
import { ConnectionPath } from '../shared/connectionPath';
import * as $ from 'jquery';
import { GamePlayer } from './models/gamePlayer';
import { Router } from '@angular/router';
import { PlayerAdapter } from '../shared/adapters/playerAdapter';
import { Injector } from '@angular/core';
import { DialogService } from '../dialog/dialog.service';
import { DialogMode } from '../dialog/dialogMode';
import { DialogComponent } from '../dialog/dialog.component';
import { GameService } from '../gameService';
import { IdParam } from '../shared/parameters/id.param';
import { NumberParam } from '../shared/parameters/number.param';
import { QuestionParam } from './parameters/question.param';

export class GameEventsManager{

    // TODO: przenieść wszystkie tworzneia obiektów do adapterów

    private model:GameState;
    private playerRole:Role;
    private router: Router;
    private dialog: DialogService;

  constructor(private gameService: GameService, private playerService: PlayerService){

  }

    public init( model:GameState, router:Router, injector: Injector){
        this.model = model;
        this.playerRole = this.playerService.getRole();
        this.router = router;
        this.dialog = injector.get(DialogService);

        this.subscribeEvents();
    }

    private subscribeEvents(){
        this.subscribeStartEvent();
        this.subscribeNewBossEvent();
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
            this.router.navigate(['summary']);
        });
    }

      private subscribeQuestionEvent() {
        ConnectionService.subscribe(ConnectionPath.QUESTION_RESPONSE, message => {
          this.updateStateAfterReceiveQuestion(message);
        });
      }

    private updateStateAfterReceiveQuestion(message: any) {
        let data = JSON.parse(message.body);
        this.updateGameState(data["gameState"]);
    }

      private subscribeClickEvent() {
        ConnectionService.subscribe(ConnectionPath.CLICK_RESPONSE, message => {
          this.updateStateAfterClick(message);
        });
      }

    private updateStateAfterClick(message: any) {
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
        let editedCards = data['cardsToUpdate'];
        let cards = this.createCards(editedCards);
        this.updateCards(cards);
        this.updateGameState(data["gameState"]);
        if(!data['active']){
          this.endGame();
        }
    }

      private subscribeStartEvent() {
        ConnectionService.subscribe(ConnectionPath.START_RESPONSE, message => {
          this.startGame(message);
        });
      }

      private subscribeNewBossEvent(){
        ConnectionService.subscribe(ConnectionPath.NEW_BOSS_RESPONSE, message=>{
          this.startGame(message);
          this.dialog.setMode(DialogMode.ALERT).setMessage("dialog.you_are_new_boss").setOnOkClick(()=>{
            this.dialog.close();
          }).open(DialogComponent);
        });
      }

    private startGame(message: any) {
        var data = JSON.parse(message.body);
        this.playerService.setNickname(data['nickname']);
        this.playerService.setRole(this.getRole(data["playerRole"]));
        this.playerService.setTeam(TeamAdapter.getTeam(data['playerTeam']));
        this.updateGameState(data["gameState"]);
        this.model.setCards(this.createCards(data["cards"]));
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
          player.team = TeamAdapter.getTeam(x['team']);
          playersResult.push(player);
        });
        return playersResult;
    }

    private updateGameState(data){
        this.model.currentTeam = TeamAdapter.getTeam(data["currentTeam"]);
        this.model.currentStage = this.getRole(data["currentRole"]);
        this.model.remainingBlue = data["remainingBlue"];
        this.model.remainingRed = data["remainingRed"];
        this.model.currentWord = data["currentWord"];
        this.model.remainingAnswers = data["remainingAnswers"];
    }


    private getRole(roleText){
        return roleText == "BOSS" ? Role.BOSS: Role.PLAYER;
    }

    private updateCards(cards){
        cards.forEach(card => {
          console.log("UpdateCards");
          console.log(card);
            this.model.replaceCard(card.word, card);
        });
    }

    private createCards(cardsTextList){
        let cards= []
        cardsTextList.forEach(element => {
            let card  = CardCreator.createCard(element);
            console.log(card);
            cards.push(card);
        });
        cards = cards.sort((x1,x2)=>x1.id-x2.id);
        return cards
    }

    private isPassCard(card:Card){
      return card.id == -1;
    }

    public sendFlag(cardId:number){
      let param = new NumberParam(this.gameService.getId(), cardId);
      let json = JSON.stringify(param)
        ConnectionService.send(json, ConnectionPath.FLAG);
    }

    public sendBossMessage(){
      // TODO: rozwiązać to bez jquery
      let word = $("#wordInput").val().toString();
      let number = $("#numberInput").val() as number;
      let param = new QuestionParam(this.gameService.getId(), word, number);
      let json = JSON.stringify(param);
      ConnectionService.send(json, ConnectionPath.QUESTION);
      // TODO: dodać resetowanie pól. Zrobić to za pomocą Angualra, nie jquery
    }

    public sendClick(cardId:number){
      let param = new NumberParam(this.gameService.getId(), cardId);
      let json = JSON.stringify(param);
      ConnectionService.send(json, ConnectionPath.CLICK);
    }

    public sendPass(){
      ConnectionService.send(-1, ConnectionPath.CLICK);
    }

    public sendStartMessage() {
      let param = new IdParam(this.gameService.getId());
      let json = JSON.stringify(param)
        ConnectionService.send(json, ConnectionPath.GAME_START);
    }

    private setOnCloseEvent(){
      ConnectionService.setOnCloseEvent(()=>{
        this.dialog.setMessage("dialog.disconnected").setMode(DialogMode.WARNING).setOnOkClick(()=>{
          this.exit('mainmenu');
        }).open(DialogComponent);
      });
    }

    private subscribeDisconnect(){
      ConnectionService.subscribe(ConnectionPath.DISCONNECT_RESPONSE, message=>{
        let data = JSON.parse(message.body);
        console.log(data);
        let player = PlayerAdapter.createPlayer(data['disconnectedPlayer']);
        console.log("Disconnected: " + player.nickname);
        this.model.removePlayer(player.id); // TODO: sprawdzić, czy usunięcie gracza działa

        if(data['currentStep'] == 'LOBBY'){
          this.dialog.setMessage("dialog.not_enough_players").setMode(DialogMode.WARNING).setOnOkClick(()=>{
            this.exit('lobby');
          }).open(DialogComponent);
        }

        let playersText = data['players'];
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
      ConnectionService.unsubscribe(ConnectionPath.NEW_BOSS_RESPONSE);
      ConnectionService.unsubscribe(ConnectionPath.DISCONNECT_RESPONSE);
      ConnectionService.setOnCloseEvent(null);
    }

    public closeDialog(){
      this.dialog.close();
    }
}
