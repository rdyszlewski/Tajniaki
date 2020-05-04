import { Player } from 'src/app/lobby/lobby_player';
import { Team } from 'src/app/lobby/team';

export class PlayerAdapter{

    public static createPlayer(data){
        let id = data['id'];
        let nickname = data['nickname'];
        let team = this.getTeam(data['team']);
        let ready = data['ready'];
        return new Player(id, nickname, team, ready);
    }

    private static getTeam(teamText:string):Team{
        switch(teamText){
          case "RED":
            return Team.RED;
          case "BLUE":
            return Team.BLUE;
          case "OBSERVER":
            return Team.OBSERVER;
        }
    }
}