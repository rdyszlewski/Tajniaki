import { Injectable } from '@angular/core';
import * as uuid from 'uuid'

@Injectable({
    providedIn: 'root'
})
export class GameService{

  // TODO: czy istnieje sposób, żeby ustawić tutaj typ ?
  // TODO: zlikwidować statyczność
  private static id:string;

  public static getId():string{
    return this.id;
  }

  public static setId(id:string){
    this.id = id;
  }

    // TODO: to nie musi być statyczne
    // TODO: wstawić tutaj ifnormacje dotyczące gry
    private static maxTeamSize: number;

    public static getMaxTeamSize():number{
        return this.maxTeamSize;
    }

    public static setMaxTeamSize(size: number){
        this.maxTeamSize = size;
    }
}
