export class BoolParam{

  public readonly gameId: string;
  public readonly value: boolean;

  constructor(gameId: string, value: boolean){
    this.gameId = gameId;
    this.value = value;
  }
}
