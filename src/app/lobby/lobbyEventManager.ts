import { ConnectionService } from '../connection.service';
import { LobbyModel } from './lobbyModel';
import { PlayerService } from '../playerService';
import { ConnectionPath } from '../shared/connectionPath';
import { Player } from './lobby_player';
import { Team } from './team';

export class LobbyEventsManager{
    
    private model: LobbyModel;

    public init(model:LobbyModel){
        this.model = model;
        
        this.subscribeJoinToLobbyResponse();
        this.subscribePlayerConnect();
        this.subscribeChangeTeamd();
        this.subscribeReady();
        this.subscribeEndLobby();
    }

    public connect(localhost, port){
        ConnectionService.connect(localhost, port, function(){
            ConnectionService.send(PlayerService.getNickname(), ConnectionPath.CONNECT);
          });
    }

    private subscribeEndLobby() {
        ConnectionService.subscribe(ConnectionPath.LOBBY_END_RESPONSE, message => {
            // TODO: uruchamianie kolejnego ekranu
            console.log("Rozpoczynamy grę");
        });
    }

    private subscribeReady() {
        ConnectionService.subscribe(ConnectionPath.READY_RESPONSE, message => this.setPlayerReady(message));
    }

    private setPlayerReady(message: any) {
        var json = JSON.parse(message.body);
        let nickname = json['nickname'];
        var player = this.model.getPlayerByNick(nickname);
        player.ready = json['ready'];
    }

    private subscribeChangeTeamd() {
        ConnectionService.subscribe(ConnectionPath.CHANGE_TEAM_REPONSE, message => this.setPlayerTeam(message));
    }

    private setPlayerTeam(message: any) {
        var json = JSON.parse(message.body);
        let nickname = json['nickname'];
        var player = this.model.getPlayerByNick(nickname);
        player.team = this.getTeam(json['team']);
    }

    private subscribePlayerConnect() {
        ConnectionService.subscribe(ConnectionPath.CONNECT_RESPONSE, message => {
            console.log("Gracz " + message.body + " się podłączył");
            var newPlayer = new Player(message.body, Team.OBSERVER, false);
            this.model.addPlayer(newPlayer);
        });
    }

    private subscribeJoinToLobbyResponse() {
        ConnectionService.subscribe(ConnectionPath.PLAYERS_RESPONSE, (players) => this.setPlayers(players));
    }

    private getTeam(teamText:string):Team{
        console.log("getTeam");
        switch(teamText){
          case "RED":
            return Team.RED;
          case "BLUE":
            return Team.BLUE;
          case "OBSERVER":
            return Team.OBSERVER;
        }
      }

    private setPlayers(message):void{
        var body = message.body;
        var json = JSON.parse(body);
        json.forEach(element => {
            // TODO: dodać informacje, czy gracz jest gotowy
            var player = new Player(element["nickName"], this.getTeam(element["team"]), element["ready"]);
            this.model.addPlayer(player);
            if (this.isClientPlayer(player))
            this.model.setClientPlayer(player);
        });
    }

    private isClientPlayer(player:Player):boolean{
        // TODO: zastanwoić się, co zrobić w sytuacji, w której więcej graczy ustawi sobie ten sam nick
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
}