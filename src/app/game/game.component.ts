import { Component, OnInit } from '@angular/core';
import { ConnectionService } from '../connection.service';
import { Team } from '../lobby/team';
import { Role } from './role';
import { PlayerService } from '../playerService';
import { BossMessage } from './bossMessage';
import { GameState } from './models/gameState';
import { typeWithParameters } from '@angular/compiler/src/render3/util';
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
    var that = this;
    ConnectionService.subscribe("/user/queue/game/start", message=>{
      var data = JSON.parse(message.body);
      PlayerService.setRole(this.getRole(data["playerRole"]));
      that.setGameState(data["gameState"]);
      that.model.cards = that.createCards(data["cards"]);  
    });
    ConnectionService.subscribe("/user/queue/game/answer", message=>{
      var data = JSON.parse(message.body);
      var correct = data["correct"]; // TODO: można coś z tym zrobić
      let card = that.getCard(data["word"]);
      card.color = data["correctColor"];
      card.checked = true;
      that.setGameState(data["gameState"]);
    });
    ConnectionService.subscribe("/user/queue/game/click", message=>{
      console.log(message);
      var data = JSON.parse(message.body);
      let editedCards = data['editedCards'];
      let cards = this.createCards(editedCards);
      this.updateCards(cards);
      // TODO: przetestować to
    });
    ConnectionService.subscribe("/user/queue/game/question", message=>{
      let data = JSON.parse(message.body);
      that.setGameState(data["gameState"]);
    });
    ConnectionService.send("START", "/app/game/start");
  }

  private updateCards(cards){
    cards.forEach(card => {
      console.log(card);
      this.model.replaceCard(card.word, card);
    });
  }

  private createCards(cardsTextList){
    let cards= []
    cardsTextList.forEach(element => {
      cards.push(CardCreator.createCard(element));
    });
    cards.sort((x1,x2)=>x1.id-x2.id);
    return cards
  }

  private setGameState(dataJson){
    console.log("Ustawianie stanu gry");
    this.model.currentTeam = this.getTeam(dataJson["currentTeam"]);
    this.model.currentStage = this.getRole(dataJson["currentStage"]);
    this.model.remainingBlue = dataJson["remainingBlue"];
    this.model.remainingRed = dataJson["remainingRed"];
    this.model.currentWord = dataJson["currentWord"];
    this.model.remainingAnswers = dataJson["remainingAnswers"];
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
    let message =new BossMessage("Hasło", 3);
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

}
