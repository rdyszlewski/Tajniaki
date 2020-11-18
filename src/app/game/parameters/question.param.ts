/**
 * Class used to send message to server with word and number choosen by boss player
 */
export class QuestionParam{

  public gameId: string;
  public question: string;
  public number: number;

  constructor(gameId: string, question: string, number:number){
    this.gameId = gameId;
    this.question = question;
    this.number = number;
  }
}
