import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GameService {

  private id: string;
  private maxTeamSize: number;

  public getId(): string {
    return this.id;
  }

  public setId(id: string) {
    this.id = id;
  }

  public getMaxTeamSize(): number {
    return this.maxTeamSize;
  }

  public setMaxTeamSize(size: number) {
    this.maxTeamSize = size;
  }
}
