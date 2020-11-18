import { WordColor } from './word-color';

export class Card{
    id:number;
    word:string;
    color:WordColor;
    checked: boolean;
    answers: number[];
    flags: number[];

    constructor(id, word, color, checked){
        this.id = id;
        this.word = word;
        this.color = color;
        this.checked = checked;
        this.answers = [];
        this.flags = [];
    }
}
