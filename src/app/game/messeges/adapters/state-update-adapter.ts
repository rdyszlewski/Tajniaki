import { TeamAdapter } from 'src/app/shared/messages/team-adapter';
import { GameState } from '../../models/game-state';
import { Role } from '../../models/role';

export class StateUpdateAdapter{

  public static update(data: string, state: GameState){
    // let data = JSON.parse(dataText);
    state.currentTeam = TeamAdapter.getTeam(data['currentTeam']);
    state.currentStage = this.getRole(data['currentRole']);
    state.remainingBlue = data['remainingBlue'];
    state.remainingRed = data['remainingRed'];
    state.currentWord = data['currentWord'];
    state.remainingAnswers = data['remainingAnswers'];
  }

  private static getRole(roleText) {
    return roleText == 'BOSS' ? Role.BOSS : Role.PLAYER;
  }
}
