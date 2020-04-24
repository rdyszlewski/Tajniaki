import { PlayerService } from '../playerService';
import { Player } from './lobby_player';
import { Team } from './team';
import { AssertNotNull } from '@angular/compiler';

export class LobbyModel{

    private clientPlayer: Player;
    private players: Player[] = [];


    public addPlayer(player){
        this.players.push(player);
    }
    
    public removePlayer(player){
        this.players = this.players.filter(p => p !== player);
    }

    public getPlayerByNick(nick){
        this.players.forEach(x=>{
            if(x.nickname==nick){
                x;
            }
        })
        return null;
    }

    public getPlayers(team:Team):Player[]{
        return this.players.filter(x=>x.team == team);
    }

    public setClientPlayer(player){
        this.clientPlayer = player;
    }

    public getClientPlayer(){
        return this.clientPlayer;
    }
}