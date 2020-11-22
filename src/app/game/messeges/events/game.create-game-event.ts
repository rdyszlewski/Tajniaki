import { PlayerService } from 'src/app/playerService';
import { RoleAdapter } from 'src/app/shared/messages/role-adapter';
import { TeamAdapter } from 'src/app/shared/messages/team-adapter';
import { GameState } from '../../models/game-state';
import { CardAdapter } from '../adapters/cards-adapter';
import { GamePlayerAdapter } from '../adapters/player-adapter';
import { StateUpdateAdapter } from '../adapters/state-update-adapter';

export class CreateGameEvent {
  constructor(private playerService: PlayerService, private state: GameState) {}

  protected createGame(data: any) {
    this.playerService.setNickname(data['nickname']);
    this.playerService.setRole(RoleAdapter.getRole(data['playerRole']));
    this.playerService.setTeam(TeamAdapter.getTeam(data['playerTeam']));
    StateUpdateAdapter.update(data['gameState'], this.state);
    this.state.setCards(CardAdapter.createCards(data['cards']));
    GamePlayerAdapter.addPlayers(data['players'], this.state);
  }
}
