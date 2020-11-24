import { PlayerAdapter } from 'src/app/shared/messages/player-adapter';
import { GamePlayer } from '../../models/game-player';
import { GameState } from '../../models/game-state';

export class GamePlayerAdapter {
  public static addPlayers(playersText: any, state: GameState): void {
    let players = this.createPlayers(playersText);
    players.forEach((player) => state.addPlayer(player));
  }

  public static createPlayers(playersText: any): GamePlayer[] {
    let result = [];
    playersText.forEach((element) => {
      result.push(PlayerAdapter.createPlayer(element));
    });
    return result;
  }
}
