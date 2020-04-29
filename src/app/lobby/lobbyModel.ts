import { PlayerService } from '../playerService';
import { Player } from './lobby_player';
import { Team } from './team';
import { AssertNotNull } from '@angular/compiler';

export class LobbyModel{

    private clientPlayer: Player;
    private players: Player[] = [];


    public addPlayer(player:Player){
        if(!this.existsPlayer(player)){
            console.log("Dodano");
            this.players.push(player);
        }
    }

    private existsPlayer(player:Player){
        // console.log(player.id + player.nickname);
        // let p =  this.players.find(p => p.id == player.id);
        // console.log("Znaleziono takie coś: " + p.id + p.nickname);
        // return p != null;
        console.log(player.id);
        return this.players.some(p=>p.id==player.id);
    }
    
    public removePlayer(player){
        this.players = this.players.filter(p => p !== player);
    }

    public getPlayerByNick(nick){
        return this.players.find(player=>player.nickname===nick);
    }

    public getPlayerById(id:number):Player{
        return this.players.find(player=>player.id === id);
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