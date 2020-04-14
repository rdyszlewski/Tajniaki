import { Team } from "./team"


export class Player{
    public nickname: string;
    public ready: boolean;
    public team: Team;

    constructor(nickname, team, ready){
        this.nickname = nickname;
        this.team = team;
        this.ready = ready;
    }
}