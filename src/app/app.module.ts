import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { BoardComponent } from './board/board.component';
import { LobbyComponent } from './lobby/lobby.component';
import { CONST_ROUTING } from 'src/app.routing';
import { ConnectionService } from './connection.service';
import { Router } from '@angular/router';
import { BossComponent } from './boss/boss.component';

@NgModule({
  declarations: [
    AppComponent,
    MainMenuComponent,
    BoardComponent,
    LobbyComponent,
    BossComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CONST_ROUTING,

  ],
  providers: [ConnectionService],
  bootstrap: [AppComponent]
})
export class AppModule { }
