import { RoleAdapter } from 'src/app/shared/messages/role-adapter';
import { GamePlayer } from 'src/app/game/models/game-player';
import { TeamAdapter } from './team-adapter';

export class PlayerAdapter{

  public static createPlayer(playerText: any): GamePlayer{
    let player = new GamePlayer();
    player.id = playerText['id'];
    player.nickname = playerText['nickname'];
    player.role = RoleAdapter.getRole(playerText['role']);
    player.team = TeamAdapter.getTeam(playerText['team']);
    return player
  }
}
