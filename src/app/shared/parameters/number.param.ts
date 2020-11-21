import { IdParam } from './id.param';

export class NumberParam extends IdParam{

  public value: number;

  constructor(gameId: string, value: number){
    super(gameId);
    this.value = value;
  }
}
