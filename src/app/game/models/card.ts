import { WordColor } from './word_color';

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

export class CardCreator{

    public static createCard(data):Card{
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