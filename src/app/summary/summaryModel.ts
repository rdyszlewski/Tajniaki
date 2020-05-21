import { Team } from '../lobby/team';
import { WordColor } from '../game/models/word_color';
import { WinnerCause } from './winnerCause';

export class SummaryModel{
    public winner: Team;
    public cause:WinnerCause; // TODO: dorobić powód wygranej
    public blueRemaining: number;
    public redRemaining: number;
    public processEntries: SummaryEntry[];

}

export class SummaryEntry{
    public question: string;
    public number: number;
    public answers: SummaryWord[];
    public team: Team;
}

export class SummaryWord {
    public word: string;
    public color: WordColor;
}