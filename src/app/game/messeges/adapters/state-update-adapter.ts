import { RoleAdapter } from 'src/app/shared/messages/role-adapter';
import { TeamAdapter } from 'src/app/shared/messages/team-adapter';
import { GameState } from '../../models/game-state';

export class StateUpdateAdapter {
  public static update(data: string, state: GameState) {
    state.currentTeam = TeamAdapter.getTeam(data['currentTeam']);
    state.currentStage = RoleAdapter.getRole(data['currentRole']);
    state.remainingBlue = data['remainingBlue'];
    state.remainingRed = data['remainingRed'];
    state.currentWord = data['currentWord'];
    state.remainingAnswers = data['remainingAnswers'];
  }
}
