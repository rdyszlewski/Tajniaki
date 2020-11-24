import { Injectable } from '@angular/core';
import { Team } from '../../lobby/team';
import { Role } from './role';
import { Card } from './card';
import { GamePlayer } from './game-player';

@Injectable({
  providedIn: 'root',
})
export class GameState {
  // contains word cards and pass card
  private cards: Card[] = [];
  public currentTeam: Team;
  public currentStage: Role;
  public remainingBlue: number;
  public remainingRed: number;
  public currentWord: string;
  public remainingAnswers: number;

  public bluePlayers: GamePlayer[] = [];
  public redPlayers: GamePlayer[] = [];

  public getCard(word: string): Card {
    let index = this.getCardId(word);
    if (index != null) {
      return this.cards[index];
    }
  }

  public getCards(): Card[] {
    return this.cards.filter((card) => card.id >= 0);
  }

  public getCardsWithPassCard() {
    return this.cards;
  }

  public getPassCard(): Card {
    return this.cards.filter((card) => card.id == -1)[0];
  }

  public setCards(cards: Card[]) {
    this.cards = cards;
  }

  private getCardId(word: string): number {
    for (let i = 0; i < this.cards.length; i++) {
      if (this.cards[i].word == word) {
        return i;
      }
    }
  }

  public replaceCard(word: string, card: Card) {
    let index = this.getCardId(word);
    if (index != null) {
      this.cards[index] = card;
    }
  }

  public addPlayer(player: GamePlayer) {
    if (player.team == Team.RED) {
      if (!this.redPlayers.find((x) => x.id == player.id)) {
        this.redPlayers.push(player);
      }
    } else if (player.team == Team.BLUE) {
      if (!this.bluePlayers.find((x) => x.id == player.id)) {
        this.bluePlayers.push(player);
      }
    }
  }

  public removePlayer(id: number) {
    this.bluePlayers = this.bluePlayers.filter((x) => x.id != id);
    this.redPlayers = this.redPlayers.filter((x) => x.id != id);
  }

  public removeAllPlayers() {
    this.bluePlayers = [];
    this.redPlayers = [];
  }
}
