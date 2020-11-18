import { Injectable } from '@angular/core';
import { Team } from './lobby/team';
import { Role } from './game/role';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  private id: number;
  private nickname: string = 'Player';
  private role: Role;
  private team: Team;

  public getId(): number {
    return this.id;
  }

  public setId(id: number): void {
    this.id = id;
  }

  public getNickname(): string {
    return this.nickname;
  }

  public setNickname(nickname: string): void {
    this.nickname = nickname;
  }

  public getRole() {
    return this.role;
  }

  public setRole(role: Role) {
    this.role = role;
  }

  public getTeam() {
    return this.team;
  }

  public setTeam(team: Team) {
    this.team = team;
  }
}
