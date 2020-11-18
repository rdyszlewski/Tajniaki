import { Team } from '../lobby/team';
import { WordColor as CardColor } from '../game/models/word_color';
import { WinnerCause } from './winnerCause';

export class SummaryModel{
    public winner: Team;
    public cause:WinnerCause;
    public blueRemaining: number;
    public redRemaining: number;
    public processEntries: SummaryEntry[];
    public cards: SummaryCard[];

}

export class SummaryEntry{
    public question: string;
    public number: number;
    public answers: SummaryWord[];
    public team: Team;
}

export class SummaryWord {
    public word: string;
    public color: CardColor;
}

export class SummaryCard {
    public id: number;
    public word: string;
    public color: CardColor;
    public team: Team;
    public question: string;
}
