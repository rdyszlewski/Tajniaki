import { WordColor } from 'src/app/game/models/word-color';
import { IResponseEvent } from 'src/app/shared/messages/response-event';
import { TeamAdapter } from 'src/app/shared/messages/team-adapter';
import {
  SummaryCard,
  SummaryEntry,
  SummaryModel,
  SummaryWord,
} from '../summaryModel';
import { CauseGetter } from '../winnerCause';

export class SummaryEvent implements IResponseEvent {
  constructor(private model: SummaryModel) {}

  public execute(data: any) {
    this.model.winner = TeamAdapter.getTeam(data['winner']);
    this.model.blueRemaining = data['blueRemaining'];
    this.model.redRemaining = data['redRemaining'];
    this.model.cause = CauseGetter.get(data['cause']);
    this.model.processEntries = this.getProcess(data['process']);
    this.model.cards = this.getCards(data['cards']);
  }

  private getProcess(summary) {
    let entries: SummaryEntry[] = [];
    summary.forEach((element) => {
      let entry = new SummaryEntry();
      entry.question = element['question'];
      entry.number = element['number'];
      entry.team = TeamAdapter.getTeam(element['team']);
      entry.answers = [];
      element['answers'].forEach((x) => {
        let answer = new SummaryWord();
        answer.word = x['word'];
        answer.color = this.getColor(x['color']);
        entry.answers.push(answer);
      });
      entries.push(entry);
    });
    return entries;
  }

  private getCards(summary) {
    console.log(summary);
    let cards: SummaryCard[] = [];
    summary.forEach((element) => {
      let card = new SummaryCard();
      card.id = element['id'];
      card.word = element['word'];
      card.color = this.getColor(element['color']);
      card.team = TeamAdapter.getTeam(element['team']);
      console.log(card.team);

      card.question = element['question'];
      cards.push(card);
    });
    return cards;
  }

  private getColor(colorText: string): WordColor {
    switch (colorText) {
      case 'BLUE':
        return WordColor.BLUE;
      case 'RED':
        return WordColor.RED;
      case 'NEUTRAL':
        return WordColor.NEUTRAL;
      case 'KILLER':
        return WordColor.KILLER;
    }
  }
}
