import { LobbyPlayer } from './lobby_player';
import { Team } from './team';
import { PlayerService } from '../playerService';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LobbyModel{

    private minPlayersInTeam: number;
    private maxPlayerInTeam: number;
    private players: LobbyPlayer[] = [];

    constructor(private playerService: PlayerService){

    }

    public clear(){
      this.players = [];
    }

    public getMinPlayersInTeam(){
        return this.minPlayersInTeam;
    }

    public setMinPlayersInTeam(number: number){
        this.minPlayersInTeam = number;
    }

    public getMaxPlayersInTeam(){
        return this.maxPlayerInTeam;
    }

    public setMaxPlayersInTeam(number: number){
        this.maxPlayerInTeam = number;
    }

    public addPlayer(player:LobbyPlayer){
        if(!this.existsPlayer(player)){
            this.players.push(player);
        }
    }

    private existsPlayer(player:LobbyPlayer){
        return this.players.some(p=>p.id==player.id);
    }

    public removePlayer(player){
        this.players = this.players.filter(p => p !== player);
    }

    public getPlayerByNick(nick){
        return this.players.find(player=>player.nickname===nick);
    }

    public getPlayerById(id:number):LobbyPlayer{
        return this.players.find(player=>player.id === id);
    }

    public getPlayers(team:Team):LobbyPlayer[]{
        return this.players.filter(x=>x.team == team);
    }

    public getClientPlayer(){
        for(let i=0; i < this.players.length; i++){
            let player = this.players[i];
            if(player.id == this.playerService.getId()){
                return player;
            }
        }
    }

    public isClientPlayer(player:LobbyPlayer):boolean{
        return player.id == this.playerService.getId();
    }
}
