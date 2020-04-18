import { Component, OnInit } from '@angular/core';
import { ConnectionService } from '../connection.service';
import { WordCard } from './word_card';
import { Team } from '../lobby/team';
import { Role } from './role';
import { PlayerService } from '../playerService';
import { BossMessage } from './bossMessage';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  words: WordCard[]=[];
  remainingAnswers = 0;
  currentTeam: Team;
  currentPlayer: Role;
  remainingBlue = 0;
  remainingRed = 0;
  currentWord:string;
  constructor() { }

  ngOnInit(): void {
    var that = this;
    ConnectionService.subscribe("/user/queue/game/start", message=>{
      var data = JSON.parse(message.body);
      var words = data['words'];
      var colors = data['colors'];
      
      that.words = that.getWordCards(words, colors);
      PlayerService.setRole(this.getRole(data["playerRole"]));
      that.currentTeam = this.getTeam(data["firstTeam"]);
      that.currentPlayer = Role.BOSS;
    });
    ConnectionService.subscribe("/user/queue/game/answer", message=>{
      var data = JSON.parse(message.body);
      var word = data["word"];
      var color = data["correctColor"];
      var correct = data["correct"];
      var remainingAnswers = data["remainingAnswers"];
      var currentTeam = data['currentTeam'];
      var currentRole = data['currentRole'];
      that.remainingAnswers = remainingAnswers;
      let card = that.getCard(word);
      card.color = color;
      that.currentTeam = that.getTeam(currentTeam);
      that.currentPlayer = that.getRole(currentRole);
    });
    ConnectionService.subscribe("/user/queue/game/question", message=>{
      console.log(message);
      let data = JSON.parse(message.body);
      that.currentWord = data['word'];
      that.remainingAnswers = data['number'];
    });
    ConnectionService.send("START", "/app/game/start");
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
    for(let i=0; i<this.words.length; i++){
      if(this.words[i].word==word){
        return this.words[i];
      }
    }
  }

  private getWordCards(words:string[], colors:string[]){
    let cards = [];
    for(let i =0;  i < words.length; i++){
      let word = words[i];
      if(colors != null){
        var color = colors[i];
      } else {
        var color = "LACK";
      }
      var card = new WordCard(word, color);
      cards.push(card);
    }
    return cards;
  }

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

  private setupWords(wordsList){
    // TODO: dokończyć
    // this.words = ["jeden", "dwa", "trzy", "cztery", "pięć", "sześć", "siedem", "osiem", "dziewięć"]
  }

}
