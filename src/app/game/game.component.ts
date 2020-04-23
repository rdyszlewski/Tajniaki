import { Component, OnInit } from '@angular/core';
import { ConnectionService } from '../connection.service';
import { Team } from '../lobby/team';
import { Role } from './role';
import { PlayerService } from '../playerService';
import { BossMessage } from './bossMessage';
import { GameState } from './models/gameState';
import { Card, CardCreator } from './models/card';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  model: GameState = new GameState();
  constructor() { }

  ngOnInit(): void {
    // var that = this;
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
    let wordInput = document.getElementById("wordInput") as HTMLInputElement;
    let numberInput = document.getElementById("numberInput") as HTMLInputElement;
    // TODO: dodać sprawdzenie poprawności
    let message =new BossMessage(wordInput.value, Number(numberInput.value));
    ConnectionService.send(JSON.stringify(message),"/app/game/question");
  }

  private getCard(word:string){
    for(let i=0; i<this.model.cards.length; i++){
      if(this.model.cards[i].word==word){
        return this.model.cards[i];
      }
    }
  }

  // TODO: do wywalenia 
  private getWordCards(words:string[], colors:string[]){
    let cards = [];
    for(let i =0;  i < words.length; i++){
      let word = words[i];
      if(colors != null){
        var color = colors[i];
      } else {
        var color = "LACK";
      }
      var card = new Card(i, word, color, false);
      cards.push(card);
    }
    return cards;
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

  private colorWords(words, colors){
    for(let i =0; i < words.lenght; i++){
      let word = words[i];
      let color = colors[i];
      let element = document.getElementById(word);
      console.log(element);
      element.setAttribute("class", "red");
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

  preventSpace()
{
  // TODO: napisć to trochę lepiej
    var str=document.getElementById("wordInput") as HTMLInputElement;
    var regex=/[^a-z]/gi;
    str.value=str.value.replace(regex ,"");
}
}
