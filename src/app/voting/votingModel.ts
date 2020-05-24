import { VotingPlayer } from './voting_player';

export class VotingModel{

    private votingTime: number; // sec 
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

    public setTime(time:number){
        this.votingTime = time;
    }

    public getTimeFormat():string{
        const minutes = Math.floor(this.votingTime / 60);
        const seconds = this.votingTime - (minutes * 60);
        const zeroPad = (num, places) => String(num).padStart(places, '0')
        return zeroPad(minutes, 2) + ":" + zeroPad(seconds, 2);
    }
    
}