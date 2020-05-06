import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { LobbyComponent } from './lobby/lobby.component';
import { CONST_ROUTING } from 'src/app.routing';
import { ConnectionService } from './connection.service';
import { Router } from '@angular/router';
import { BossComponent } from './voting/voting.component';
import { GameComponent } from './game/game.component';
import { TooltipModule } from 'ng2-tooltip-directive';
import { TooltipCreator } from './game/tooltip_creator';
import { DialogComponent } from './dialog/dialog.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    MainMenuComponent,
    LobbyComponent,
    BossComponent,
    GameComponent,
    DialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CONST_ROUTING,
    TooltipModule,
    BrowserAnimationsModule
  ],
  providers: [ConnectionService],
  bootstrap: [AppComponent]
})
export class AppModule { }
