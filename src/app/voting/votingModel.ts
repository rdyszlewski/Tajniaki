import { VotingPlayer } from './voting_player';

export class VotingModel{

    private players: VotingPlayer[] = [];

    public addPlayer(player:VotingPlayer):void{
        this.players.push(player);
    }

    public removePlayer(player:VotingPlayer):void{
        this.removePlayerById(player.id);
    }

    public removePlayerById(id:number):void{
        this.players = this.players.filter(x=>x.id != id);
    }

    public getPlayers():VotingPlayer[]{
        return this.players;
    }

    public getPlayer(id:number):VotingPlayer{
        return this.players.find(x=>x.id == id);
    }
}