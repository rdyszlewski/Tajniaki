import { ConnectionService } from '../connection.service';
import { LobbyModel } from './lobbyModel';
import { PlayerService } from '../playerService';
import { ConnectionPath } from '../shared/connectionPath';
import { Player } from './lobby_player';
import { Team } from './team';
import { GameService } from '../gameService';
import { Router } from '@angular/router';
import { PlayerAdapter } from '../shared/adapters/playerAdapter';
import { DialogService } from '../dialog/dialog.service';
import { Injector } from '@angular/core';
import { DialogMode } from '../dialog/dialogMode';
import { DialogComponent } from '../dialog/dialog.component';

export class LobbyEventsManager{
    
    private model: LobbyModel;
    private dialog: DialogService;

    public constructor(private router:Router, private injector:Injector){

    }

    public init(model:LobbyModel){
        this.model = model;
        this.dialog = this.injector.get(DialogService);
        
        this.subscribeJoinToLobbyResponse();
        this.subscribePlayerConnect();
        this.subscribeChangeTeam();
        this.subscribeReady();
        this.subscribeEndLobby();
        this.subscribeDisconnect();
        this.subscribeOnCloseEvent();
    }

    private subscribeOnCloseEvent(){
        ConnectionService.setOnCloseEvent(()=>{
            this.unsubscribeAll();
            this.dialog.setMessage("Rozłączono z serwerem").setMode(DialogMode.WARNING).setOnOkClick(()=>{
                this.unsubscribeAll();
                this.dialog.close();
                this.router.navigate(['mainmenu']); 
            }).open(DialogComponent);
        });
    }

    private subscribeDisconnect(){
        ConnectionService.subscribe(ConnectionPath.DISCONNECT_RESPONSE, message=>{
            let data = JSON.parse(message.body);
            let player = PlayerAdapter.createPlayer(data['disconnectedPlayer']);
            this.model.removePlayer(this.model.getPlayerById(player.id));
        });
    }

    private subscribeEndLobby() {
        ConnectionService.subscribe(ConnectionPath.LOBBY_END_RESPONSE, message => {
            // TODO: uruchamianie kolejnego ekranu
            console.log("Rozpoczynamy grę");
            this.router.navigate(['voting']);
        });
    }

    private subscribeReady() {
        ConnectionService.subscribe(ConnectionPath.READY_RESPONSE, message => this.setPlayerReady(message));
    }

    private setPlayerReady(message: any) {
        var data = JSON.parse(message.body);
        let player = this.model.getPlayerById(data["playerId"]);
        player.ready = data['ready'];
    }

    private subscribeChangeTeam() {
        ConnectionService.subscribe(ConnectionPath.CHANGE_TEAM_REPONSE, message => this.setPlayerTeam(message));
    }

    private setPlayerTeam(message: any) {
        var json = JSON.parse(message.body);
        console.log(json);
        var player = this.model.getPlayerById(json['id']);
        player.team = this.getTeam(json['team']);
    }

    private subscribePlayerConnect() {
        ConnectionService.subscribe(ConnectionPath.CONNECT_RESPONSE, message => {
            let data = JSON.parse(message.body);
            let newPlayer = PlayerAdapter.createPlayer(data);
            this.model.addPlayer(newPlayer);
        });
    }

    private subscribeJoinToLobbyResponse() {
        ConnectionService.subscribe(ConnectionPath.PLAYERS_RESPONSE, (message) => {
            var data = JSON.parse(message.body);
            PlayerService.setId(data['playerId']);
            this.setSettings(data['settings']);
            this.setPlayers(data['players']);
            this.model.setMinPlayersInTeam(data['minPlayersInTeam']);
            this.model.setMaxPlayersInTeam(data['maxPlayersInTeam']);
            console.log(this.model.getMinPlayersInTeam());
            console.log(this.model.getMaxPlayersInTeam());
        });
    }

    private getTeam(teamText:string):Team{
        switch(teamText){
          case "RED":
            return Team.RED;
          case "BLUE":
            return Team.BLUE;
          case "OBSERVER":
            return Team.OBSERVER;
        }
    }

    private setSettings(settings): void {
        let maxTeamSize = settings['maxTeamSize'];
        GameService.setMaxTeamSize(maxTeamSize);
    }

    private setPlayers(players):void{
        players.forEach(playerElement => {
            var player = PlayerAdapter.createPlayer(playerElement);
            this.model.addPlayer(player);
            if (this.isClientPlayer(player)){
                this.model.setClientPlayer(player);
            };
        });
    }


    private isClientPlayer(player:Player):boolean{
        // TODO: zastanwoić się, co zrobić w sytuacji, w której więcej graczy ustawi sobie ten sam nick
        // TODO: zrobić to za pomocą 
        return player.nickname == PlayerService.getNickname();
    }

    public sendReady(){
        ConnectionService.send(!this.model.getClientPlayer().ready, ConnectionPath.READY);
    }

    public sendJoinBlue(){
        ConnectionService.send(Team.BLUE, ConnectionPath.CHANGE_TEAM);
    }

    public sendJoinRed(){
        ConnectionService.send(Team.RED, ConnectionPath.CHANGE_TEAM);
    }

    public sendJoinToLobby(){
        ConnectionService.send(PlayerService.getNickname(), ConnectionPath.CONNECT);
    }

    public unsubscribeAll(){
        ConnectionService.unsubscribe(ConnectionPath.DISCONNECT_RESPONSE);
        ConnectionService.unsubscribe(ConnectionPath.LOBBY_END_RESPONSE);
        ConnectionService.unsubscribe(ConnectionPath.READY_RESPONSE);
        ConnectionService.unsubscribe(ConnectionPath.CHANGE_TEAM_REPONSE);
        ConnectionService.unsubscribe(ConnectionPath.CONNECT_RESPONSE);
        ConnectionService.unsubscribe(ConnectionPath.PLAYERS_RESPONSE);
    }
}