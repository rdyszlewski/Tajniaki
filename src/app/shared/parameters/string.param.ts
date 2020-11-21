import { IdParam } from './id.param';

export class StringParam extends IdParam{

  public value: string;

  constructor(gameId:string, value:string){
    super(gameId);
    this.value = value;
  }
}
