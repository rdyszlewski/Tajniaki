import { Player } from './lobby_player';
import { Team } from './team';

export class LobbyModel{

    // TODO: dodać informacje o minimalnej i maksymalnej liczbie graczy
    private clientPlayer: Player;
    private minPlayersInTeam: number;
    private maxPlayerInTeam: number;
    private players: Player[] = [];

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

    public addPlayer(player:Player){
        if(!this.existsPlayer(player)){
            this.players.push(player);
        }
    }

    private existsPlayer(player:Player){
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

    public isClientPlayer(player:Player):boolean{
        return player.id == this.clientPlayer.id;
    }
}