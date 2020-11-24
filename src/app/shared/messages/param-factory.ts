import { IllegalTypeException } from '../errors/illegal-type-exception';
import { BoolParam } from '../parameters/bool.param';
import { IdParam } from '../parameters/id.param';
import { NumberParam } from '../parameters/number.param';
import { StringParam } from '../parameters/string.param';

export class ParamFactory{

  public static create(value: any, gameId: string):string{
    let param = this.getParam(value, gameId);
    let json = JSON.stringify(param);
    return json;
  }

  private static getParam(value: any, gameId: string):IdParam{
    if(value==null){
      return new IdParam(gameId);
    }
    switch(typeof(value)){
      case "boolean":
        return new BoolParam(gameId, value);
      case "string":
        return new StringParam(gameId, value);
      case "number":
        return new NumberParam(gameId, value);
      default:
        throw new IllegalTypeException();
    }
  }
}
