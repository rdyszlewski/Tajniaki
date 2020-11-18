import { Team } from 'src/app/lobby/team';

export class TeamAdapter{

  public static getTeam(teamText:string):Team{
      switch(teamText){
          case "RED":
            return Team.RED;
          case "BLUE":
            return Team.BLUE;
          case "LACK":
            return Team.LACK;
        }
  }
}
