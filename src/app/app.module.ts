import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { LobbyComponent } from './lobby/lobby.component';
import { CONST_ROUTING } from 'src/app.routing';
import { ConnectionService } from './connection.service';
import { VotingComponent } from './voting/voting.component';
import { GameComponent } from './game/game.component';
import { TooltipModule } from 'ng2-tooltip-directive';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SummaryComponent } from './summary/summary.component';
import { CookieService} from "ngx-cookie-service"
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import { FormsModule } from '@angular/forms';
import { MainComponent } from './main/main.component';
import { DialogComponent } from './widgets/dialog/dialog.component';
import { MenuComponent } from './widgets/menu/menu.component';


@NgModule({
  declarations: [
    AppComponent,
    MainMenuComponent,
    LobbyComponent,
    VotingComponent,
    GameComponent,
    DialogComponent,
    SummaryComponent,
    MainComponent,
    MenuComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    CONST_ROUTING,
    TooltipModule,
    BrowserAnimationsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [ConnectionService, CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function HttpLoaderFactory(http:HttpClient){
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

