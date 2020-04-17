import { Component, OnInit } from '@angular/core';
import { ConnectionService } from '../connection.service';
import { WordCard } from './word_card';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  words: WordCard[]=[];

  constructor() { }

  ngOnInit(): void {
    var that = this;
    ConnectionService.subscribe("/user/queue/game/start", message=>{
      var data = JSON.parse(message.body);
      var words = data['words'];
      var role = data['role'];
      var colors = data['colors'];
      that.words = that.getWordCards(words, colors);
    })
    ConnectionService.send("START", "/app/game/start");
    // this.setupWords([])
  }

  private getWordCards(words:string[], colors:string[]){
    let cards = [];
    for(let i =0;  i < words.length; i++){
      let word = words[i];
      if(colors != null){
        var color = colors[i];
      } else {
        var color = "NEUTRAL";
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
