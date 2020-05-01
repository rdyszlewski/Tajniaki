import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class GameService{

    // TODO: wstawić tutaj ifnormacje dotyczące gry
    private static maxTeamSize: number;

    public static getMaxTeamSize():number{
        return this.maxTeamSize;
    }

    public static setMaxTeamSize(size: number){
        this.maxTeamSize = size;
    }
}
