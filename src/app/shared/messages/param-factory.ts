import { IllegalTypeException } from '../errors/illegal-type-exception';
import { BoolParam } from '../parameters/bool.param';
import { IdParam } from '../parameters/id.param';
import { NumberParam } from '../parameters/number.param';
import { StringParam } from '../parameters/string.param';

export class ParamFactory{

  public static create(value: any, gameId: string):string{
    let param;
    if(typeof(value)=='boolean'){
      param = new BoolParam(gameId, value as boolean);
    } else if(typeof(value)=="string"){
      param = new StringParam(gameId, value as string);
    } else if(typeof(value)=="number"){
      param = new NumberParam(gameId, value as number);
    } else if(value == null){
      param = new IdParam(gameId);
    }
    else {
      throw new IllegalTypeException(); // TODO: zmienić ten wyjątek
    }
    let json = JSON.stringify(param);
    return json;
  }
}
