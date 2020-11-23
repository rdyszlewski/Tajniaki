import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { ConnectionService } from '../connection.service';
import { GameComponent } from '../game/game.component';
import { LobbyComponent } from '../lobby/lobby.component';
import { MainMenuComponent } from '../main-menu/main-menu.component';
import { ChangeStateType, ViewComponent } from '../shared/view-component';
import { SummaryComponent } from '../summary/summary.component';
import { BossComponent } from '../voting/voting.component';
import { State } from './state';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  @ViewChild(MainMenuComponent)
  private mainMenuComponent: MainMenuComponent;

  @ViewChild(LobbyComponent)
  private lobbyComponent: LobbyComponent;

  @ViewChild(BossComponent)
  private votingComponent: BossComponent;

  @ViewChild(GameComponent)
  private gameComponent: GameComponent;

  @ViewChild(SummaryComponent)
  private summaryComponent: SummaryComponent;

  public state = State
  private _currentState: State = State.MAIN_MENU;

  constructor(private connectionService: ConnectionService) { }

  ngOnInit(): void {
    this.preventRightClickMenu();
  }

  private preventRightClickMenu() {
    document.addEventListener('contextmenu', event => event.preventDefault());
  }

  public isCurrentState(state: State){
    return this._currentState == state;
  }

  public onStateChange(type: ChangeStateType){
    switch(type){
      case ChangeStateType.NEXT_STATE:
        this.runNextState();
        break;
      case ChangeStateType.DISCONNECT:
        this.goToState(State.MAIN_MENU);
        break;
      case ChangeStateType.INTERRUPT_GAME:
        this.goToState(State.MAIN_MENU);
    }

  }

  private runNextState(){
     let nextState = this.getNextState(this._currentState);
     this.runState(nextState);
  }

  public goToState(state: State){
    this.runState(state);
  }

  private runState(state:State){
    // TODO: close current state
    let currentComponent = this.getComponent(this._currentState);
    currentComponent.close();
    let nextComponent = this.getComponent(state);
    nextComponent.init();
    this._currentState = state;
  }

  private getNextState(currentState: State):State{
    switch(currentState){
      case State.MAIN_MENU:
        return State.LOBBY;
      case State.LOBBY:
        return State.VOTING;
      case State.VOTING:
        return State.GAME;
      case State.GAME:
        return State.SUMMARY
      case State.SUMMARY:
        return State.MAIN_MENU;
    }
  }

  private getComponent(state: State): ViewComponent{
    switch(state){
      case State.MAIN_MENU:
        return this.mainMenuComponent;
      case State.LOBBY:
        return this.lobbyComponent;
      case State.VOTING:
        return this.votingComponent;
      case State.GAME:
        return this.gameComponent;
      case State.SUMMARY:
        return this.summaryComponent;
    }
  }

  @HostListener('window:beforeunload', ['$event'])
  onBeforeunload(event){
    if(this.connectionService.isConnected()){
      event.returnValue = "Czy na pewno wyjść?";
    } else {
      event.returnValue = false;
    }
  }

}
