import { IdParam } from './id.param';

export class BoolParam extends IdParam{

  public readonly value: boolean;

  constructor(gameId: string, value: boolean){
    super(gameId);
    this.value = value;
  }
}
