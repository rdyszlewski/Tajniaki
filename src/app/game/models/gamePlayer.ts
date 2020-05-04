import { Team } from 'src/app/lobby/team';
import { Role } from '../role';

export class GamePlayer{

    public id: number;
    public nickname: string;
    public team: Team;
    public role: Role;

    
}