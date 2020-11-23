import { ConnectionService } from 'src/app/connection.service';
import { DialogService } from 'src/app/dialog/dialog.service';
import { GameService } from 'src/app/gameService';
import { State } from 'src/app/main/state';
import { ParamFactory } from './param-factory';
import { IResponseEvent } from './response-event';

export type StateCallback= (state: State)=>void;

export abstract class EventManager{

  private _subscribtions: Map<string, IResponseEvent> = new Map();

  constructor(protected connectionService: ConnectionService, protected gameService: GameService){
  }

  public abstract init();

  protected subscribe(path: string,event:IResponseEvent): void{
    this.connectionService.subscribe(path, message=>{
      console.log(message);
      if(message){
        let data = JSON.parse(message.body);
        event.execute(data);
      } else {
        event.execute(null);
      }
    });

    this._subscribtions.set(path, event);
  }

  protected subscribeOnClose(event: ()=>void){
    this.connectionService.setOnCloseEvent(event);
  }

  public unsubscribeAll(){
      this._subscribtions.forEach((key, value)=> this.connectionService.unsubscribe(key));
      this.connectionService.setOnCloseEvent(null);
  }


  // TODO: sprawdzić, czy są jakieś inne sposoby wysyłania informacji
  protected sendWithValue(path: string, value: any){
   let json = ParamFactory.create(value, this.gameService.getId());
   this.sendMessage(path, json);
  }

  protected sendMessage(path: string, message: any){
    this.connectionService.send(message, path);
  }

  protected sendWithId(path: string){
    let json = ParamFactory.create(null, this.gameService.getId());
    this.sendMessage(path, json);
  }

  protected getIdParam(value: any):string{
    return ParamFactory.create(value, this.gameService.getId());
  }

  public close(){
    this.unsubscribeAll();
  }
}
