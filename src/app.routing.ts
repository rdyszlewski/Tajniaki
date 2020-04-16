import { Routes, RouterModule, Router } from "@angular/router";
import { MainMenuComponent } from './app/main-menu/main-menu.component';
import { LobbyComponent } from './app/lobby/lobby.component';
import { BoardComponent } from './app/board/board.component';
import { BossComponent } from './app/boss/boss.component';
import { GameComponent } from './app/game/game.component';

const ROUTES: Routes = [
    {path: '', redirectTo: 'mainmenu', pathMatch: "full"},
    {path: 'mainmenu', component: MainMenuComponent},
    {path: 'lobby', component:LobbyComponent,},
    {path: 'board', component:BoardComponent},
    {path: 'boss', component:BossComponent},
    {path: 'game', component:GameComponent}
];
export const CONST_ROUTING = RouterModule.forRoot(ROUTES);