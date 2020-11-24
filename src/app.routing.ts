import { Routes, RouterModule, Router } from "@angular/router";
import { MainMenuComponent } from './app/main-menu/main-menu.component';
import { LobbyComponent } from './app/lobby/lobby.component';
import { VotingComponent } from './app/voting/voting.component';
import { GameComponent } from './app/game/game.component';
import { SummaryComponent } from './app/summary/summary.component';
import { MainComponent } from './app/main/main.component';

const ROUTES: Routes = [
    {path: '', redirectTo: 'main', pathMatch: "full"},
    {path: "main", component: MainComponent},
    {path: 'mainmenu', component: MainMenuComponent},
    {path: 'lobby', component:LobbyComponent},
    {path: 'voting', component:VotingComponent},
    {path: 'game', component:GameComponent},
    {path: 'summary', component:SummaryComponent}
];
export const CONST_ROUTING = RouterModule.forRoot(ROUTES);
