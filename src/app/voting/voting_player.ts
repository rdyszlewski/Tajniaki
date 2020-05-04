
export class VotingPlayer{

    public id:number;
    public nickname:string;
    public votes:number[];

    constructor(id:number, nickname:string, votes:number[]){
        this.id = id;
        this.nickname = nickname;
        this.votes = votes;
    }
}