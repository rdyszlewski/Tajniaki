import { Team } from "./team"


export class Player{
    public id: number;
    public nickname: string;
    public ready: boolean;
    public team: Team;

    constructor(id, nickname, team, ready){
        this.id = id;
        this.nickname = nickname;
        this.team = team;
        this.ready = ready;
    }
}