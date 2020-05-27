import { Player } from 'src/app/lobby/lobby_player';
import { Team, TeamAdapter } from 'src/app/lobby/team';

export class PlayerAdapter{

    public static createPlayer(data){
        let id = data['id'];
        let nickname = data['nickname'];
        let team = TeamAdapter.getTeam(data['team']);
        let ready = data['ready'];
        return new Player(id, nickname, team, ready);
    }
}