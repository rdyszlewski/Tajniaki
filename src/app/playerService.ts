import { Injectable } from '@angular/core';
import { Team } from './lobby/team';
import { Role } from './game/role';

@Injectable({
    providedIn: 'root'
  })
  export class PlayerService {
  
    private static nickname: string;
    private static role: Role;
    private static team: Team;
  
    public static getNickname():string{
        return this.nickname;
    }

    public static setNickname(nickname:string):void{
        this.nickname = nickname;
    }

    public static getRole(){
      return this.role;
    }

    public static setRole(role:Role){
      this.role = role;
    }

    public static getTeam(){
      return this.team;
    }

    public static setTeam(team:Team){
      this.team = team;
    }
  }