import { TeamAdapter } from 'src/app/shared/messages/team-adapter';
import { LobbyModel } from '../lobby.model';
import { LobbyPlayer } from '../lobby_player';

export class LobbyPlayerAdapter{

  public static addPlayers(data: any[], model: LobbyModel){
    data.forEach((playerElement) => {
      LobbyPlayerAdapter.addPlayer(playerElement, model);
      var player = LobbyPlayerAdapter.create(playerElement);
      model.addPlayer(player);
    });
  }

  public static create(playerText: any): LobbyPlayer{
    console.log(playerText);
    let id = playerText['id'];
    let nickname = playerText['nickname'];
    let team = TeamAdapter.getTeam(playerText['team']);
    let ready = playerText['ready'];
    let player = new LobbyPlayer(id,nickname, team, ready);

    return player
  }

  public static addPlayer(playerData: any, model: LobbyModel){
    let player = this.create(playerData);
    model.addPlayer(player);
  }

  public static setPlayerReady(data: any, model: LobbyModel){
    let player = model.getPlayerById(data['playerId']);
    player.ready = data['ready'];
  }

}
