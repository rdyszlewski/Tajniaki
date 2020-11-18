import { Card } from '../models/card';
import { GameState } from '../models/game-state';

export class CardAdapter{

  public static createCards(cardsText: string[]):Card[]{
    let cards = [];
    cardsText.forEach((element) => {
      let card = this.createCard(element);
      cards.push(card);
    });
    cards = cards.sort((x1, x2) => x1.id - x2.id);
    return cards;
  }

  public static updateCatrds(cardsText: string[], state: GameState): void{
    let cards = this.createCards(cardsText);
    cards.forEach(card=>state.replaceCard(card.word, card));
  }

  private static createCard(data): Card{
    let id = data['id'];
        let word = data["word"];
        let color = data['color'];
        let checked = data['checked'];
        let card = new Card(id, word, color, checked);
        let answers = data['answers'];
        if(answers!=null){
            card.answers = answers;
        }
        let flags = data['flags'];
        if(flags !=null){
            card.flags = flags;
        }

        return card;
  }

}
