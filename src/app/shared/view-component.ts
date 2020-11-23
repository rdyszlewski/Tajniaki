import { EventEmitter, HostListener, Output } from '@angular/core';
import { ConnectionService } from '../connection.service';
import { State } from '../main/state';
import { IStateEvent } from './change-state';

export enum ChangeStateType{
  NEXT_STATE,
  DISCONNECT,
  INTERRUPT_GAME
}

export abstract class ViewComponent implements IStateEvent{


  @Output() onStateChangeEvent: EventEmitter<ChangeStateType> = new EventEmitter();
  @Output() goToStateEvent: EventEmitter<State> = new EventEmitter();

  public abstract init();
  public abstract close();

  @HostListener('window:popstate', ['$event'])
  onPopState(event) { // back button pressed
    this.close();

  }

  @HostListener('window:unload')
  onUnload(){
    this.close();
  }

  public nextState() {
    this.closeView(ChangeStateType.NEXT_STATE);
  }

  public disconnect() {
    this.closeView(ChangeStateType.DISCONNECT);
  }

  public goToMain() {
    this.closeView(ChangeStateType.INTERRUPT_GAME);
  }

  public goToState(state: State) {
    this.goToStateEvent.emit(state);
  }

  private closeView(closeType: ChangeStateType){
    // if(this.onLeave != null){
    //   this.onLeave();
    // }
    this.onStateChangeEvent.emit(closeType);
  }

}
