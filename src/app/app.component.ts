import { Component, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { DialogService } from './dialog/dialog.service';
import { DialogMode } from './dialog/dialogMode';
import { DialogComponent } from './dialog/dialog.component';
import { ConnectionService } from './connection.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  private readonly title = 'Tajniaki';

  constructor(private translate: TranslateService) {
    translate.setDefaultLang('pl');
  }
}
