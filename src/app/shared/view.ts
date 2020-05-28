import { HostListener } from '@angular/core';

export class View{

    protected onLeave;

    protected setOnLeave(method){
        this.onLeave = method;
    }

    @HostListener('window:popstate', ['$event'])
    onPopState(event) { // back button pressed
        this.onLeave();    
    }


    @HostListener('window:unload')
    onUnload(){
        this.onLeave();
    }
}