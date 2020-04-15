import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
  })
  export class PlayerService {
  
    private static nickname: string;
  
    public static getNickname():string{
        return this.nickname;
    }

    public static setNickname(nickname:string):void{
        this.nickname = nickname;
    }
  }