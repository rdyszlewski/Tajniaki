import { Component, OnInit } from '@angular/core';
import { SummaryModel, SummaryEntry, SummaryWord, SummaryCard } from './summaryModel';
import { Team, TeamAdapter } from '../lobby/team';
import { ConnectionService } from '../connection.service';
import { ConnectionPath } from '../shared/connectionPath';
import { WordColor } from '../game/models/word_color';
import { CauseGetter, WinnerCause } from './winnerCause';
import { Router } from '@angular/router';
import { View } from '../shared/view';
import { AppService, GameStep } from '../shared/appService';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent extends View implements OnInit {

  team = Team;
  cause = WinnerCause;
  color = WordColor;
  model: SummaryModel = new SummaryModel();

  constructor(private router: Router) {
    super();
   }

  ngOnInit(): void {
    AppService.setCurrentStep(GameStep.SUMMARY);
    ConnectionService.subscribe(ConnectionPath.SUMMARY_RESPONSE, message=>{
      let data = JSON.parse(message.body);
      this.model.winner = TeamAdapter.getTeam(data['winner']);
      this.model.blueRemaining = data['blueRemaining'];
      this.model.redRemaining = data['redRemaining'];
      this.model.cause = CauseGetter.get(data['cause']);
      this.model.processEntries = this.getProcess(data['process']);
      this.model.cards = this.getCards(data['cards']);
    });

    ConnectionService.send("SUMMARY", ConnectionPath.SUMMARY);
  }

  private getProcess(summary){
    let entries: SummaryEntry[] = [];
    summary.forEach(element => {
      let entry = new SummaryEntry();
      entry.question = element['question'];
      entry.number = element['number'];
      entry.team = TeamAdapter.getTeam(element['team']);
      entry.answers = [];
      element['answers'].forEach(x=>{
        let answer = new SummaryWord();
        answer.word = x['word'];
        answer.color = this.getColor(x['color']);
        entry.answers.push(answer);
      });
      entries.push(entry);
    });
    return entries;
  }

  private getCards(summary){
    console.log(summary);
    let cards: SummaryCard[] = [];
    summary.forEach(element=>{
      let card = new SummaryCard();
      card.id = element['id'];
      card.word = element['word'];
      card.color = this.getColor(element['color']);
      card.team = TeamAdapter.getTeam(element['team']);
      console.log(card.team);

      card.question = element['question'];
      cards.push(card);
    })
    return cards;
  }

  private getColor(colorText:string):WordColor{
    switch(colorText){
      case "BLUE":
        return WordColor.BLUE;
      case "RED":
        return WordColor.RED;
      case "NEUTRAL":
        return WordColor.NEUTRAL;
      case "KILLER":
        return WordColor.KILLER;
    }
  }


  isBlue(entry){
    return entry.team == Team.BLUE;
  }

  isRed(entry){
    return entry.team == Team.RED;
  }

  backToMenu(){
    this.router.navigate(['lobby']);
  }

  getLoserRemainings(){
    return Math.max(this.model.blueRemaining, this.model.redRemaining);
  }

}
