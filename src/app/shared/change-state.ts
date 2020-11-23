import { State } from '../main/state';

export interface IStateEvent{
  nextState();
  disconnect();
  goToMain();
  goToState(state: State);
}
