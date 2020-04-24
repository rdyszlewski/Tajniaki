import { Component, OnInit } from '@angular/core';
import { ConnectionService } from '../connection.service';
import { Team } from '../lobby/team';
import { Role } from './role';
import { PlayerService } from '../playerService';
import { BossMessage } from './bossMessage';
import { GameState } from './models/gameState';
import { CardCreator, Card } from './models/card';
import * as $ from 'jquery';
import { TooltipCreator } from './tooltip_creator';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  model: GameState = new GameState();
  tooltip: TooltipCreator = new TooltipCreator();
  constructor() { }

  ngOnInit(): void {
    this.subscribeStartEvent();
    this.subscribeAnswerEvent();
    this.subscriveClickEvent();
    this.subscribeQuestionEvent();
    this.subscribeEndEvent();
    this.sendStartMessage();

    this.preventRightClickMenu();
  }

  private preventRightClickMenu() {
    document.addEventListener('contextmenu', event => event.preventDefault());
  }

  private sendStartMessage() {
    ConnectionService.send("START", "/app/game/start");
  }

  private subscribeEndEvent() {
    ConnectionService.subscribe("/user/queue/game/end", message => {
      console.log(message);
    });
  }

  private subscribeQuestionEvent() {
    ConnectionService.subscribe("/user/queue/game/question", message => {
      let data = JSON.parse(message.body);
      this.setGameState(data["gameState"]);
    });
  }

  private subscriveClickEvent() {
    ConnectionService.subscribe("/user/queue/game/click", message => {
      console.log(message);
      var data = JSON.parse(message.body);
      let editedCards = data['editedCards'];
      let cards = this.createCards(editedCards);
      this.updateCards(cards);
    });
  }

  private subscribeAnswerEvent() {
    ConnectionService.subscribe("/user/queue/game/answer", message => {
      var data = JSON.parse(message.body);
      let clientCard = CardCreator.createCard(data['card']);
      var correct = data["correct"]; // TODO: coś z tym zrobić
      this.model.replaceCard(clientCard.word, clientCard);
      this.setGameState(data["gameState"]);
    });
  }

  private subscribeStartEvent() {
    ConnectionService.subscribe("/user/queue/game/start", message => {
      var data = JSON.parse(message.body);
      PlayerService.setNickname(data['nickname']);
      PlayerService.setRole(this.getRole(data["playerRole"]));
      PlayerService.setTeam(this.getTeam(data['playerTeam']));
      this.setGameState(data["gameState"]);
      this.model.cards = this.createCards(data["cards"]);
    });
  }

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

  private setGameState(data){
    this.model.currentTeam = this.getTeam(data["currentTeam"]);
    this.model.currentStage = this.getRole(data["currentStage"]);
    this.model.remainingBlue = data["remainingBlue"];
    this.model.remainingRed = data["remainingRed"];
    this.model.currentWord = data["currentWord"];
    this.model.remainingAnswers = data["remainingAnswers"];
  }

  // TODO: przenieść to do innej metody
  private getTeam(teamText){
    return teamText == "BLUE" ? Team.BLUE :Team.RED;
  }

  private getRole(roleText){
    return roleText == "BOSS" ? Role.BOSS: Role.PLAYER;
  }

  click(word:string){
    ConnectionService.send(word, "/app/game/click");
  }

  // TODO: wymyślić fajniejszą nazwę
  sendBossMessage(){
    let wordInput = $("#wordInput");
    let numberInput = $("#numberInput");
    let message = new BossMessage(wordInput.val() as string, numberInput.val() as number);
    ConnectionService.send(JSON.stringify(message),"/app/game/question");
    wordInput.val("");
    numberInput.val(1);
  }

  // TODO: prawdopodobnie należy to przenieść w inne miejsce
  private getColor(wordColor){
    switch(wordColor){
      case "RED":
        return "red";
      case "BLUE":
        return "blue";
      case "KILLER":
        return "grey";
      case "NEUTRAL":
        return "yellow";
      default:
        return "yellow";
    }
  }

  setFlag(word){
    console.log(word);
    ConnectionService.send(word, '/app/game/flag');
  }

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
}
